import { STATUS_CODES } from "node:http";
import { flattenError, ZodError } from "zod";

// custom error
export class CustomError extends Error {
    public readonly statusCode: number;
    public readonly errors?: unknown;

    constructor(
        statusCode: number,
        errors?: unknown,
        message?: string
    ) {
        super(message ?? STATUS_CODES[statusCode]);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errors = errors instanceof ZodError ? (flattenError(errors).fieldErrors) : errors

        // Maintains proper stack trace (only on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
