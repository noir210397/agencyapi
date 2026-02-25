"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_config_1 = require("./config/db.config");
const app_config_1 = __importDefault(require("./config/app.config"));
// import { seedData } from './seeding/seeder';
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await (0, db_config_1.connectDB)();
        app_config_1.default.listen(PORT, async (err) => {
            if (err)
                throw err;
            if (process.env.ENV === "DEV") {
                // await seedData()
                console.log(`url: http://localhost:${PORT}`);
            }
        });
    }
    catch (err) {
        console.log(err);
        // console.log("fixed2");
    }
}
startServer();
