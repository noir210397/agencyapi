"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//holds jobs temps or perm
const jobSchema = new mongoose_1.Schema({
    applyViaIndeed: { type: String, default: null },
    address: {
        postCode: String,
        streetAddress: String,
        town: String
    },
    type: String,
    pay: {
        minPay: Number,
        maxPay: Number
    },
    sectors: [String],
    description: String,
    whatYouNeed: [String],
    days: [String],
    shiftTimes: [String],
    applicationEmail: String
}, {
    timestamps: true
});
const Job = (0, mongoose_1.model)('Jobs', jobSchema);
exports.default = Job;
