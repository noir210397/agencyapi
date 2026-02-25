"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getSingleUser = getSingleUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
const http_1 = require("../constants/http");
const user_model_1 = __importDefault(require("../models/user.model"));
const customerror_1 = require("../utils/customerror");
const formatData_1 = require("../utils/formatData");
const user_validators_1 = require("../validators/user/user.validators");
async function getUsers() {
    const users = await user_model_1.default.find().lean();
    return (0, formatData_1.formatJSON)(users);
}
async function getSingleUser(userId) {
    const user = await user_model_1.default.findById(userId).lean();
    if (!user)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "user was not found");
    return (0, formatData_1.formatJSON)(user);
}
async function deleteUser(userId, user) {
    const { role, sub: id } = user;
    //user can only delete their accounts
    if (role === "AGENT" && id !== userId)
        throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
    const userTodelete = await user_model_1.default.findById(userId);
    if (!userTodelete)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "user was not found");
    //ensure admins can only delete agents
    if (userTodelete.role !== "AGENT" && role === "ADMIN")
        throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
    const { deletedCount } = await userTodelete.deleteOne();
    if (deletedCount !== 1)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "unable to delete user");
}
async function updateUser(userId, user, body) {
    const { role, sub: id } = user;
    if (role === "AGENT") {
        const authorized = id === userId;
        if (!authorized)
            throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
        const { success, data, error } = user_validators_1.updateAgentSchema.safeParse(body);
        if (!success)
            throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
        if (Object.keys(data).length === 0)
            return "no update required";
        const updated = await user_model_1.default.findOneAndUpdate({ _id: userId }, data);
        if (!updated)
            throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
    }
    else if (role === "ADMIN") {
        const user = await user_model_1.default.findOne({ _id: userId }).select("role");
        if (!user)
            throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "user not found");
        if (user.role === "AGENT") {
            const { success, data, error } = user_validators_1.updateAgentSchema.safeParse(body);
            if (!success)
                throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
            if (Object.keys(data).length === 0)
                return "no update required";
            const updated = await user_model_1.default.findOneAndUpdate({ _id: userId }, data);
            if (!updated)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
        }
        else if (user.role === "ADMIN") {
            if (user._id.toString() !== id)
                throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
            const { success, data, error } = user_validators_1.updateAdminOrManager.safeParse(body);
            if (!success)
                throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
            if (Object.keys(data).length === 0)
                return "no update required";
            const updated = await user_model_1.default.findOneAndUpdate({ _id: userId }, data);
            if (!updated)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
        }
        else if (user.role === "MANAGER")
            throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
        else
            throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
    }
    else if (role === "MANAGER") {
        const user = await user_model_1.default.findOne({ _id: userId }).select("role");
        if (!user)
            throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "user not found");
        if (user.role === "AGENT") {
            const { success, data, error } = user_validators_1.updateAgentSchema.safeParse(body);
            if (!success)
                throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
            if (Object.keys(data).length === 0)
                return "no update required";
            const updated = await user_model_1.default.findOneAndUpdate({ _id: userId }, data);
            if (!updated)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
        }
        else if (user.role === "ADMIN") {
            const { success, data, error } = user_validators_1.updateAdminOrManager.safeParse(body);
            if (!success)
                throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
            if (Object.keys(data).length === 0)
                return "no update required";
            const updated = await user_model_1.default.findOneAndUpdate({ _id: userId }, data);
            if (!updated)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
        }
        else if (user.role === "MANAGER") {
            if (user._id.toString() !== id)
                throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
            const { success, data, error } = user_validators_1.updateAdminOrManager.safeParse(body);
            if (!success)
                throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
            if (Object.keys(data).length === 0)
                return "no update required";
            const updated = await user_model_1.default.findOneAndUpdate({ _id: userId }, data);
            if (!updated)
                throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
        }
        else
            throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
    }
}
