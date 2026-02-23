import { StatusCode } from "src/constants/http";
import { cancelBooking, deleteBooking, getBookings, getSingleBooking, updateBooking } from "src/services/booking.service";
import { CustomError } from "src/utils/customerror";
import { updateBookingSchema } from "src/validators/booking/booking.validators";
export const getBookingsHandler = async (req, res) => {
    const bookings = await getBookings(req.user);
    return res.json(bookings);
};
export const getSingleBookingHandler = async (req, res) => {
    const booking = await getSingleBooking(req.params.id, req.user);
    return res.json(booking);
};
export const deleteBookinghandler = async (req, res) => {
    await deleteBooking(req.params.id);
    return res.sendStatus(204);
};
export const updateBookinghandler = async (req, res) => {
    const { success, data, error } = updateBookingSchema.safeParse(req.body);
    if (!success)
        throw new CustomError(StatusCode.Status400BadRequest, error);
    if (Object.keys(data).length === 0)
        return res.json("no updates needed");
    await updateBooking(data, req.params.id);
    return res.sendStatus(204);
};
export const cancelBookingHandler = async (req, res) => {
    await cancelBooking(req.user, req.params.id);
    return res.sendStatus(204);
};
