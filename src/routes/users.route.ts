import { Router } from "express";
import { signup, signin, forgotPassword, resetPassword, getUserById } from "../controllers/users.controller";

const userRouter = Router();

userRouter.route("/signup").post(signup);
userRouter.route("/signin").post(signin);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword").post(resetPassword);
userRouter.route("/").get(getUserById);

export {
    userRouter
}