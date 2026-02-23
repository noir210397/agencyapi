import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customerror';

interface ErrorResponseBody<T = unknown> {
    message: string;
    errors?: T;
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response<ErrorResponseBody>,
    _next: NextFunction
): void {
    // If it's CustomError, we know it has a statusCode + optional errors
    if (err instanceof CustomError) {
        const body: ErrorResponseBody<typeof err.errors> = {
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
