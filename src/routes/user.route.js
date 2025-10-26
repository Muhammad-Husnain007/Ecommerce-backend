import { Router } from "express";
import {
  registerController,
  verifyEmail,
  againVerifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  uploadProfile,
  deleteProfile,
  getAllUsers,
  getUserById,
  userDelete,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

// 🔹 Auth & Registration Routes
userRouter
  .route("/register")
  .post(registerController);

userRouter
  .route("/login")
  .post(loginUser);

userRouter
  .route("/verify-email")
  .get(verifyEmail);

userRouter
  .route("/again-verify-email")
  .post(againVerifyEmail);

userRouter
  .route("/logout/:userId")
  .post(logoutUser);

// 🔹 Password Management
userRouter
  .route("/forgot-password")
  .post(forgotPassword);

userRouter
  .route("/reset-password")
  .post(resetPassword);

// 🔹 Profile Management
userRouter
  .route("/upload-profile/:userId")
  .post(
    verifyJwt,
    upload.fields([{ name: "profile", maxCount: 1 }]),
    uploadProfile
  );

userRouter
  .route("/delete-profile/:userId")
  .delete(verifyJwt, deleteProfile);

userRouter
  .route("/")
  .get(getAllUsers);

userRouter
  .route("/:userId")
  .get(getUserById)
  .delete(userDelete);

export default userRouter;
