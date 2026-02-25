"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const shift_route_1 = __importDefault(require("./shift.route"));
const booking_route_1 = __importDefault(require("./booking.route"));
const user_route_1 = __importDefault(require("./user.route"));
const client_route_1 = __importDefault(require("./client.route"));
const job_route_1 = __importDefault(require("./job.route"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
//authroutes
router.use("/auth", auth_route_1.default);
//shift routes
router.use("/shift", shift_route_1.default);
//booking routes
router.use("/booking", booking_route_1.default);
//user routes
router.use("/user", user_route_1.default);
//client routes
router.use("/client", (0, auth_middleware_1.authorize)("ADMIN,MANAGER"), client_route_1.default);
//job routes
router.use("/job", job_route_1.default);
exports.default = router;
