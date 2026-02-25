"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookings = getBookings;
exports.deleteBooking = deleteBooking;
exports.cancelBooking = cancelBooking;
exports.updateBooking = updateBooking;
exports.getSingleBooking = getSingleBooking;
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("../constants/http");
const booking_model_1 = __importDefault(require("../models/booking.model"));
const shift_model_1 = __importDefault(require("../models/shift.model"));
const roles_1 = require("../types/roles");
const customerror_1 = require("../utils/customerror");
const formatData_1 = require("../utils/formatData");
async function getBookings(user) {
    const { role, sub } = user;
    if (role === roles_1.Role.AGENT.toString()) {
        const bookings = await booking_model_1.default.find({ agentId: sub }).lean();
        return (0, formatData_1.formatJSON)(bookings);
    }
    else {
        const bookings = await booking_model_1.default.find().lean();
        return (0, formatData_1.formatJSON)(bookings);
    }
}
async function deleteBooking(bookingId) {
    const { deletedCount } = await booking_model_1.default.deleteOne({ _id: bookingId });
    if (deletedCount === 0)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, `booking with id:${bookingId} not found`);
}
async function cancelBooking(user, bookingId) {
    const { sub } = user;
    const session = await mongoose_1.default.startSession();
    try {
        const booking = await booking_model_1.default.findOneAndUpdate({ agentId: sub, _id: bookingId }, { status: "cancelled" }, { new: true }).lean().session(session);
        if (!booking) {
            throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "booking was not found");
        }
        await shift_model_1.default.findByIdAndUpdate(booking._id, { $inc: { agentsBooked: -1, availableSlots: 1 } }).session(session);
    }
    catch (err) {
        if (err instanceof customerror_1.CustomError)
            throw err;
        else
            throw new customerror_1.CustomError(http_1.StatusCode.Status500ServerError, null, "unable to delete booking try again");
    }
    finally {
        await session.endSession();
    }
}
async function updateBooking(update, bookingId) {
    const updated = await booking_model_1.default.findOneAndUpdate({ _id: bookingId }, update, { new: true }).lean();
    if (!updated) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "booking was not found");
    }
}
async function getSingleBooking(bookingId, user) {
    const booking = await booking_model_1.default.findOne({ _id: bookingId, }).lean();
    if (!booking)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "booking was not found");
    if (user.role !== roles_1.Role.AGENT.toString()) {
        return (0, formatData_1.formatJSON)(booking);
    }
    else {
        if (booking.agentId.toString() === user.sub)
            return (0, formatData_1.formatJSON)(booking);
        throw new customerror_1.CustomError(http_1.StatusCode.Status401Unauthorized);
    }
}
