import { Response, Request, NextFunction } from "express";
import Users from "../data/users";
import { hash } from "bcrypt";
import Locations from "../data/locations";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer"
import {compare}  from "bcrypt"
import { wrapper } from "../middlewares/asyncWrapper";
import { statusCode } from "../utils/httpStatusCode";
import { globalError } from "../utils/globalError";
import { generateJwt } from "../utils/generateJWT";
const { SUCCESS, FAIL } = statusCode;


const signup = wrapper(async(req: Request, res: Response, next: NextFunction) => {
const { name, email, password, country } = req.body;
if (!name || !email || !password || !country) {
    const err = new globalError("Name, Email, Password and country are required.", 400
    ,FAIL)
    return next(err);
}

const usr = await Users.findOne({where: {email: email}});

if (usr) {
    const err = new globalError("Email already exists.", 400
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

const signin = wrapper(async(req: Request, res: Response, next: NextFunction) => {
const { email, password } = req.body;
if (!email || !password) {
    const err = new globalError("Email and Password are required.", 400
    ,FAIL)
    return next(err);
}

const usr = await Users.findOne({where: {email: email}});

if (!usr) {
    const err = new globalError("User not found.", 400
    ,FAIL)
    return next(err);
}

const matchedPassword = await compare(password, usr.password!);
const token = await generateJwt({name: usr.name, country: usr.country});

if (!matchedPassword) {
    const err = new globalError("Invalid Credentials.", 401
    ,FAIL)
    return next(err);
} else {
    return res.status(200).send({
        status: SUCCESS,
        data: {
            name: usr.name,
            email: usr.email,
            country: usr.country,
            accessToken: token
        },
        message: "User successfully logged in."
    })
}
})

const forgotPassword = wrapper(async(req: Request, res: Response, next: NextFunction) => {
const { email } = req.body;
if (!email) {
    const err = new globalError("Email is required.", 400
    ,FAIL)
    return next(err);
}

const usr = await Users.findOne({where: {email: email}});

if (!usr) {
    const err = new globalError("User not found.", 400
    ,FAIL)
    return next(err);
}

const token = jwt.sign({name: usr.name}, process.env.JWT_REFRESH_EXPIRATION as string, {
    expiresIn: process.env.JWT_EMAIL_EXPIRATION
});

const transporter = createTransport({
  host: process.env.SERVICE,
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
    from: process.env.EMAIL_USR,
    to: email,
    subject: "Reset password | Mercado Top",
    text: `Click on this link to reset your password:
     ${process.env.BASE_URL}/reset-password?token=${token}`,
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    const err = new globalError("An error happened while sending the email.", 500
        ,FAIL)
    return next(err);
    } else {
    return res.status(200).send({
        status: SUCCESS,
        message: `An email has been sent.`,
        data: info.response
    })
    }
});

})

export {
    signup,
    signin,
    forgotPassword
}