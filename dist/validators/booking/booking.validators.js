"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateBookingSchema = zod_1.default.object({
    wasPresent: zod_1.default.boolean().optional(),
    status: zod_1.default.enum(["active", "cancelled", "inactive"], "status can only be active,inactive or cancelled").optional()
});
