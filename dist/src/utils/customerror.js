import { STATUS_CODES } from "node:http";
import { flattenError, ZodError } from "zod";
// custom error
export class CustomError extends Error {
    statusCode;
    errors;
    constructor(statusCode, errors, message) {
        super(message ?? STATUS_CODES[statusCode]);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errors = errors instanceof ZodError ? (flattenError(errors).fieldErrors) : errors;
        // Maintains proper stack trace (only on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
