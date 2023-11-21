import { Response, Request, NextFunction } from "express";
import Locations from "../data/locations";
import { wrapper } from "../middlewares/asyncWrapper";
import { statusCode } from "../utils/httpStatusCode";
import { globalError } from "../utils/globalError";
import { off } from "process";
const { SUCCESS, FAIL } = statusCode;


const getLocations = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = (page - 1) * limit;
    const totalLocations= await Locations.count();
    const totalPages = Math.ceil(totalLocations / limit);
    const locations = await Locations.findAll({
        limit: limit,
        offset: offset
    });
    if (locations.length === 0) {
        const err = new globalError("No Location found.", 404
        ,FAIL)
        return next(err);
    }

    return res.status(200).send({
        status: SUCCESS,
        data: locations,
        totalPages: totalPages
    });
})

export {
    getLocations
}
