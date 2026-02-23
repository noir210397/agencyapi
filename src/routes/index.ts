import { Router } from "express";
import authRoutes from "./auth.route"
import shiftRoutes from "./shift.route"
import bookingRoutes from "./booking.route"
import userRoutes from "./user.route"
import clientRoutes from "./client.route"
import jobRoutes from "./job.route"
import { authorize } from "src/middlewares/auth.middleware";


const router = Router();
//authroutes
router.use("/auth", authRoutes)
//shift routes
router.use("/shift", shiftRoutes)
//booking routes
router.use("/booking", bookingRoutes)
//user routes
router.use("/user", userRoutes)
//client routes
router.use("/client", authorize("ADMIN,MANAGER"), clientRoutes)
//job routes
router.use("/job", jobRoutes)



export default router