
import 'express-serve-static-core';
import { AccessTokenPayload } from './token';

declare module 'express-serve-static-core' {
    interface Request {
        user?: AccessTokenPayload; // <-- your custom field
    }
}

