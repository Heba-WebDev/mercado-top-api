import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {CustomRequest} from "../interfaces/customRequest"
import { globalError } from "../utils/globalError";
import { statusCode } from "../utils/httpStatusCode";
const { FAIL } = statusCode;

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHeader) {
        const err = new globalError("Token is required.", 401
        ,FAIL)
        return next(err);
    }

    const token = authHeader;

    try {
        const decodedToken = jwt.verify(token as string, process.env.JWT_SECRET_KEY as string);
        req.decodedToken = decodedToken as string;
        next();
    }catch(error) {
        const err = new globalError("Something went wrong!", 500
        ,FAIL)
        return next(err);
    }
}

export {
    verifyToken
}