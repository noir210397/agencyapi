import { JwtPayload } from "jsonwebtoken"

export interface RefreshTokenPayload {
    sub: string
    email: string
}
export interface ResetPasswordTokenPayload extends Omit<RefreshTokenPayload, "email"> {
    jti: string
}
export interface AccessTokenPayload extends RefreshTokenPayload {
    name: string
    role: string
}
