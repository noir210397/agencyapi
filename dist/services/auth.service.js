"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewAccessToken = getNewAccessToken;
exports.changeUserPassword = changeUserPassword;
exports.createAdmin = createAdmin;
exports.createAgent = createAgent;
exports.createManager = createManager;
exports.resetPassword = resetPassword;
exports.getResetPasswordToken = getResetPasswordToken;
exports.signInUser = signInUser;
const http_1 = require("../constants/http");
const passwordreset_model_1 = __importDefault(require("../models/passwordreset.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const customerror_1 = require("../utils/customerror");
const jwthelper_1 = require("../utils/jwthelper");
const passwordhelper_1 = require("../utils/passwordhelper");
async function signInUser({ email, password }) {
    const user = await user_model_1.default.findOne({ email: email }).exec();
    if (!user) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, { email: `no user with email: ${email}` });
    }
    const validPassword = await (0, passwordhelper_1.isPasswordValid)(user.password, password);
    if (!validPassword)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, { password: "invalid password" });
    if (user.mustChangePassword) {
        const passwordReset = await passwordreset_model_1.default.create({ email: email });
        const resetToken = (0, jwthelper_1.generatePasswordResetToken)(email, passwordReset._id.toString());
        //redirect with this
        return { resetToken };
    }
    const jwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
    };
    const accessToken = (0, jwthelper_1.generateAccessToken)(jwtPayload);
    const refreshToken = (0, jwthelper_1.generateRefreshToken)({ sub: jwtPayload.sub, email: jwtPayload.email, });
    return {
        accessToken, refreshToken
    };
}
async function createAdmin(admin) {
    const user = await user_model_1.default.findOne({ email: admin.email }).exec();
    if (user) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, { email: `user with this email address already exists` });
    }
    await user_model_1.default.create({ ...admin, mustChangePassword: true });
    return {
        email: admin.email, password: admin.password
    };
}
async function createManager(manager) {
    const user = await user_model_1.default.findOne({ email: manager.email }).exec();
    if (user) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, { email: `user with this email address already exists` });
    }
    await user_model_1.default.create({ ...manager, mustChangePassword: true });
    return {
        email: manager.email, password: manager.password
    };
}
async function createAgent(agent) {
    const user = await user_model_1.default.findOne({ email: agent.email });
    if (user) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, { email: `user with this email address already exists` });
    }
    agent.password = await (0, passwordhelper_1.hashPassword)(agent.password);
    const createdUser = await user_model_1.default.create(agent);
    const jwtPayload = {
        sub: createdUser._id.toString(),
        email: createdUser.email,
        name: `${createdUser.firstName} ${createdUser.lastName}`,
        role: createdUser.role
    };
    const accessToken = (0, jwthelper_1.generateAccessToken)(jwtPayload);
    const refreshToken = (0, jwthelper_1.generateRefreshToken)({ sub: jwtPayload.sub, email: jwtPayload.email, });
    return {
        accessToken, refreshToken
    };
}
async function changeUserPassword(user, password) {
    const target = await user_model_1.default.findById(user.sub);
    if (!target) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, { email: `no user was foun with email ${user.email}` });
    }
    if (user.sub !== target._id.toString())
        throw new customerror_1.CustomError(http_1.StatusCode.Status403Forbidden);
    target.password = await (0, passwordhelper_1.hashPassword)(password);
    await target.save();
}
async function getResetPasswordToken(userDetails) {
    const user = await user_model_1.default.findOne({ email: userDetails.email }).exec();
    if (!user) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, { email: `no user was found with email ${userDetails.email}` });
    }
    const passwordReset = await passwordreset_model_1.default.create({ email: userDetails.email });
    const resetToken = (0, jwthelper_1.generatePasswordResetToken)(user._id.toString(), passwordReset._id.toString());
    // send resetToken via email with baseUrl
}
async function resetPassword({ password, resetToken }) {
    const payload = (0, jwthelper_1.verifyToken)(resetToken, "reset");
    const reset = await passwordreset_model_1.default.findByIdAndDelete(payload.jti).exec();
    const user = await user_model_1.default.findOne({ _id: payload.sub }).exec();
    if (!reset) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, null, "invalid or expired token");
    }
    if (!user) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, null, `no user with id:${payload.sub}`);
    }
    user.password = await (0, passwordhelper_1.hashPassword)(password);
    await user.save();
}
async function getNewAccessToken({ refreshToken }) {
    const { email } = (0, jwthelper_1.verifyToken)(refreshToken, "refresh");
    const user = await user_model_1.default.findOne({ email: email }).exec();
    if (!user) {
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, { email: `no user with email: ${email}` });
    }
    const jwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
    };
    const accessToken = (0, jwthelper_1.generateAccessToken)(jwtPayload);
    //change later so tokens to be used just once add sessions
    // const refreshToken = generateRefreshToken({ sub: jwtPayload.sub, email: jwtPayload.email, })
    return {
        accessToken, refreshToken
    };
}
