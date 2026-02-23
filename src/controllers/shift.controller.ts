import { RequestHandler } from "express";
import { StatusCode } from "src/constants/http";
import { bookSingleAgent, createShift, deleteShift, getShifts, getSingleShift, updateShift } from "src/services/shift.service";
import { CustomError } from "src/utils/customerror";
import { querySchema, } from "src/validators/base";
import { bookSingleAgentschema, deleteShiftSchema, shiftSchema, updateShiftSchema } from "src/validators/shift/shift.validators";

export const getShiftsHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = querySchema.safeParse(req.query)
    if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
    const shifts = await getShifts(req.user!, data)
    return res.send(shifts)

}
export const getShiftHandler: RequestHandler = async (req, res) => {
    const shift = await getSingleShift(req.params.id, req.user!)
    return res.send(shift)
}
export const createShiftHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = shiftSchema.safeParse(req.body)
    if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
    await createShift(data)
    return res.sendStatus(200)
}
export const updateShiftHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = updateShiftSchema.safeParse(req.body)
    if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
    if (Object.keys(data).length === 0) res.sendStatus(200)
    await updateShift(data, req.params.id)
    return res.sendStatus(201)
}
export const deleteShiftHandler: RequestHandler = async (req, res) => {

    const { success, data, error } = deleteShiftSchema.safeParse({
        withBookings: req.query.withBookings
    })
    if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
    await deleteShift(req.params.id, data.withBookings)
    return res.sendStatus(204)
}
export const bookShiftHandler: RequestHandler = async (req, res) => {
    const { success, error, data } = bookSingleAgentschema.safeParse({
        agentId: req.user?.sub
    })
    if (!success) {
        throw new CustomError(StatusCode.Status400BadRequest, error)
    }
    await bookSingleAgent(data.agentId, req.params.id)
    return res.sendStatus(204)
}
