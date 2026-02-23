import { model, Schema } from "mongoose";
const shiftSchema = new Schema({
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
const Shift = model("Shifts", shiftSchema);
export default Shift;
