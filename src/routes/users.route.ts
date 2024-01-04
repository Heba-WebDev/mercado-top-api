import { Router } from "express";
import { signup, signin, forgotPassword, resetPassword, getUserById, updateUser, deleteUser } from "../controllers/users.controller";
import upload from "../middlewares/multer";

const userRouter = Router();

userRouter.route("/signup").post(upload.single('profile_picture'), signup);
userRouter.route("/signin").post(signin);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword").post(resetPassword);
userRouter.route("/").get(getUserById);
userRouter.route("/updateUser")
  .put(upload.single('profile_picture'), updateUser);

userRouter.route("/").delete(deleteUser);

export {
    userRouter
}