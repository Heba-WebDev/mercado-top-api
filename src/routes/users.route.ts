import { Router } from "express";
import { signup, signin, forgotPassword, resetPassword, getUserById, updateUser } from "../controllers/users.controller";
import upload from "../middlewares/multer";

const userRouter = Router();

userRouter.route("/signup").post(signup);
userRouter.route("/signin").post(signin);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword").post(resetPassword);
userRouter.route("/").get(getUserById);
userRouter.route("/updateUser").put(upload.fields([{ name: 'profile_picture', maxCount: 1 },
{ name: 'name' }, { name: 'email' }, { name: 'password' }, { name: 'country' }]), updateUser);

export {
    userRouter
}