"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminOrManager = exports.updateAgentSchema = exports.createAgentSchema = exports.createAdminOrManagerSchema = exports.refreshTokenSchema = exports.passwordResetSchema = exports.changePasswordSchema = exports.loginSchema = exports.resetTokenSchema = void 0;
const roles_1 = require("../../types/roles");
const zod_1 = __importDefault(require("zod"));
const base_1 = require("../base");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
// UK mobile number regex (e.g. 07123 456789, +44 7123 456789)
const ukMobilePattern = /^(?:\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
exports.resetTokenSchema = zod_1.default.object({
    email: zod_1.default.email('Invalid email address').trim(),
});
//login schema
exports.loginSchema = exports.resetTokenSchema.extend({
    email: zod_1.default.email('Invalid email address').trim(),
    password: zod_1.default
        .string("password is required").trim()
        .regex(passwordPattern, 'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character')
});
// change password
exports.changePasswordSchema = exports.loginSchema.pick({
    password: true
});
//password reset schema
exports.passwordResetSchema = exports.loginSchema.extend({
    resetToken: zod_1.default.jwt("provide a valid jwt token")
});
//for refreshing accessToken
exports.refreshTokenSchema = zod_1.default.object({ refreshToken: zod_1.default.jwt("provide a valid jwt token") });
// creating admin and manager
exports.createAdminOrManagerSchema = exports.loginSchema.extend({
    role: zod_1.default.enum([roles_1.Role.ADMIN, roles_1.Role.MANAGER]),
    firstName: zod_1.default.string().trim().min(2, "minimum of 2 characters required"),
    lastName: zod_1.default.string().trim().min(2, "minimum of 2 characters required")
});
//create agent
exports.createAgentSchema = exports.createAdminOrManagerSchema.omit({ role: true }).extend({
    age: zod_1.default
        .int32("Age must be an integer")
        .nonnegative("Age cannot be negative"),
    shareCode: zod_1.default
        .string()
        .trim()
        .min(1, "Share code is required"),
    accNumber: zod_1.default
        .string()
        .trim()
        .min(1, "Account number is required"),
    sortCode: zod_1.default
        .string()
        .trim()
        .min(1, "Sort code is required"),
    gender: zod_1.default
        .string()
        .trim()
        .min(1, "Gender is required"),
    mobileNumber: zod_1.default
        .string()
        .trim()
        .regex(ukMobilePattern, "Invalid UK mobile number"),
    email: zod_1.default
        .email("Invalid email address")
        .trim(),
    address: base_1.addressSchema,
    password: zod_1.default
        .string()
        .trim()
        .regex(passwordPattern, "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character"),
});
exports.updateAgentSchema = exports.createAgentSchema.partial().omit({
    email: true,
    age: true,
    firstName: true,
    lastName: true,
    password: true
});
exports.updateAdminOrManager = exports.createAdminOrManagerSchema.partial().omit({
    email: true,
    password: true
});
