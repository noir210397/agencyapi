import jwt from "jsonwebtoken"
import type { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from "jsonwebtoken"
import { StatusCode } from "src/constants/http";
import { AccessTokenPayload, RefreshTokenPayload } from "src/types/token";
import { CustomError } from "./customerror";
export function generateAccessToken(obj: AccessTokenPayload) {
    const key = process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    if (!key) throw new Error("no secret key was provided")
    return jwt.sign(obj, key, { expiresIn: 60 * 60 * 15, })
}
export function generateRefreshToken(obj: RefreshTokenPayload) {
    const key = process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    if (!key) throw new Error("no secret key was provided")
    return jwt.sign(obj, key, { expiresIn: "7d", })
}

export function verifyToken(token: string, type: "refresh" | "access" | "reset" = "access") {
    let key: string | undefined
    try {
        if (type === "refresh") key = process.env.JWT_REFRESH_TOKEN_SECRET_KEY
        else if (type === "reset") process.env.JWT_RESET_TOKEN_SECRET_KEY
        else key = process.env.JWT_ACCESS_TOKEN_SECRET_KEY
        if (!key) throw new Error(`${type} secret key was provided`)
        return jwt.verify(token, key)
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            throw new CustomError(StatusCode.Status401Unauthorized, { token: `${err.message}` }, err.message);
        }
        else if (err instanceof jwt.TokenExpiredError) {
            throw new CustomError(StatusCode.Status401Unauthorized, { token: `${err.message}` }, err.message);
        }
        else if (err instanceof jwt.NotBeforeError) {
            throw new CustomError(StatusCode.Status401Unauthorized, { token: `${err.message}` }, err.message);
        }

        else if (err instanceof Error) {
            throw new CustomError(StatusCode.Status500ServerError, { token: `${err.message}` }, err.message);
        }
        throw new CustomError(StatusCode.Status500ServerError, err);
    }

}
export function generatePasswordResetToken(sub: string, id: string): string {
    const key = process.env.JWT_RESET_TOKEN_SECRET_KEY
    if (!key) throw new Error("no secret key was provided")
    return jwt.sign(
        {
            sub: sub, jti: id
        },
        key,
        {
            expiresIn: '15m',           // token is only valid for 1 hour
        }
    );
}

