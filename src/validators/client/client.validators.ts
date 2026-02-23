import z from "zod"
import { addressSchema } from "../base"


export const createClientSchema = z.object({
    companyName: z.string().min(1).trim(),
    address: addressSchema
})
export type CreateClientRequest = z.infer<typeof createClientSchema>

export const updateClientSchema = createClientSchema.partial()
export type UpdateClientRequest = z.infer<typeof updateClientSchema>

