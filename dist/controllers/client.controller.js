"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientHandler = exports.updateClientHandler = exports.deleteClientHandler = exports.getSingleClientHandler = exports.getClientsHandler = void 0;
const http_1 = require("../constants/http");
const client_service_1 = require("../services/client.service");
const customerror_1 = require("../utils/customerror");
const client_validators_1 = require("../validators/client/client.validators");
const getClientsHandler = async (req, res) => {
    const clients = await (0, client_service_1.getClients)();
    return res.json(clients);
};
exports.getClientsHandler = getClientsHandler;
const getSingleClientHandler = async (req, res) => {
    const client = await (0, client_service_1.getSingleClient)(req.params.id);
    return res.json(client);
};
exports.getSingleClientHandler = getSingleClientHandler;
const deleteClientHandler = async (req, res) => {
    await (0, client_service_1.deleteClient)(req.params.id);
    return res.sendStatus(204);
};
exports.deleteClientHandler = deleteClientHandler;
const updateClientHandler = async (req, res) => {
    const { success, data, error } = client_validators_1.updateClientSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    await (0, client_service_1.updateClient)(req.params.id, data);
    return res.sendStatus(204);
};
exports.updateClientHandler = updateClientHandler;
const createClientHandler = async (req, res) => {
    const { success, data, error } = client_validators_1.createClientSchema.safeParse(req.body);
    if (!success)
        throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, error);
    await (0, client_service_1.createClient)(data);
    return res.sendStatus(201);
};
exports.createClientHandler = createClientHandler;
