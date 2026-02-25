"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobSchema = exports.createJobSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const base_1 = require("../base");
const timeRegex = /\b(1[0-2]|0?[1-9])(am|pm)\s+to\s+(1[0-2]|0?[1-9])(am|pm)\b/i;
exports.createJobSchema = zod_1.default.object({
    applyViaIndeed: zod_1.default.url("provide a valid url").optional(),
    applicationEmail: zod_1.default.email("please provide a valid email"),
    address: base_1.addressSchema,
    type: zod_1.default.enum(["TEMP", "PERM"]),
    pay: {
        minPay: zod_1.default.number("provide a valid number").positive("provide a valid positive number"),
        maxPay: zod_1.default.number("provide a valid number").positive("provide a valid positive number")
    },
    sectors: zod_1.default.array(zod_1.default.string().trim().toLowerCase()),
    description: zod_1.default.string().min(20, "a minimum of 20 characters is required"),
    whatYouNeed: zod_1.default.array(zod_1.default.string()),
    days: zod_1.default.array(zod_1.default.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])),
    shiftTimes: zod_1.default.array(zod_1.default.string().regex(timeRegex, "enter shihft times like 9am-5pm")),
});
exports.updateJobSchema = exports.createJobSchema.partial();
