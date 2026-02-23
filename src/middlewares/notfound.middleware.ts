import { RequestHandler } from "express";
import { StatusCode } from "src/constants/http";
import { CustomError } from "src/utils/customerror";

export const notfoundHandler: RequestHandler = (_req, res) => {
    throw new CustomError(StatusCode.Status404NotFound)
}