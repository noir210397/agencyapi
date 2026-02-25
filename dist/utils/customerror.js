"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const node_http_1 = require("node:http");
const zod_1 = require("zod");
// custom error
class CustomError extends Error {
    statusCode;
    errors;
    constructor(statusCode, errors, message) {
        super(message ?? node_http_1.STATUS_CODES[statusCode]);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errors = errors instanceof zod_1.ZodError ? ((0, zod_1.flattenError)(errors).fieldErrors) : errors;
        // Maintains proper stack trace (only on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.CustomError = CustomError;
