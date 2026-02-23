import { Router } from "express";
import { cancelBookingHandler, deleteBookinghandler, getBookingsHandler, getSingleBookingHandler, updateBookinghandler } from "src/controllers/booking.controller";
import { authorize } from "src/middlewares/auth.middleware";
import { validateIdParam } from "src/middlewares/valiadateparams.middleware";

const router = Router()
const routeName = "booking"
router.get("/", authorize(), getBookingsHandler)
router.put('/:id', authorize("ADMIN,MANAGER"), validateIdParam(routeName), updateBookinghandler)
router.put('/cancel/:id', authorize("AGENT"), validateIdParam(routeName), cancelBookingHandler)
router.get("/:id", authorize(), validateIdParam(routeName), getSingleBookingHandler)
router.delete('/:id', authorize("ADMIN,MANAGER"), validateIdParam(routeName), deleteBookinghandler)

export default router