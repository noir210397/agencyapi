import { StatusCode } from "src/constants/http";
import Client from "src/models/client.model";
import { CustomError } from "src/utils/customerror";
import { formatJSON } from "src/utils/formatData";
import { CreateClientRequest, UpdateClientRequest } from "src/validators/client/client.validators";


export async function createClient(client: CreateClientRequest) {
    await Client.create(client)
}
export async function getClients() {
    const clients = await Client.find().lean()
    return formatJSON(clients)
}
export async function getSingleClient(clientId: string) {
    const client = await Client.findById(clientId).lean()
    if (!client) throw new CustomError(StatusCode.Status404NotFound, null, "client wasnot found")
    return formatJSON(client)
}
export async function deleteClient(clientId: string) {
    const deleted = await Client.findByIdAndDelete(clientId)
    if (!deleted) throw new CustomError(StatusCode.Status404NotFound, null, "client was not found")
}
export async function updateClient(clientId: string, updateTo: UpdateClientRequest) {
    const updated = await Client.findByIdAndUpdate(clientId, updateTo)
    if (!updated) throw new CustomError(StatusCode.Status404NotFound)
}