"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenZodError = flattenZodError;
const zod_1 = __importDefault(require("zod"));
function flattenZodError(error) {
    return zod_1.default.flattenError(error);
}
