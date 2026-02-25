"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookShiftHandler = exports.deleteShiftHandler = exports.updateShiftHandler = exports.createShiftHandler = exports.getShiftHandler = exports.getShiftsHandler = void 0;
const http_1 = require("../constants/http");
const shift_service_1 = require("../services/shift.service");
const customerror_1 = require("../utils/customerror");
const base_1 = require("../validators/base");
const shift_validators_1 = require("../validators/shift/shift.validators");
const getShiftsHandler = async (req, res) => {
    const { success, data, error } = base_1.querySchema.safeParse(req.query);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    const shifts = await (0, shift_service_1.getShifts)(req.user, data);
    return res.send(shifts);
};
exports.getShiftsHandler = getShiftsHandler;
const getShiftHandler = async (req, res) => {
    const shift = await (0, shift_service_1.getSingleShift)(req.params.id, req.user);
    return res.send(shift);
};
exports.getShiftHandler = getShiftHandler;
const createShiftHandler = async (req, res) => {
    const { success, data, error } = shift_validators_1.shiftSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    await (0, shift_service_1.createShift)(data);
    return res.sendStatus(200);
};
exports.createShiftHandler = createShiftHandler;
const updateShiftHandler = async (req, res) => {
    const { success, data, error } = shift_validators_1.updateShiftSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    if (Object.keys(data).length === 0)
        res.sendStatus(200);
    await (0, shift_service_1.updateShift)(data, req.params.id);
    return res.sendStatus(201);
};
exports.updateShiftHandler = updateShiftHandler;
const deleteShiftHandler = async (req, res) => {
    const { success, data, error } = shift_validators_1.deleteShiftSchema.safeParse({
        withBookings: req.query.withBookings
    });
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    await (0, shift_service_1.deleteShift)(req.params.id, data.withBookings);
    return res.sendStatus(204);
};
exports.deleteShiftHandler = deleteShiftHandler;
const bookShiftHandler = async (req, res) => {
    const { success, error, data } = shift_validators_1.bookSingleAgentschema.safeParse({
        agentId: req.user?.sub
    });
    if (!success) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    }
    await (0, shift_service_1.bookSingleAgent)(data.agentId, req.params.id);
    return res.sendStatus(204);
};
exports.bookShiftHandler = bookShiftHandler;
