"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roles_1 = require("../types/roles");
const userSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    shareCode: String,
    accNumber: String,
    sortCode: String,
    gender: String,
    mobileNumber: String,
    email: String,
    address: {
        postCode: String,
        streetAddress: String,
        town: String,
    },
    password: String,
    role: { type: String, enum: Object.values(roles_1.Role), default: roles_1.Role.AGENT },
    mustChangePassword: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)("Users", userSchema);
exports.default = User;
