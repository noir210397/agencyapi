import z from "zod";
export function flattenZodError(error) {
    return z.flattenError(error);
}
