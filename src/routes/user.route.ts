import { Router } from "express";
import { deleteUserHandler, getSingleUserHandler, getUsersHandler, updateUserHandler } from "src/controllers/user.controller";
import { authorize } from "src/middlewares/auth.middleware";
import { validateIdParam } from "src/middlewares/valiadateparams.middleware";

const router = Router()
const routeName = "user"
router.get("/", authorize("ADMIN,MANAGER"), getUsersHandler)
router.get("/:id", validateIdParam(routeName), authorize("ADMIN,MANAGER"), getSingleUserHandler)
router.put("/:id", validateIdParam(routeName), authorize(), updateUserHandler)
router.delete("/:id", validateIdParam(routeName), authorize(), deleteUserHandler)

export default router
