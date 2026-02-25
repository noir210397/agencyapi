"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
exports.generatePasswordResetToken = generatePasswordResetToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_1 = require("../constants/http");
const customerror_1 = require("./customerror");
function generateAccessToken(obj) {
    const key = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    if (!key)
        throw new Error("no secret key was provided");
    return jsonwebtoken_1.default.sign(obj, key, { expiresIn: 60 * 60 * 15, });
}
function generateRefreshToken(obj) {
    const key = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    if (!key)
        throw new Error("no secret key was provided");
    return jsonwebtoken_1.default.sign(obj, key, { expiresIn: "7d", });
}
function verifyToken(token, type = "access") {
    let key;
    try {
        if (type === "refresh")
            key = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
        else if (type === "reset")
            process.env.JWT_RESET_TOKEN_SECRET_KEY;
        else
            key = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
        if (!key)
            throw new Error(`${type} secret key was provided`);
        return jsonwebtoken_1.default.verify(token, key);
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new customerror_1.CustomError(http_1.StatusCode.Status401Unauthorized, { token: `${err.message}` }, err.message);
        }
        else if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new customerror_1.CustomError(http_1.StatusCode.Status401Unauthorized, { token: `${err.message}` }, err.message);
        }
        else if (err instanceof jsonwebtoken_1.default.NotBeforeError) {
            throw new customerror_1.CustomError(http_1.StatusCode.Status401Unauthorized, { token: `${err.message}` }, err.message);
        }
        else if (err instanceof Error) {
            throw new customerror_1.CustomError(http_1.StatusCode.Status500ServerError, { token: `${err.message}` }, err.message);
        }
        throw new customerror_1.CustomError(http_1.StatusCode.Status500ServerError, err);
    }
}
function generatePasswordResetToken(sub, id) {
    const key = process.env.JWT_RESET_TOKEN_SECRET_KEY;
    if (!key)
        throw new Error("no secret key was provided");
    return jsonwebtoken_1.default.sign({
        sub: sub, jti: id
    }, key, {
        expiresIn: '15m', // token is only valid for 1 hour
    });
}
