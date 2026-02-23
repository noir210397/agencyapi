import { model, Schema, Types } from "mongoose";
// holds all bookings along with agents information
const bookingSchema = new Schema({
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
    shiftId: Types.ObjectId,
    agentId: Types.ObjectId,
    agentDetails: {
        fullName: String,
        email: String
    },
    status: { type: String, default: "active" },
    // isActive: { type: Boolean, default: true },
    // isCancelled: { type: Boolean, default: false }
});
const Booking = model("Bookings", bookingSchema);
export default Booking;
