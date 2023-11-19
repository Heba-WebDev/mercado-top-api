import { Response, Request, NextFunction } from "express";
import Users from "../data/users";
import { hash } from "bcrypt";
import Locations from "../data/locations";

const signup = async(req: Request, res: Response, next: NextFunction) => {
const { name, email, password, country } = req.body;
if (!name || !email || !password || !country) {
    return res.status(400).send({
        message: "Name, Email, Password and country are required.",
        data: null
    })
}

const location = await Locations.findOne({where: {country: country}});

if (!location) {
    return res.status(400).send({
        message: "Please provide a valid country name.",
        data: null
    })
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
        message: "User successfully created.",
        data: {
            name: name,
            email: email,
            country: location?.dataValues?.country
        }
    })
})
.catch((error) => {
    return res.status(500).send({
        message: "Oops! Something went wrong.",
        error: error.message,
    })
})
}

export {
    signup
}