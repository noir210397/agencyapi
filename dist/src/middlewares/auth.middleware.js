import { StatusCode } from "../../src/constants/http";
import { verifyToken } from "../../src/utils/jwthelper";
function authorize(allowedRoles) {
    const authMiddleware = (req, res, next) => {
        if (!req.user) {
            const bearer = req.headers.authorization;
            if (!bearer)
                return res.sendStatus(StatusCode.Status401Unauthorized);
            const token = bearer.split(" ")[1];
            if (!token)
                return res.sendStatus(StatusCode.Status401Unauthorized);
            req.user = verifyToken(token);
        }
        if (!allowedRoles) {
            next();
        }
        else {
            const isAuthorized = allowedRoles.split(",").find((role) => role === req.user.role);
            if (!isAuthorized)
                return res.sendStatus(StatusCode.Status401Unauthorized);
            next();
        }
    };
    return authMiddleware;
}
export { authorize };
