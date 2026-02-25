"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//holds client information
const clientSchema = new mongoose_1.Schema({
    companyName: String,
    address: {
        postCode: String,
        streetAddress: String,
        town: String,
    },
});
const Client = (0, mongoose_1.model)("Clients", clientSchema);
exports.default = Client;
