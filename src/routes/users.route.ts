import { Router } from "express";
import { signup } from "../controllers/users.controller";

const userRouter = Router();

userRouter.route("/signup").post(signup);

export {
    userRouter
}