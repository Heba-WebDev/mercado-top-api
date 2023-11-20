import { Response, Request, NextFunction } from "express";
import Users from "../data/users";
import { hash } from "bcrypt";
import Locations from "../data/locations";
import { wrapper } from "../middlewares/asyncWrapper";
import { statusCode } from "../utils/httpStatusCode";
import { globalError } from "../utils/globalError";
const { SUCCESS, FAIL } = statusCode;

const signup = wrapper(async(req: Request, res: Response, next: NextFunction) => {
const { name, email, password, country } = req.body;
if (!name || !email || !password || !country) {
    const err = new globalError("Name, Email, Password and country are required.", 400
    ,FAIL)
    return next(err);
}

const location = await Locations.findOne({where: {country: country}});

if (!location) {
    const err = new globalError("Please provide a valid country name.", 400
    ,FAIL)
    return next(err);
}

const hashedPassword = await hash(password, 10);

const user = new Users({name: name, email: email, password: password});
Users.create({
    name: name,
    email: email,
    password: hashedPassword,
    country: location?.dataValues?.country
})
.then((result) => {
    return res.status(201).send({
        status: SUCCESS,
        message: "User successfully created.",
        data: {
            name: name,
            email: email,
            country: location?.dataValues?.country
        }
    })
})
})

export {
    signup
}