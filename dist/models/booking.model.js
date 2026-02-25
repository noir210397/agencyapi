"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// holds all bookings along with agents information
const bookingSchema = new mongoose_1.Schema({
    client: {
        companyName: String,
        address: {
            postCode: String,
            streetAddress: String,
            town: String
        }
    },
    startTime: { type: Date },
    endTime: { type: Date },
    wasPresent: { type: Boolean, default: false },
    shiftId: mongoose_1.Types.ObjectId,
    agentId: mongoose_1.Types.ObjectId,
    agentDetails: {
        fullName: String,
        email: String
    },
    status: { type: String, default: "active" },
    // isActive: { type: Boolean, default: true },
    // isCancelled: { type: Boolean, default: false }
});
const Booking = (0, mongoose_1.model)("Bookings", bookingSchema);
exports.default = Booking;
