"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentHandler = exports.changePasswordHandler = exports.resetPasswordHandler = exports.getResetTokenHandler = exports.createManagerHandler = exports.createAdminHandler = exports.signInUserHandler = void 0;
const http_1 = require("../constants/http");
const auth_service_1 = require("../services/auth.service");
const customerror_1 = require("../utils/customerror");
const user_validators_1 = require("../validators/user/user.validators");
const signInUserHandler = async (req, res) => {
    const { success, data, error } = user_validators_1.loginSchema.safeParse(req.body);
    if (!success) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    }
    const tokens = await (0, auth_service_1.signInUser)(data);
    if (tokens.resetToken)
        throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden, tokens, 'Password change required');
    return res.json(tokens);
};
exports.signInUserHandler = signInUserHandler;
const createAdminHandler = async (req, res) => {
    const { success, data, error } = user_validators_1.createAdminOrManagerSchema.safeParse(req.body);
    if (!success) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    }
    res.json(await (0, auth_service_1.createAdmin)(data));
};
exports.createAdminHandler = createAdminHandler;
const createManagerHandler = async (req, res) => {
    const { success, data, error } = user_validators_1.createAdminOrManagerSchema.safeParse(req.body);
    if (!success) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    }
    res.json(await (0, auth_service_1.createManager)(data));
};
exports.createManagerHandler = createManagerHandler;
const getResetTokenHandler = async (req, res) => {
    const { success, data, error } = user_validators_1.resetTokenSchema.safeParse(req.body);
    if (!success) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    }
    await (0, auth_service_1.getResetPasswordToken)(data);
    res.sendStatus(200);
};
exports.getResetTokenHandler = getResetTokenHandler;
const resetPasswordHandler = async (req, res) => {
    const { success, data, error } = user_validators_1.passwordResetSchema.safeParse(req.body);
    if (!success) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    }
    res.json(await (0, auth_service_1.resetPassword)(data));
};
exports.resetPasswordHandler = resetPasswordHandler;
const changePasswordHandler = async (req, res) => {
    const { success, data, error } = user_validators_1.changePasswordSchema.safeParse(req.body);
    if (!success) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    }
    await (0, auth_service_1.changeUserPassword)(req.user, data.password);
    return res.sendStatus(http_1.StatusCode.Status204NoContent);
};
exports.changePasswordHandler = changePasswordHandler;
const createAgentHandler = async (req, res) => {
    const { success, data, error } = user_validators_1.createAgentSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    const tokens = await (0, auth_service_1.createAgent)(data);
    return res.json(tokens);
};
exports.createAgentHandler = createAgentHandler;
