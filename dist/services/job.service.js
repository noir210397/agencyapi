"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = createJob;
exports.getJobs = getJobs;
exports.getSingleJob = getSingleJob;
exports.deleteJob = deleteJob;
exports.updateJob = updateJob;
const http_1 = require("../constants/http");
const job_model_1 = __importDefault(require("../models/job.model"));
const customerror_1 = require("../utils/customerror");
const formatData_1 = require("../utils/formatData");
async function createJob(job) {
    await job_model_1.default.create(job);
}
async function getJobs() {
    const jobs = await job_model_1.default.find().lean();
    return (0, formatData_1.formatJSON)(jobs);
}
async function getSingleJob(jobId) {
    const job = await job_model_1.default.findById(jobId).lean();
    if (!job)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "job was not found");
    return (0, formatData_1.formatJSON)(job);
}
async function deleteJob(jobId) {
    const deleted = await job_model_1.default.findByIdAndDelete(jobId);
    if (!deleted)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "job was not found");
}
async function updateJob(jobId, updateTo) {
    const updated = await job_model_1.default.findByIdAndUpdate(jobId, updateTo);
    if (!updated)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
}
