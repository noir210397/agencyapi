"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI;
/**
 * Initialize and return a MongoDB connection.
 */
async function connectDB() {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI must be defined in .env');
        }
        await mongoose_1.default.connect(MONGO_URI, {
        // these options are now defaults in Mongoose 6+, but you can still override:
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected');
    }
    catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // bail out
    }
}
