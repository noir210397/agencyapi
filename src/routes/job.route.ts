import { Router } from "express";
import { createJobHandler, deleteJobHandler, getJobsHandler, getSingleJobHandler, updateJobHandler } from "src/controllers/job.controller";
import { authorize } from "src/middlewares/auth.middleware";
import { validateIdParam } from "src/middlewares/valiadateparams.middleware";

const router = Router()
const routeName = "job"
router.get("/", getJobsHandler)
router.get("/:id", validateIdParam(routeName), getSingleJobHandler)
router.put("/:id", authorize("ADMIN,MANAGER"), validateIdParam(routeName), updateJobHandler)
router.delete("/:id", authorize("ADMIN,MANAGER"), validateIdParam(routeName), deleteJobHandler)
router.post("/", authorize("ADMIN,MANAGER"), createJobHandler)

export default router
