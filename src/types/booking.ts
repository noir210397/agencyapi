import { Types } from "mongoose";
import { CreateClientRequest } from "src/validators/client/client.validators";

export interface IBooking {
    agentId: Types.ObjectId
    shiftId: Types.ObjectId
    client: CreateClientRequest
    startTime: Date
    endTime: Date
    wasPresent: boolean
    agentDetails: {
        email: string,
        fullName: string,
    },
    // isActive: boolean
    status: "active" | "inactive" | "cancelled"
    // isCancelled: boolean
}