import mongoose, { Types } from "mongoose";
import { pageSize } from "../../src/constants/base";
import { StatusCode } from "../../src/constants/http";
import Booking from "../../src/models/booking.model";
import Client from "../../src/models/client.model";
import Shift from "../../src/models/shift.model";
import User from "../../src/models/user.model";
import { Role } from "../../src/types/roles";
import { CustomError } from "../../src/utils/customerror";
import { formatJSON } from "../../src/utils/formatData";
export const createShift = async (shift) => {
    // 1) Client must exist
    const { agents, agentsRequired, clientId, endTime, isPublic, startTime, } = shift;
    const client = await Client.findById({ _id: clientId }).lean();
    if (!client) {
        throw new CustomError(StatusCode.Status400BadRequest, null, `no client found with id ${clientId}`);
    }
    if (agents.length > 0) {
        const seen = new Set();
        const duplicates = [];
        for (const id of agents) {
            if (seen.has(id))
                duplicates.push(id);
            else
                seen.add(id);
        }
        if (duplicates.length > 0) {
            throw new CustomError(StatusCode.Status400BadRequest, null, "every agent can only be booked once per shift");
        }
        const agentsDetail = await validateAgents(agents);
        // ---- Transaction (all-or-nothing) ----
        const session = await mongoose.startSession();
        const shiftId = new Types.ObjectId();
        const { address, companyName } = client;
        const bookings = agentsDetail.map(details => ({ ...details, client: { address: address, companyName: companyName }, shiftId: shiftId, startTime: startTime.toDate(), endTime: endTime.toDate() }));
        try {
            await session.withTransaction(async () => {
                // Create shift (invisible until commit)
                await Shift.create([{
                        _id: shiftId,
                        client: { address, companyName }, isPublic, agentsRequired, startTime: startTime.toDate(), endTime: endTime.toDate(), agentsBooked: 0, availableSlots: agentsRequired
                    }], { session });
                // Bulk insert all bookings; ANY failure -> throw -> rollback
                await Booking.insertMany(bookings, { session, ordered: true });
                // Single guarded decrement by total booked
                await Shift.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: agents.length, availableSlots: -agents.length } }, { session, new: true });
            }, { writeConcern: { w: "majority" } });
        }
        catch (err) {
            if (err instanceof CustomError)
                throw err;
            throw new CustomError(StatusCode.Status500ServerError);
        }
        finally {
            await session.endSession();
        }
    }
    else {
        Shift.create({
            client, agentsRequired, isPublic, endTime: endTime.toDate(), startTime: startTime.toDate(), agentsBooked: 0, availableSlots: agentsRequired, agents: null
        });
    }
};
export const updateShift = async (newShiftValues, shiftId) => {
    const { newAgents, removedAgents, ...rest } = newShiftValues;
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const shiftExists = await Shift.exists({ _id: shiftId }).session(session);
            if (!shiftExists)
                throw new CustomError(StatusCode.Status404NotFound, `no shift found with id:${shiftId}`);
            //if other properties are to be updated
            if (Object.keys(rest).length > 0) {
                await Shift.findByIdAndUpdate(shiftId, { ...rest }).session(session);
                //update start and endtime based on starttime
                if (rest.startTime) {
                    await Booking.updateMany({ shiftId: shiftId }, { startTime: rest.startTime.toDate(), endTime: rest.endTime.toDate() }).session(session);
                }
            }
            if (removedAgents && removedAgents.length > 0) {
                await Booking.deleteMany({ agentId: { $in: removedAgents }, shiftId: shiftId }).session(session);
                await Shift.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: -removedAgents.length, availableSlots: removedAgents.length } }).session(session);
            }
            if (newAgents && newAgents.length > 0) {
                const agentsDetail = await validateAgents(newAgents);
                const shift = await Shift.findById(shiftId).session(session).lean();
                const booked = await Booking.find({ shiftId: shiftId, }).in("agentId", newAgents).lean().session(session);
                if (booked.length > 0)
                    throw new CustomError(StatusCode.Status403Forbidden, null, "booking same agent multiple times for same shift is not allowed");
                const bookings = agentsDetail.map(details => ({ ...details, client: shift.client, shiftId: shiftId, startTime: shift.startTime, endTime: shift.endTime }));
                if (shift.availableSlots >= newAgents.length) {
                    await Booking.insertMany(bookings, { session, ordered: false });
                    await Shift.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: newAgents.length, availableSlots: -newAgents.length } }).session(session);
                    //send email or text to each agent
                }
                else
                    throw new CustomError(StatusCode.Status403Forbidden, `there are currently only ${shift.availableSlots} slot${shift.availableSlots > 1 ? "s" : ""} remaining`);
            }
        });
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(StatusCode.Status500ServerError, null, "unable to update shift");
    }
    finally {
        await session.endSession();
    }
};
export async function bookSingleAgent(agentId, shiftId) {
    const agent = await User.findOne({ _id: agentId, role: Role.AGENT }).lean();
    if (!agent) {
        throw new CustomError(StatusCode.Status400BadRequest, null, `no agent found with id ${agentId}`);
    }
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const shift = await Shift.findById(shiftId).lean().session(session);
            if (!shift)
                throw new CustomError(StatusCode.Status404NotFound, null, `no shift with id ${shiftId} found`);
            const booked = await Booking.exists({ agentId: agentId, shiftId: shiftId }).session(session);
            if (booked)
                throw new CustomError(StatusCode.Status403Forbidden, null, "this agent is alreay booked for this shift");
            if (shift.availableSlots > 0) {
                await Booking.create({
                    shiftId,
                    agentId: agent._id,
                    client: shift.client,
                    agentDetails: {
                        fullName: `${agent.firstName} ${agent.lastName}`,
                        email: agent.email,
                    }
                }, { session, ordered: true });
                await Shift.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: 1, availableSlots: -1 }, }).session(session);
            }
            else
                throw new CustomError(StatusCode.Status403Forbidden, null, `there are currently only ${shift.agentsRequired - shift.agentsBooked} slots remaining`);
        });
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        else
            throw new CustomError(StatusCode.Status500ServerError, null, "unable to update shift");
    }
    finally {
        await session.endSession();
    }
}
export async function deleteShift(shiftId, withBookings) {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const shift = await Shift.findById({ _id: shiftId }).lean();
            if (!shift)
                throw new CustomError(StatusCode.Status404NotFound, null, `no shift found with Id:${shiftId}`);
            if (withBookings) {
                await Booking.deleteMany({ shiftId: shiftId }).session(session);
            }
            else {
                await Booking.updateMany({ shiftId: shiftId }, { status: "inactive" }).session(session);
            }
            await Shift.findByIdAndDelete(shiftId).session(session);
        });
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        else
            throw new CustomError(StatusCode.Status500ServerError, null, `unable to delete ${withBookings ? "shift along with its bookings" : "shift"}`);
    }
    finally {
        await session.endSession();
    }
}
export async function getShifts(user, query) {
    const { page } = query;
    if (user.role === Role.AGENT.toString()) {
        const today = new Date();
        const shifts = await Shift.find({ isPublic: true, startTime: { $gte: today } }).skip(page === 1 ? 0 : page * pageSize).limit(pageSize).lean();
        return formatJSON(shifts);
    }
    else {
        const shifts = await Shift.find().skip(page === 1 ? 0 : page * pageSize).limit(pageSize).lean();
        return formatJSON(shifts);
    }
}
export async function getSingleShift(shiftId, user) {
    if (user.role === Role.AGENT.toString()) {
        const today = new Date();
        const shift = await Shift.findById(shiftId, null, { isPublic: true, startTime: { $gte: today } }).lean();
        if (!shift)
            throw new CustomError(StatusCode.Status404NotFound, null, "shift not found");
        return formatJSON(shift);
    }
    else {
        const shift = await Shift.findById(shiftId).lean();
        if (!shift)
            throw new CustomError(StatusCode.Status404NotFound, null, "shift not found");
        return formatJSON(shift);
    }
}
//helper
async function validateAgents(agentList) {
    const agents = await User.find({ _id: { $in: agentList }, role: Role.AGENT })
        .lean();
    if (agents.length !== agentList.length) {
        throw new CustomError(StatusCode.Status400BadRequest, null, `please ensure all user ids are valid and have roles of agent`);
    }
    // (Optional) fetch users now if you want snapshots
    return agents.map(user => {
        return {
            agentId: user._id,
            agentDetails: {
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email
            }
        };
    });
}
