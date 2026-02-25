"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Status200OK"] = 200] = "Status200OK";
    StatusCode[StatusCode["Status201Created"] = 201] = "Status201Created";
    StatusCode[StatusCode["Status204NoContent"] = 201] = "Status204NoContent";
    StatusCode[StatusCode["Status400BadRequest"] = 400] = "Status400BadRequest";
    StatusCode[StatusCode["Status401Unauthorized"] = 401] = "Status401Unauthorized";
    StatusCode[StatusCode["Status403Forbidden"] = 403] = "Status403Forbidden";
    StatusCode[StatusCode["Status404NotFound"] = 404] = "Status404NotFound";
    StatusCode[StatusCode["Status500ServerError"] = 500] = "Status500ServerError";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
