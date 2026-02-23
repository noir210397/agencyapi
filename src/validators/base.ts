import mongoose from "mongoose";
import z from "zod"

const ukPostcodePattern =
    /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

//ensure no CastError

export const idParamSchema = z.string().refine((val) => mongoose.isValidObjectId(val), "invalid id")


export const addressSchema = z.object({
    postCode: z.string()
        .trim()
        .regex(ukPostcodePattern, "Invalid UK postcode"),
    streetAddress: z
        .string()
        .trim()
        .min(1, "Street address is required"),
    town: z
        .string()
        .trim()
        .min(1, "Town is required")

})
export const querySchema = z.object({
    page: z.number("page must be a valid number").positive("page number must be positive").int("page must be a valid integer").optional().default(1)
})
export type BaseQuery = z.infer<typeof querySchema>