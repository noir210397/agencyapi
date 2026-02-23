import { Router } from "express";
import { bookShiftHandler, createShiftHandler, deleteShiftHandler, getShiftHandler, getShiftsHandler, updateShiftHandler } from "src/controllers/shift.controller";
import { authorize } from "src/middlewares/auth.middleware";
import { validateIdParam } from "src/middlewares/valiadateparams.middleware";

const router = Router()
const routeName = "shift"
router.post('/', authorize("ADMIN,MANAGER"), createShiftHandler)
router.post('/agent', authorize("AGENT"), bookShiftHandler)
router.get("/", authorize(), getShiftsHandler)
router.get("/:id", authorize(), validateIdParam("shift"), getShiftHandler)
router.put('/:id', authorize("ADMIN,MANAGER"), validateIdParam(routeName), updateShiftHandler)
router.delete('/:id', authorize("ADMIN,MANAGER"), validateIdParam(routeName), deleteShiftHandler)

export default router