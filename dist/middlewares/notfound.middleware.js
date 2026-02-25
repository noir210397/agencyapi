"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notfoundHandler = void 0;
const http_1 = require("../constants/http");
const customerror_1 = require("../utils/customerror");
const notfoundHandler = (_req, res) => {
    throw new customerror_1.CustomError(http_1.StatusCode.Status404NotFound);
};
exports.notfoundHandler = notfoundHandler;
