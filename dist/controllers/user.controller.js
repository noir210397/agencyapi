"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserHandler = exports.deleteUserHandler = exports.getSingleUserHandler = exports.getUsersHandler = void 0;
const user_service_1 = require("../services/user.service");
const getUsersHandler = async (req, res) => {
    const clients = await (0, user_service_1.getUsers)();
    return res.json(clients);
};
exports.getUsersHandler = getUsersHandler;
const getSingleUserHandler = async (req, res) => {
    const client = await (0, user_service_1.getSingleUser)(req.params.id);
    return res.json(client);
};
exports.getSingleUserHandler = getSingleUserHandler;
const deleteUserHandler = async (req, res) => {
    await (0, user_service_1.deleteUser)(req.params.id, req.user);
    return res.sendStatus(204);
};
exports.deleteUserHandler = deleteUserHandler;
const updateUserHandler = async (req, res) => {
    await (0, user_service_1.updateUser)(req.params.id, req.user, req.body);
    return res.sendStatus(204);
};
exports.updateUserHandler = updateUserHandler;
