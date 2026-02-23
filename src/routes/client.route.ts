import { Router } from "express";
import { createClientHandler, deleteClientHandler, getClientsHandler, getSingleClientHandler, updateClientHandler } from "src/controllers/client.controller";
import { validateIdParam } from "src/middlewares/valiadateparams.middleware";

const router = Router()
const routeName = "client"
router.get("/", getClientsHandler)
router.get("/:id", validateIdParam(routeName), getSingleClientHandler)
router.put("/:id", validateIdParam(routeName), updateClientHandler)
router.delete("/:id", validateIdParam(routeName), deleteClientHandler)
router.post("/", createClientHandler)

export default router
