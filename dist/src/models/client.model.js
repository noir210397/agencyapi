import { model, Schema } from "mongoose";
//holds client information
const clientSchema = new Schema({
    companyName: String,
    address: {
        postCode: String,
        streetAddress: String,
        town: String,
    },
});
const Client = model("Clients", clientSchema);
export default Client;
