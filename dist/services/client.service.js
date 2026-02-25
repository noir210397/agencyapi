"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
exports.getClients = getClients;
exports.getSingleClient = getSingleClient;
exports.deleteClient = deleteClient;
exports.updateClient = updateClient;
const http_1 = require("../constants/http");
const client_model_1 = __importDefault(require("../models/client.model"));
const customerror_1 = require("../utils/customerror");
const formatData_1 = require("../utils/formatData");
async function createClient(client) {
    await client_model_1.default.create(client);
}
async function getClients() {
    const clients = await client_model_1.default.find().lean();
    return (0, formatData_1.formatJSON)(clients);
}
async function getSingleClient(clientId) {
    const client = await client_model_1.default.findById(clientId).lean();
    if (!client)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "client wasnot found");
    return (0, formatData_1.formatJSON)(client);
}
async function deleteClient(clientId) {
    const deleted = await client_model_1.default.findByIdAndDelete(clientId);
    if (!deleted)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound, null, "client was not found");
}
async function updateClient(clientId, updateTo) {
    const updated = await client_model_1.default.findByIdAndUpdate(clientId, updateTo);
    if (!updated)
        throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
}
