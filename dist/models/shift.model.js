"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shiftSchema = new mongoose_1.Schema({
    agentsRequired: Number,
    client: {
        companyName: String,
        address: {
            postCode: String,
            streetAddress: String,
            town: String,
        },
    },
    // agents: [Types.ObjectId],
    startTime: Date,
    endTime: Date,
    isPublic: { type: Boolean, default: true },
    agentsBooked: { type: Number, default: 0 },
    availableSlots: Number
});
const Shift = (0, mongoose_1.model)("Shifts", shiftSchema);
exports.default = Shift;
