import { Schema, model } from "mongoose";
import { Role } from "../../src/types/roles";
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    age: Number,
    shareCode: String,
    accNumber: String,
    sortCode: String,
    gender: String,
    mobileNumber: String,
    email: String,
    address: {
        postCode: String,
        streetAddress: String,
        town: String,
    },
    password: String,
    role: { type: String, enum: Object.values(Role), default: Role.AGENT },
    mustChangePassword: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});
const User = model("Users", userSchema);
export default User;
