import z from "zod"

export const updateBookingSchema = z.object({
    wasPresent: z.boolean().optional(),
    status: z.enum(["active", "cancelled", "inactive"], "status can only be active,inactive or cancelled").optional()
})
export type UpdateBooking = z.infer<typeof updateBookingSchema>