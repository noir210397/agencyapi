import { z } from "zod";
import dayjs, { Dayjs } from "dayjs";
import { idParamSchema } from "../base";
import { maxShiftTime, minShiftTime } from "src/constants/base";



const zDayjs: z.ZodType<Dayjs> = z.union([z.date(), z.string(), z.number()])
    .transform((val, ctx) => {
        let d: Dayjs;

        if (val instanceof Date) {
            d = dayjs(val);
        } else if (typeof val === "number") {
            d = val < 1e12 ? dayjs.unix(val) : dayjs(val);
        } else if (typeof val === "string") {
            const s = val.trim();
            d = dayjs(s);
        } else if (dayjs.isDayjs(val)) {
            d = val;
        } else {
            ctx.addIssue({ code: "custom", message: "Invalid date" });
            return z.NEVER;
        }
        if (!d.isValid()) {
            ctx.addIssue({ code: "custom", message: "Invalid date" });
            return z.NEVER;
        }
        return d;
    });

export const shiftSchema = z.object({
    agentsRequired: z.number().int().min(0, "agentsRequired must be >= 0"),
    agents: z.array(idParamSchema),
    startTime: zDayjs,                    // Dayjs
    endTime: zDayjs,                      // Dayjs
    isPublic: z.boolean().default(false),
    clientId: idParamSchema
})
    .superRefine((data, ctx) => {
        const { endTime, startTime, agentsRequired, agents } = data
        const timeDifference = endTime.diff(startTime, 'hour', true)
        if (agentsRequired < agents.length) {
            ctx.addIssue({
                code: "custom",
                message: "not enough slots remove some agents",
                path: ["agents"],
            });
        }
        if (!endTime.isAfter(data.startTime)) {
            ctx.addIssue({
                code: "custom",
                message: "endTime must be after startTime",
                path: ["endTime"],
            });
        }

        if (timeDifference < minShiftTime) {
            ctx.addIssue({
                code: "custom",
                message: "minimum shift time should be 2hrs",
                path: ["endTime"],
            });
        }
        if (timeDifference > maxShiftTime) {
            ctx.addIssue({
                code: "custom",
                message: "maximum shift time is 12hrs",
                path: ["endTime"],
            });
        }


    });

export type CreateShiftRequest = z.infer<typeof shiftSchema>


export const updateShiftSchema = shiftSchema.partial().pick({
    agentsRequired: true,
    startTime: true,
    endTime: true,
    isPublic: true
}).extend({
    newAgents: z.array(idParamSchema).optional(),
    removedAgents: z.array(idParamSchema).optional()
})
    .superRefine((data, ctx) => {
        const now = dayjs();
        const { endTime, startTime } = data
        // start > now (only if provided)

        if (endTime && !startTime) {
            ctx.addIssue({ code: "custom", message: "start time is required when end time is provided", path: ["startTime"] });
            return;
        }
        if (startTime && !endTime) {
            ctx.addIssue({
                code: "custom",
                message: "end time is required when start time is provided ",
                path: ["startTime"],
            });
        }
        if (endTime && startTime) {
            const timeDifference = endTime.diff(startTime, 'hour', true)
            if (timeDifference < minShiftTime) {
                ctx.addIssue({
                    code: "custom",
                    message: "minimum shift time should be 2hrs",
                    path: ["endTime"],
                });
            }
            if (timeDifference > maxShiftTime) {
                ctx.addIssue({
                    code: "custom",
                    message: "maximum shift time is 12hrs",
                    path: ["endTime"],
                });
            }
        }

        // Optional: prevent overlapping agent ops (same id in both arrays)
        if (data.newAgents && data.removedAgents) {
            const set = new Set(data.newAgents);
            const overlap = data.removedAgents.filter(id => set.has(id));
            if (overlap.length > 0) {
                ctx.addIssue({
                    code: "custom",
                    message: "newAgents and removedAgents cannot contain the same id(s)",
                    path: ["newAgents"],
                });
            }
        }
    });

export type UpdateShiftRequest = z.infer<typeof updateShiftSchema>

export const deleteShiftSchema = z.object({
    withBookings: z.boolean("with bookings must be either true or false").optional().default(false)
})

export const bookSingleAgentschema = z.object({
    agentId: idParamSchema
})
