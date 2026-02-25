"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientSchema = exports.createClientSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const base_1 = require("../base");
exports.createClientSchema = zod_1.default.object({
    companyName: zod_1.default.string().min(1).trim(),
    address: base_1.addressSchema
});
exports.updateClientSchema = exports.createClientSchema.partial();
