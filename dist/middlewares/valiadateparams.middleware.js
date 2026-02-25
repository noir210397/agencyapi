"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdParam = validateIdParam;
const http_1 = require("../constants/http");
const customerror_1 = require("../utils/customerror");
const base_1 = require("../validators/base");
function validateIdParam(routeName) {
    return (req, res, next) => {
        const { success } = base_1.idParamSchema.safeParse(req.params.id);
        if (!success) {
            throw new customerror_1.CustomError(http_1.StatusCode.Status400BadRequest, null, `invalid ${routeName} id param provided`);
        }
        else
            next();
    };
}
