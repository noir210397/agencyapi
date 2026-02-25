"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const http_1 = require("../constants/http");
const jwthelper_1 = require("../utils/jwthelper");
function authorize(allowedRoles) {
    const authMiddleware = (req, res, next) => {
        if (!req.user) {
            const bearer = req.headers.authorization;
            if (!bearer)
                return res.sendStatus(http_1.StatusCode.Status401Unauthorized);
            const token = bearer.split(" ")[1];
            if (!token)
                return res.sendStatus(http_1.StatusCode.Status401Unauthorized);
            req.user = (0, jwthelper_1.verifyToken)(token);
        }
        if (!allowedRoles) {
            next();
        }
        else {
            const isAuthorized = allowedRoles.split(",").find((role) => role === req.user.role);
            if (!isAuthorized)
                return res.sendStatus(http_1.StatusCode.Status401Unauthorized);
            next();
        }
    };
    return authMiddleware;
}
