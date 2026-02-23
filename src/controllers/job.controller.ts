import { RequestHandler } from "express";
import { StatusCode } from "src/constants/http";
import { createJob, deleteJob, getJobs, getSingleJob, updateJob } from "src/services/job.service";
import { CustomError } from "src/utils/customerror";
import { createJobSchema, updateJobSchema } from "src/validators/job/job.validators";

export const getJobsHandler: RequestHandler = async (req, res) => {
    const clients = await getJobs()
    return res.json(clients)
}
export const getSingleJobHandler: RequestHandler = async (req, res) => {
    const client = await getSingleJob(req.params.id)
    return res.json(client)
}
export const deleteJobHandler: RequestHandler = async (req, res) => {
    await deleteJob(req.params.id)
    return res.sendStatus(204)
}
export const updateJobHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = updateJobSchema.safeParse(req.body)
    if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
    await updateJob(req.params.id, data)
    return res.sendStatus(204)
}
export const createJobHandler: RequestHandler = async (req, res) => {
    const { success, data, error } = createJobSchema.safeParse(req.body)
    if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
    await createJob(data)
    return res.sendStatus(201)
}