import { Router } from "express";
import { getLocations } from "../controllers/locations.controller";

const locationsRouter = Router();

locationsRouter.route("/").get(getLocations);

export {
    locationsRouter
}
