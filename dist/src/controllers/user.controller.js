import { deleteUser, getSingleUser, getUsers, updateUser } from "../../src/services/user.service";
export const getUsersHandler = async (req, res) => {
    const clients = await getUsers();
    return res.json(clients);
};
export const getSingleUserHandler = async (req, res) => {
    const client = await getSingleUser(req.params.id);
    return res.json(client);
};
export const deleteUserHandler = async (req, res) => {
    await deleteUser(req.params.id, req.user);
    return res.sendStatus(204);
};
export const updateUserHandler = async (req, res) => {
    await updateUser(req.params.id, req.user, req.body);
    return res.sendStatus(204);
};
