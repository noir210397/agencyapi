import { StatusCode } from "src/constants/http";
import Job from "src/models/job.model";
import { CustomError } from "src/utils/customerror";
import { formatJSON } from "src/utils/formatData";
import { CreateJobRequest, UpdateJobRequest } from "src/validators/job/job.validators";


export async function createJob(job: CreateJobRequest) {
    await Job.create(job)
}
export async function getJobs() {
    const jobs = await Job.find().lean()
    return formatJSON(jobs)
}
export async function getSingleJob(jobId: string) {
    const job = await Job.findById(jobId).lean()
    if (!job) throw new CustomError(StatusCode.Status404NotFound, null, "job was not found")
    return formatJSON(job)
}
export async function deleteJob(jobId: string) {
    const deleted = await Job.findByIdAndDelete(jobId)
    if (!deleted) throw new CustomError(StatusCode.Status404NotFound, null, "job was not found")
}
export async function updateJob(jobId: string, updateTo: UpdateJobRequest) {
    const updated = await Job.findByIdAndUpdate(jobId, updateTo)
    if (!updated) throw new CustomError(StatusCode.Status404NotFound)
}