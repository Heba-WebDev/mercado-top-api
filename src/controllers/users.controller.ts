import { Response, Request, NextFunction } from "express";
import Users from "../data/users";
import { hash } from "bcrypt";
import fs from "fs"
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer"
import {compare}  from "bcrypt"
import { wrapper } from "../middlewares/asyncWrapper";
import { statusCode } from "../utils/httpStatusCode";
import { globalError } from "../utils/globalError";
import { generateJwt } from "../utils/generateJWT";
import path from "path";
import Products from "../data/products";
import cloudinary from "../utils/cloudinary";
const { SUCCESS, FAIL } = statusCode;


const signup = wrapper(async(req: Request, res: Response, next: NextFunction) => {
const { name, username, email, password, country, profile_picture, terms } = req.body;
if (!name || !username || !email || !password || !country || !terms) {
    const err = new globalError("Name, Username, Email, Password, Country and Terms are required.", 400
    ,FAIL)
    return next(err);
}

const usernamePattern = /^[A-Za-z0-9_-]*$/;

if (!usernamePattern.test(username)) {
    const err = new globalError("Username can only contain letters, digits, underscores or dashes.", 400, FAIL);
    return next(err);
}

const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
if (!emailPattern.test(email)) {
    const err = new globalError("Invalid email.", 400, FAIL);
    return next(err);
}

const usr = await Users.findOne({where: {email: email}});
if (usr) {
    const err = new globalError("Email already exists.", 400
    ,FAIL)
    return next(err);
}

const usrname = await Users.findOne({where: {username: username}});
if (usrname) {
    const err = new globalError("Username already exists.", 400
    ,FAIL)
    return next(err);
}

if(!terms) {
    const err = new globalError("You must agree to the Terms & Conditions.", 404
    ,FAIL)
    return next(err);
}

const hashedPassword = await hash(password, 10);
let pic;
if(req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    pic = result.url;
}

Users.create({
    name: name,
    username: username,
    email: email,
    password: hashedPassword,
    country: country,
    biography: "",
    profile_picture: pic ? pic : "black-guy.jpg",
    terms: true,
})
.then((result) => {
    return res.status(201).send({
        status: SUCCESS,
        message: "User successfully created.",
        data: {
            name: name,
            username: username,
            role: result.dataValues.role,
            email: email,
            country: country,
            profile_picture: result?.dataValues?.profile_picture || profile_picture,
            terms: true,
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
const token = await generateJwt({user_id: usr.user_id, country: usr.country});

if (!matchedPassword) {
    const err = new globalError("Invalid Credentials.", 401
    ,FAIL)
    return next(err);
} else {
    return res.status(200).send({
        status: SUCCESS,
        data: {
            user_id: usr.user_id,
            name: usr.name,
            role: usr.role,
            email: usr.email,
            country: usr.country,
            accessToken: token,
            profile_picture: usr.profile_picture
        },
        message: "User successfully logged in."
    })
}
});

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

const token = jwt.sign({name: usr.name}, process.env.JWT_SECRET_KEY as string, {
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
const link = `${process.env.BASE_URL_EMAIL}/reset-password?token=${token}&email=${usr.email}`
const year: string = String(new Date().getFullYear());
const htmlTemplate = fs.readFileSync(path.join(__dirname, '../../src/views/emails/RestPassword.html'), 'utf8');
const htmlContent = htmlTemplate.replace('{name}', usr?.name as string).replace('{links}', link).replace(`{year}`, year);
const mailOptions = {
    from: process.env.EMAIL_USR,
    to: email,
    subject: "Reset password | Mercado Top",
    html : htmlContent
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

});

const resetPassword = wrapper(async(req: Request, res: Response, next: NextFunction) => {
const { email, token, newPassword } = req.body;
if (!email || !token || !newPassword) {
    const err = new globalError("Email, Password and token are required.", 400
    ,FAIL)
    return next(err);
}

const usr = await Users.findOne({where: {email: email}});

if (!usr) {
    const err = new globalError("User not found.", 400
    ,FAIL)
    return next(err);
}
const hashedPassword = await hash(newPassword, 10);
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  usr.password = hashedPassword;
  await usr.save();
  return res.status(200).send({
        status: SUCCESS,
        message: `Password successfully changed.`,
    })
} catch (err) {
  console.error('JWT verification failed:', err);
  const error = new globalError("Invalid token.", 401, FAIL);
  return next(error);
}

});

const getUserById = wrapper(async(req: Request, res: Response, next: NextFunction) => {
const { user_id } = req.body;
if (!user_id) {
    const err = new globalError("Id is required.", 400
    ,FAIL)
    return next(err);
}

const usr = await Users.findOne({where: {user_id: user_id}});

if (!usr) {
    const err = new globalError("User not found.", 404
    ,FAIL)
    return next(err);
} else {
    return res.status(200).send({
        status: SUCCESS,
        data: {
            user_id: usr.user_id,
            name: usr.name,
            email: usr.email,
            country: usr.country
        }
    })
}



});

const updateUser = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const {user_id, name, email, password, country, profile_picture} = req.body;
    if (!user_id) {
        const err = new globalError("A user_id is required.", 400
    ,FAIL)
    return next(err);
    }
    const usr = await Users.findOne({where: {user_id: user_id}});
    if (!usr) {
    const err = new globalError("User not found.", 404
    ,FAIL)
    return next(err);
    }
    const updatedFields: any = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) {
        const hashedPassword = await hash(password, 10);
        updatedFields.password = hashedPassword;
    }
    if (country) updatedFields.country = country;
    if(req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
       updatedFields.profile_picture = result.url;
    }
    await Users.update(updatedFields, {where: {user_id: user_id} });
    if (name) {
        await Products.update({ user_name: name }, { where: { user_id: user_id }, returning: true });
    }
    await usr.reload();
    return res.status(200).send({
        statusCode: SUCCESS,
        data: {
            usr
        },
        message: "Settings sucessfully updated"
    })
});

const deleteUser = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const {user_id} = req.body;
    if (!user_id) {
        const err = new globalError("A user_id is required.", 400
    ,FAIL)
    return next(err);
    }
    const usr = await Users.findOne({where: {user_id: user_id}});
    if (!usr) {
    const err = new globalError("User not found.", 404
    ,FAIL)
    return next(err);
    }

    await Users.destroy({where: {user_id: user_id}});
    return res.status(200).send({
        statusCode: SUCCESS,
        data: null,
        message: "The account has been successfully deleted."
    })
});

const updateRole = wrapper(async(req: Request, res: Response, next: NextFunction) => {
    const {id} = req.body;
    const checkId = await Users.findOne({where: {user_id: id}});
    if(!id || !checkId) {
        const err = new globalError("Invalid user_id is required.", 400
    ,FAIL)
    return next(err);
    }

    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHeader) {
        const err = new globalError("Token is required.", 401
        ,FAIL)
        return next(err);
    }
    const decodedToken = jwt.verify(authHeader as string, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;
    const userId = decodedToken?.user_id;
    const usr = await Users.findOne({
        where: {user_id: userId}
    });
    if(usr?.role === "user") {
        const err = new globalError("You do not have permission to perform this action.", 401
        ,FAIL)
        return next(err);
    };
    await Users.update({ role: "admin" }, { where: { user_id: id } }).then((result) => {
        res.status(200).send({
            status: SUCCESS,
            data: null,
            message: 'User role updated successfully.'
        })
    });
});

export {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    getUserById,
    updateUser,
    deleteUser,
    updateRole
}