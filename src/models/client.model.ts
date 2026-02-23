import { model, Schema } from "mongoose";
import { CreateClientRequest } from "src/validators/client/client.validators";

//holds client information

const clientSchema = new Schema<CreateClientRequest>({
    companyName: String,
    address: {
        postCode: String,
        streetAddress: String,
        town: String,
    },
})
const Client = model("Clients", clientSchema)
export default Client