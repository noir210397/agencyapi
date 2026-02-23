import { Role } from "src/types/roles";
import z from "zod"
import { addressSchema } from "../base";

const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;


// UK mobile number regex (e.g. 07123 456789, +44 7123 456789)
const ukMobilePattern =
    /^(?:\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
export const resetTokenSchema = z.object({
    email: z.email('Invalid email address').trim(),

})
export type ResetTokenRequest = z.infer<typeof resetTokenSchema>


//login schema
export const loginSchema = resetTokenSchema.extend({
    email: z.email('Invalid email address').trim(),
    password: z
        .string("password is required").trim()
        .regex(
            passwordPattern,
            'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
});
export type LoginRequest = z.infer<typeof loginSchema>


// change password
export const changePasswordSchema = loginSchema.pick({
    password: true
})
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>

//password reset schema
export const passwordResetSchema = loginSchema.extend({
    resetToken: z.jwt("provide a valid jwt token")
})
export type PasswordResetRequest = z.infer<typeof passwordResetSchema>


//for refreshing accessToken
export const refreshTokenSchema = z.object({ refreshToken: z.jwt("provide a valid jwt token") })
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>


// creating admin and manager
export const createAdminOrManagerSchema = loginSchema.extend({
    role: z.enum([Role.ADMIN, Role.MANAGER]),
    firstName: z.string().trim().min(2, "minimum of 2 characters required"),
    lastName: z.string().trim().min(2, "minimum of 2 characters required")
})
export type createAdminorManagerRequest = z.infer<typeof createAdminOrManagerSchema>


//create agent
export const createAgentSchema = createAdminOrManagerSchema.omit({ role: true }).extend({
    age: z
        .int32("Age must be an integer")
        .nonnegative("Age cannot be negative"),
    shareCode: z
        .string()
        .trim()
        .min(1, "Share code is required"),
    accNumber: z
        .string()
        .trim()
        .min(1, "Account number is required"),
    sortCode: z
        .string()
        .trim()
        .min(1, "Sort code is required"),
    gender: z
        .string()
        .trim()
        .min(1, "Gender is required"),
    mobileNumber: z
        .string()
        .trim()
        .regex(ukMobilePattern, "Invalid UK mobile number"),
    email: z
        .email("Invalid email address")
        .trim(),
    address: addressSchema,
    password: z
        .string()
        .trim()
        .regex(
            passwordPattern,
            "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character"
        ),
})
// .strict();
export type createAgentRequest = z.infer<typeof createAgentSchema>

export const updateAgentSchema = createAgentSchema.partial().omit({
    email: true,
    age: true,
    firstName: true,
    lastName: true,
    password: true
})
export const updateAdminOrManager = createAdminOrManagerSchema.partial().omit({
    email: true,
    password: true
})