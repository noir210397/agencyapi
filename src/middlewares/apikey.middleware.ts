// // src/middleware/apiKey.ts
// import { Request, Response, NextFunction } from 'express';
// import { CustomError } from '../utils/customerror';

// const API_KEY = process.env.API_KEY;
// if (!API_KEY) {
//     throw new Error('Environment variable API_KEY must be set');
// }

// /**
//  * Middleware that checks for a valid API key in the `x-api-key` header.
//  * Throws a CustomError(401) if missing or invalid.
//  */
// export default function apiKeyMiddleware(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): void {
//     const key = req.header('x-api-key');
//     if (!key) {
//         return next(new CustomError('API key required', 401));
//     }

//     if (key !== API_KEY) {
//         return next(new CustomError('Invalid API key', 401));
//     }

//     next();
// }
