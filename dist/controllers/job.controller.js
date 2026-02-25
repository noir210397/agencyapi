"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobHandler = exports.updateJobHandler = exports.deleteJobHandler = exports.getSingleJobHandler = exports.getJobsHandler = void 0;
const http_1 = require("../constants/http");
const job_service_1 = require("../services/job.service");
const customerror_1 = require("../utils/customerror");
const job_validators_1 = require("../validators/job/job.validators");
const getJobsHandler = async (req, res) => {
    const clients = await (0, job_service_1.getJobs)();
    return res.json(clients);
};
exports.getJobsHandler = getJobsHandler;
const getSingleJobHandler = async (req, res) => {
    const client = await (0, job_service_1.getSingleJob)(req.params.id);
    return res.json(client);
};
exports.getSingleJobHandler = getSingleJobHandler;
const deleteJobHandler = async (req, res) => {
    await (0, job_service_1.deleteJob)(req.params.id);
    return res.sendStatus(204);
};
exports.deleteJobHandler = deleteJobHandler;
const updateJobHandler = async (req, res) => {
    const { success, data, error } = job_validators_1.updateJobSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    await (0, job_service_1.updateJob)(req.params.id, data);
    return res.sendStatus(204);
};
exports.updateJobHandler = updateJobHandler;
const createJobHandler = async (req, res) => {
    const { success, data, error } = job_validators_1.createJobSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    await (0, job_service_1.createJob)(data);
    return res.sendStatus(201);
};
exports.createJobHandler = createJobHandler;
