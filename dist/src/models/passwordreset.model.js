import { model, Schema } from "mongoose";
const passwordResetSchema = new Schema({ email: String });
const PasswordResetModel = model("passwordreset", passwordResetSchema);
export default PasswordResetModel;
