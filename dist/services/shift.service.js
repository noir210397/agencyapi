"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShift = exports.createShift = void 0;
exports.bookSingleAgent = bookSingleAgent;
exports.deleteShift = deleteShift;
exports.getShifts = getShifts;
exports.getSingleShift = getSingleShift;
const mongoose_1 = __importStar(require("mongoose"));
const base_1 = require("../constants/base");
const http_1 = require("../constants/http");
const booking_model_1 = __importDefault(require("../models/booking.model"));
const client_model_1 = __importDefault(require("../models/client.model"));
const shift_model_1 = __importDefault(require("../models/shift.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const roles_1 = require("../types/roles");
const customerror_1 = require("../utils/customerror");
const formatData_1 = require("../utils/formatData");
const createShift = async (shift) => {
    // 1) Client must exist
    const { agents, agentsRequired, clientId, endTime, isPublic, startTime, } = shift;
    const client = await client_model_1.default.findById({ _id: clientId }).lean();
    if (!client) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, null, `no client found with id ${clientId}`);
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
            throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, null, "every agent can only be booked once per shift");
        }
        const agentsDetail = await validateAgents(agents);
        // ---- Transaction (all-or-nothing) ----
        const session = await mongoose_1.default.startSession();
        const shiftId = new mongoose_1.Types.ObjectId();
        const { address, companyName } = client;
        const bookings = agentsDetail.map(details => ({ ...details, client: { address: address, companyName: companyName }, shiftId: shiftId, startTime: startTime.toDate(), endTime: endTime.toDate() }));
        try {
            await session.withTransaction(async () => {
                // Create shift (invisible until commit)
                await shift_model_1.default.create([{
                        _id: shiftId,
                        client: { address, companyName }, isPublic, agentsRequired, startTime: startTime.toDate(), endTime: endTime.toDate(), agentsBooked: 0, availableSlots: agentsRequired
                    }], { session });
                // Bulk insert all bookings; ANY failure -> throw -> rollback
                await booking_model_1.default.insertMany(bookings, { session, ordered: true });
                // Single guarded decrement by total booked
                await shift_model_1.default.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: agents.length, availableSlots: -agents.length } }, { session, new: true });
            }, { writeConcern: { w: "majority" } });
        }
        catch (err) {
            if (err instanceof customerror_1.CustomError)
                throw err;
            throw new customerror_1.CustomError(http_1.StatusCode.Status500ServerError);
        }
        finally {
            await session.endSession();
        }
    }
    else {
        shift_model_1.default.create({
            client, agentsRequired, isPublic, endTime: endTime.toDate(), startTime: startTime.toDate(), agentsBooked: 0, availableSlots: agentsRequired, agents: null
        });
    }
};
exports.createShift = createShift;
const updateShift = async (newShiftValues, shiftId) => {
    const { newAgents, removedAgents, ...rest } = newShiftValues;
    const session = await mongoose_1.default.startSession();
    try {
        await session.withTransaction(async () => {
            const shiftExists = await shift_model_1.default.exists({ _id: shiftId }).session(session);
            if (!shiftExists)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, `no shift found with id:${shiftId}`);
            //if other properties are to be updated
            if (Object.keys(rest).length > 0) {
                await shift_model_1.default.findByIdAndUpdate(shiftId, { ...rest }).session(session);
                //update start and endtime based on starttime
                if (rest.startTime) {
                    await booking_model_1.default.updateMany({ shiftId: shiftId }, { startTime: rest.startTime.toDate(), endTime: rest.endTime.toDate() }).session(session);
                }
            }
            if (removedAgents && removedAgents.length > 0) {
                await booking_model_1.default.deleteMany({ agentId: { $in: removedAgents }, shiftId: shiftId }).session(session);
                await shift_model_1.default.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: -removedAgents.length, availableSlots: removedAgents.length } }).session(session);
            }
            if (newAgents && newAgents.length > 0) {
                const agentsDetail = await validateAgents(newAgents);
                const shift = await shift_model_1.default.findById(shiftId).session(session).lean();
                const booked = await booking_model_1.default.find({ shiftId: shiftId, }).in("agentId", newAgents).lean().session(session);
                if (booked.length > 0)
                    throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden, null, "booking same agent multiple times for same shift is not allowed");
                const bookings = agentsDetail.map(details => ({ ...details, client: shift.client, shiftId: shiftId, startTime: shift.startTime, endTime: shift.endTime }));
                if (shift.availableSlots >= newAgents.length) {
                    await booking_model_1.default.insertMany(bookings, { session, ordered: false });
                    await shift_model_1.default.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: newAgents.length, availableSlots: -newAgents.length } }).session(session);
                    //send email or text to each agent
                }
                else
                    throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden, `there are currently only ${shift.availableSlots} slot${shift.availableSlots > 1 ? "s" : ""} remaining`);
            }
        });
    }
    catch (err) {
        if (err instanceof customerror_1.CustomError)
            throw err;
        throw new customerror_1.CustomError(http_1.StatusCode.Status500ServerError, null, "unable to update shift");
    }
    finally {
        await session.endSession();
    }
};
exports.updateShift = updateShift;
async function bookSingleAgent(agentId, shiftId) {
    const agent = await user_model_1.default.findOne({ _id: agentId, role: roles_1.Role.AGENT }).lean();
    if (!agent) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, null, `no agent found with id ${agentId}`);
    }
    const session = await mongoose_1.default.startSession();
    try {
        await session.withTransaction(async () => {
            const shift = await shift_model_1.default.findById(shiftId).lean().session(session);
            if (!shift)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, `no shift with id ${shiftId} found`);
            const booked = await booking_model_1.default.exists({ agentId: agentId, shiftId: shiftId }).session(session);
            if (booked)
                throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden, null, "this agent is alreay booked for this shift");
            if (shift.availableSlots > 0) {
                await booking_model_1.default.create({
                    shiftId,
                    agentId: agent._id,
                    client: shift.client,
                    agentDetails: {
                        fullName: `${agent.firstName} ${agent.lastName}`,
                        email: agent.email,
                    }
                }, { session, ordered: true });
                await shift_model_1.default.findByIdAndUpdate(shiftId, { $inc: { agentsBooked: 1, availableSlots: -1 }, }).session(session);
            }
            else
                throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden, null, `there are currently only ${shift.agentsRequired - shift.agentsBooked} slots remaining`);
        });
    }
    catch (err) {
        if (err instanceof customerror_1.CustomError)
            throw err;
        else
            throw new customerror_1.CustomError(http_1.StatusCode.Status500ServerError, null, "unable to update shift");
    }
    finally {
        await session.endSession();
    }
}
async function deleteShift(shiftId, withBookings) {
    const session = await mongoose_1.default.startSession();
    try {
        await session.withTransaction(async () => {
            const shift = await shift_model_1.default.findById({ _id: shiftId }).lean();
            if (!shift)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, `no shift found with Id:${shiftId}`);
            if (withBookings) {
                await booking_model_1.default.deleteMany({ shiftId: shiftId }).session(session);
            }
            else {
                await booking_model_1.default.updateMany({ shiftId: shiftId }, { status: "inactive" }).session(session);
            }
            await shift_model_1.default.findByIdAndDelete(shiftId).session(session);
        });
    }
    catch (err) {
        if (err instanceof customerror_1.CustomError)
            throw err;
        else
            throw new customerror_1.CustomError(http_1.StatusCode.Status500ServerError, null, `unable to delete ${withBookings ? "shift along with its bookings" : "shift"}`);
    }
    finally {
        await session.endSession();
    }
}
async function getShifts(user, query) {
    const { page } = query;
    if (user.role === roles_1.Role.AGENT.toString()) {
        const today = new Date();
        const shifts = await shift_model_1.default.find({ isPublic: true, startTime: { $gte: today } }).skip(page === 1 ? 0 : page * base_1.pageSize).limit(base_1.pageSize).lean();
        return (0, formatData_1.formatJSON)(shifts);
    }
    else {
        const shifts = await shift_model_1.default.find().skip(page === 1 ? 0 : page * base_1.pageSize).limit(base_1.pageSize).lean();
        return (0, formatData_1.formatJSON)(shifts);
    }
}
async function getSingleShift(shiftId, user) {
    if (user.role === roles_1.Role.AGENT.toString()) {
        const today = new Date();
        const shift = await shift_model_1.default.findById(shiftId, null, { isPublic: true, startTime: { $gte: today } }).lean();
        if (!shift)
            throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "shift not found");
        return (0, formatData_1.formatJSON)(shift);
    }
    else {
        const shift = await shift_model_1.default.findById(shiftId).lean();
        if (!shift)
            throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "shift not found");
        return (0, formatData_1.formatJSON)(shift);
    }
}
//helper
async function validateAgents(agentList) {
    const agents = await user_model_1.default.find({ _id: { $in: agentList }, role: roles_1.Role.AGENT })
        .lean();
    if (agents.length !== agentList.length) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, null, `please ensure all user ids are valid and have roles of agent`);
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
