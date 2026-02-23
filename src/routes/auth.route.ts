import { Router } from "express";
import { changePasswordHandler, createAdminHandler, createAgentHandler, createManagerHandler, getResetTokenHandler, resetPasswordHandler, signInUserHandler } from "src/controllers/auth.controller";
import { authorize } from "src/middlewares/auth.middleware";
const router = Router()

router.post("/login", signInUserHandler)
router.post("/admin", authorize("MANAGER"), createAdminHandler)
router.post("/manager", authorize("MANAGER"), createManagerHandler)
router.post("/reset-token", getResetTokenHandler)
router.post("/reset-password", resetPasswordHandler)
router.post("/change-password", authorize(), changePasswordHandler)
router.post("/", createAgentHandler)


export default router