import { StatusCode } from "src/constants/http";
import { createClient, deleteClient, getClients, getSingleClient, updateClient } from "src/services/client.service";
import { CustomError } from "src/utils/customerror";
import { createClientSchema, updateClientSchema } from "src/validators/client/client.validators";
export const getClientsHandler = async (req, res) => {
    const clients = await getClients();
    return res.json(clients);
};
export const getSingleClientHandler = async (req, res) => {
    const client = await getSingleClient(req.params.id);
    return res.json(client);
};
export const deleteClientHandler = async (req, res) => {
    await deleteClient(req.params.id);
    return res.sendStatus(204);
};
export const updateClientHandler = async (req, res) => {
    const { success, data, error } = updateClientSchema.safeParse(req.body);
    if (!success)
        throw new CustomError(StatusCode.Status400BadRequest, error);
    await updateClient(req.params.id, data);
    return res.sendStatus(204);
};
export const createClientHandler = async (req, res) => {
    const { success, data, error } = createClientSchema.safeParse(req.body);
    if (!success)
        throw new CustomError(StatusCode.Status400BadRequest, error);
    await createClient(data);
    return res.sendStatus(201);
};
