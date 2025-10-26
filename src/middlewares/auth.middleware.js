import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
       return res
        .status(400)
        .json({ success: false, message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// console.log('token is:', decodedToken)
    const user = await User.findOne({email: decodedToken?.email}).select(
      "-password -refreshToken"
    );
   
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error?.message });
  }
};
