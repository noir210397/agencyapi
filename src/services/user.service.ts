import { StatusCode } from "src/constants/http";
import User from "src/models/user.model";
import { AccessTokenPayload } from "src/types/token";
import { CustomError } from "src/utils/customerror";
import { formatJSON } from "src/utils/formatData";
import { updateAdminOrManager, updateAgentSchema } from "src/validators/user/user.validators";

export async function getUsers() {
    const users = await User.find().lean()
    return formatJSON(users)
}
export async function getSingleUser(userId: string) {
    const user = await User.findById(userId).lean()
    if (!user) throw new CustomError(StatusCode.Status404NotFound, null, "user was not found")
    return formatJSON(user)
}
export async function deleteUser(userId: string, user: AccessTokenPayload) {
    const { role, sub: id } = user
    //user can only delete their accounts
    if (role === "AGENT" && id !== userId) throw new CustomError(StatusCode.Status403Forbidden)
    const userTodelete = await User.findById(userId)
    if (!userTodelete) throw new CustomError(StatusCode.Status404NotFound, null, "user was not found")
    //ensure admins can only delete agents
    if (userTodelete.role !== "AGENT" && role === "ADMIN") throw new CustomError(StatusCode.Status403Forbidden)
    const { deletedCount } = await userTodelete.deleteOne()
    if (deletedCount !== 1) throw new CustomError(StatusCode.Status404NotFound, null, "unable to delete user")
}
export async function updateUser(userId: string, user: AccessTokenPayload, body: unknown) {
    const { role, sub: id } = user
    if (role === "AGENT") {
        const authorized = id === userId
        if (!authorized) throw new CustomError(StatusCode.Status403Forbidden)
        const { success, data, error } = updateAgentSchema.safeParse(body)
        if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
        if (Object.keys(data).length === 0) return "no update required"
        const updated = await User.findOneAndUpdate({ _id: userId }, data)
        if (!updated) throw new CustomError(StatusCode.Status404NotFound)
    }
    else if (role === "ADMIN") {
        const user = await User.findOne({ _id: userId }).select("role")
        if (!user) throw new CustomError(StatusCode.Status404NotFound, null, "user not found")
        if (user.role === "AGENT") {
            const { success, data, error } = updateAgentSchema.safeParse(body)
            if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
            if (Object.keys(data).length === 0) return "no update required"
            const updated = await User.findOneAndUpdate({ _id: userId }, data)
            if (!updated) throw new CustomError(StatusCode.Status404NotFound)
        }
        else if (user.role === "ADMIN") {
            if (user._id.toString() !== id) throw new CustomError(StatusCode.Status403Forbidden)
            const { success, data, error } = updateAdminOrManager.safeParse(body)
            if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
            if (Object.keys(data).length === 0) return "no update required"
            const updated = await User.findOneAndUpdate({ _id: userId }, data)
            if (!updated) throw new CustomError(StatusCode.Status404NotFound)
        }
        else if (user.role === "MANAGER") throw new CustomError(StatusCode.Status403Forbidden)
        else throw new CustomError(StatusCode.Status403Forbidden)
    }
    else if (role === "MANAGER") {
        const user = await User.findOne({ _id: userId }).select("role")
        if (!user) throw new CustomError(StatusCode.Status404NotFound, null, "user not found")
        if (user.role === "AGENT") {
            const { success, data, error } = updateAgentSchema.safeParse(body)
            if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
            if (Object.keys(data).length === 0) return "no update required"
            const updated = await User.findOneAndUpdate({ _id: userId }, data)
            if (!updated) throw new CustomError(StatusCode.Status404NotFound)
        }
        else if (user.role === "ADMIN") {
            const { success, data, error } = updateAdminOrManager.safeParse(body)
            if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
            if (Object.keys(data).length === 0) return "no update required"
            const updated = await User.findOneAndUpdate({ _id: userId }, data)
            if (!updated) throw new CustomError(StatusCode.Status404NotFound)
        }
        else if (user.role === "MANAGER") {
            if (user._id.toString() !== id) throw new CustomError(StatusCode.Status403Forbidden)
            const { success, data, error } = updateAdminOrManager.safeParse(body)
            if (!success) throw new CustomError(StatusCode.Status400BadRequest, error)
            if (Object.keys(data).length === 0) return "no update required"
            const updated = await User.findOneAndUpdate({ _id: userId }, data)
            if (!updated) throw new CustomError(StatusCode.Status404NotFound)
        }
        else throw new CustomError(StatusCode.Status403Forbidden)
    }
}
