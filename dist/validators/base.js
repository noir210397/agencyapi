"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.addressSchema = exports.idParamSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const ukPostcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
//ensure no CastError
exports.idParamSchema = zod_1.default.string().refine((val) => mongoose_1.default.isValidObjectId(val), "invalid id");
exports.addressSchema = zod_1.default.object({
    postCode: zod_1.default.string()
        .trim()
        .regex(ukPostcodePattern, "Invalid UK postcode"),
    streetAddress: zod_1.default
        .string()
        .trim()
        .min(1, "Street address is required"),
    town: zod_1.default
        .string()
        .trim()
        .min(1, "Town is required")
});
exports.querySchema = zod_1.default.object({
    page: zod_1.default.number("page must be a valid number").positive("page number must be positive").int("page must be a valid integer").optional().default(1)
});
