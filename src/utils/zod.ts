import z, { ZodError } from "zod"

export function flattenZodError(error: ZodError) {
    return z.flattenError(error)
}