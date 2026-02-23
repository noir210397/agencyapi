import { model, Schema } from "mongoose";

interface PasswordReset {
    email: string
}
const passwordResetSchema = new Schema<PasswordReset>({ email: String })
const PasswordResetModel = model<PasswordReset>("passwordreset", passwordResetSchema)
export default PasswordResetModel