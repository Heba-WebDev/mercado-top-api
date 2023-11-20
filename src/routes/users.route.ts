import { Router } from "express";
import { signup, signin, forgotPassword } from "../controllers/users.controller";

const userRouter = Router();

userRouter.route("/signup").post(signup);
userRouter.route("/signin").post(signin);
userRouter.route("/forgotPassword").post(forgotPassword);

export {
    userRouter
}