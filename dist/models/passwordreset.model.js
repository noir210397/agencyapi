"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passwordResetSchema = new mongoose_1.Schema({ email: String });
const PasswordResetModel = (0, mongoose_1.model)("passwordreset", passwordResetSchema);
exports.default = PasswordResetModel;
