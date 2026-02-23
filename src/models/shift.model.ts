import { model, Schema, Types } from "mongoose";
import { CreateClientRequest } from "src/validators/client/client.validators";
import { CreateShiftRequest } from "src/validators/shift/shift.validators";

export interface IShift extends Pick<CreateShiftRequest, "agentsRequired" | "isPublic"> {
    startTime: Date,
    endTime: Date
    agentsBooked: number,
    client: CreateClientRequest
    availableSlots: number
    agents: Types.ObjectId[]
}

const shiftSchema = new Schema<IShift>({
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
})
const Shift = model("Shifts", shiftSchema)
export default Shift