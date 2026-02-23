import { StatusCode } from "src/constants/http";
import { CustomError } from "src/utils/customerror";
import { idParamSchema } from "src/validators/base";
export function validateIdParam(routeName) {
    return (req, res, next) => {
        const { success } = idParamSchema.safeParse(req.params.id);
        if (!success) {
            throw new CustomError(StatusCode.Status400BadRequest, null, `invalid ${routeName} id param provided`);
        }
        else
            next();
    };
}
