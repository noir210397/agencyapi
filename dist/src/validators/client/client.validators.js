import z from "zod";
import { addressSchema } from "../base";
export const createClientSchema = z.object({
    companyName: z.string().min(1).trim(),
    address: addressSchema
});
export const updateClientSchema = createClientSchema.partial();
