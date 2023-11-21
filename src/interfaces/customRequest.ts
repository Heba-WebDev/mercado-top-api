import { Request as ExpressRequest } from "express";

interface CustomRequest extends ExpressRequest {
    decodedToken: string;
}

export {
    CustomRequest
}
