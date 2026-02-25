"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBookingHandler = exports.updateBookinghandler = exports.deleteBookinghandler = exports.getSingleBookingHandler = exports.getBookingsHandler = void 0;
const http_1 = require("../constants/http");
const booking_service_1 = require("../services/booking.service");
const customerror_1 = require("../utils/customerror");
const booking_validators_1 = require("../validators/booking/booking.validators");
const getBookingsHandler = async (req, res) => {
    const bookings = await (0, booking_service_1.getBookings)(req.user);
    return res.json(bookings);
};
exports.getBookingsHandler = getBookingsHandler;
const getSingleBookingHandler = async (req, res) => {
    const booking = await (0, booking_service_1.getSingleBooking)(req.params.id, req.user);
    return res.json(booking);
};
exports.getSingleBookingHandler = getSingleBookingHandler;
const deleteBookinghandler = async (req, res) => {
    await (0, booking_service_1.deleteBooking)(req.params.id);
    return res.sendStatus(204);
};
exports.deleteBookinghandler = deleteBookinghandler;
const updateBookinghandler = async (req, res) => {
    const { success, data, error } = booking_validators_1.updateBookingSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    if (Object.keys(data).length === 0)
        return res.json("no updates needed");
    await (0, booking_service_1.updateBooking)(data, req.params.id);
    return res.sendStatus(204);
};
exports.updateBookinghandler = updateBookinghandler;
const cancelBookingHandler = async (req, res) => {
    await (0, booking_service_1.cancelBooking)(req.user, req.params.id);
    return res.sendStatus(204);
};
exports.cancelBookingHandler = cancelBookingHandler;
