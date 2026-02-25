"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSingleAgentschema = exports.deleteShiftSchema = exports.updateShiftSchema = exports.shiftSchema = void 0;
const zod_1 = require("zod");
const dayjs_1 = __importDefault(require("dayjs"));
const base_1 = require("../base");
const base_2 = require("../../constants/base");
const zDayjs = zod_1.z.union([zod_1.z.date(), zod_1.z.string(), zod_1.z.number()])
    .transform((val, ctx) => {
    let d;
    if (val instanceof Date) {
        d = (0, dayjs_1.default)(val);
    }
    else if (typeof val === "number") {
        d = val < 1e12 ? dayjs_1.default.unix(val) : (0, dayjs_1.default)(val);
    }
    else if (typeof val === "string") {
        const s = val.trim();
        d = (0, dayjs_1.default)(s);
    }
    else if (dayjs_1.default.isDayjs(val)) {
        d = val;
    }
    else {
        ctx.addIssue({ code: "custom", message: "Invalid date" });
        return zod_1.z.NEVER;
    }
    if (!d.isValid()) {
        ctx.addIssue({ code: "custom", message: "Invalid date" });
        return zod_1.z.NEVER;
    }
    return d;
});
exports.shiftSchema = zod_1.z.object({
    agentsRequired: zod_1.z.number().int().min(0, "agentsRequired must be >= 0"),
    agents: zod_1.z.array(base_1.idParamSchema),
    startTime: zDayjs, // Dayjs
    endTime: zDayjs, // Dayjs
    isPublic: zod_1.z.boolean().default(false),
    clientId: base_1.idParamSchema
})
    .superRefine((data, ctx) => {
    const { endTime, startTime, agentsRequired, agents } = data;
    const timeDifference = endTime.diff(startTime, 'hour', true);
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
    if (timeDifference < base_2.minShiftTime) {
        ctx.addIssue({
            code: "custom",
            message: "minimum shift time should be 2hrs",
            path: ["endTime"],
        });
    }
    if (timeDifference > base_2.maxShiftTime) {
        ctx.addIssue({
            code: "custom",
            message: "maximum shift time is 12hrs",
            path: ["endTime"],
        });
    }
});
exports.updateShiftSchema = exports.shiftSchema.partial().pick({
    agentsRequired: true,
    startTime: true,
    endTime: true,
    isPublic: true
}).extend({
    newAgents: zod_1.z.array(base_1.idParamSchema).optional(),
    removedAgents: zod_1.z.array(base_1.idParamSchema).optional()
})
    .superRefine((data, ctx) => {
    const now = (0, dayjs_1.default)();
    const { endTime, startTime } = data;
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
        const timeDifference = endTime.diff(startTime, 'hour', true);
        if (timeDifference < base_2.minShiftTime) {
            ctx.addIssue({
                code: "custom",
                message: "minimum shift time should be 2hrs",
                path: ["endTime"],
            });
        }
        if (timeDifference > base_2.maxShiftTime) {
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
exports.deleteShiftSchema = zod_1.z.object({
    withBookings: zod_1.z.boolean("with bookings must be either true or false").optional().default(false)
});
exports.bookSingleAgentschema = zod_1.z.object({
    agentId: base_1.idParamSchema
});
