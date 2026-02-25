"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../routes/index"));
const error_middleware_1 = require("../middlewares/error.middleware");
const cors_middleware_1 = __importDefault(require("../middlewares/cors.middleware"));
const notfound_middleware_1 = require("../middlewares/notfound.middleware");
const app = (0, express_1.default)();
app.use(cors_middleware_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
// ensure zod always gets an empty object not undefined
app.use((req, res, next) => {
    if (['POST', 'PUT'].includes(req.method) && req.body === undefined) {
        req.body = {};
    }
    next();
});
app.use("/api", index_1.default);
app.use(notfound_middleware_1.notfoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
