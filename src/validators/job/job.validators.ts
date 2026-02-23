import z from "zod"
import { addressSchema } from "../base"
const timeRegex = /\b(1[0-2]|0?[1-9])(am|pm)\s+to\s+(1[0-2]|0?[1-9])(am|pm)\b/i;



export const createJobSchema = z.object({
    applyViaIndeed: z.url("provide a valid url").optional(),
    applicationEmail: z.email("please provide a valid email"),
    address: addressSchema,
    type: z.enum(["TEMP", "PERM"]),
    pay: {
        minPay: z.number("provide a valid number").positive("provide a valid positive number"),
        maxPay: z.number("provide a valid number").positive("provide a valid positive number")
    },
    sectors: z.array(z.string().trim().toLowerCase()),
    description: z.string().min(20, "a minimum of 20 characters is required"),
    whatYouNeed: z.array(z.string()),
    days: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])),
    shiftTimes: z.array(z.string().regex(timeRegex, "enter shihft times like 9am-5pm")),
})
export type CreateJobRequest = z.infer<typeof createJobSchema>

export const updateJobSchema = createJobSchema.partial()

export type UpdateJobRequest = z.infer<typeof updateJobSchema>
