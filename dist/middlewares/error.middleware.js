"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const customerror_1 = require("../utils/customerror");
function errorHandler(err, _req, res, _next) {
    // If it's CustomError, we know it has a statusCode + optional errors
    if (err instanceof customerror_1.CustomError) {
        const body = {
            message: err.message,
            ...(err.errors !== null && { errors: err.errors }),
        };
        res.status(err.statusCode).json(body);
        return;
    }
    // If it's a built-in Error (but not our CustomError)
    else if (err instanceof Error) {
        res.status(500).json({ message: err.message });
        return;
    }
    else {
        res.status(500).json({ message: 'Internal Server Error' });
        // Unknown error type
        console.log(err);
    }
}
