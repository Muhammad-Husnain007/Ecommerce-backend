import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { deleteFileFromCloudinary, fileUploadCloudinary } from "../config/FileUpload.js";

const sendEmail = async ({ to, name, verificationLink }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: `"ClassShop Security Team" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Confirm your email address to activate your account",
      text: `Hi ${name || ""},

Welcome to YourApp!

To activate your account, please verify your email address by clicking the secure link below:
${verificationLink}

This link will expire in 1 hour for your security.

If you did not create an account with YourApp, please ignore this email — no further action is required.

Thank you for helping us keep your account secure.

— YourApp Security Team
${process.env.APP_URL}`,
      html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#333;max-width:600px;margin:auto;">
        <h2 style="color:#222;">Hi ${name || ""},</h2>
        <p>Welcome to <strong>YourApp</strong>!</p>
        <p>To activate your account, please verify your email by clicking the button below:</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${verificationLink}"
             style="background-color:#007bff;color:#fff;padding:12px 20px;
                    text-decoration:none;border-radius:6px;font-weight:bold;">
            Verify Email
          </a>
        </p>
        <p>This link will expire in 1 hour for your security.</p>
        <hr style="margin-top:40px;border:none;border-top:1px solid #ddd;">
        <p style="font-size:13px;color:#666;">ClassyShop Security Team<br>${
          process.env.APP_URL
        }</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send email");
  }
};

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
    const verificationToken = jwt.sign(
      { email: email },
      process.env.VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY,
      }
    );

    const verificationLink = `${process.env.APP_URL}/user/verify-email/?token=${verificationToken}`;

    await sendEmail({
      to: email,
      name,
      verificationLink,
    });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      refresh_token: refreshToken,
      verification_link: verificationLink,
      verification_token: verificationToken,
      verification_token_expiry: process.env.VERIFICATION_TOKEN_EXPIRY,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully. Verification link sent to email.",
      data: { newUser },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);
    } catch (err) {
      console.log(err.name);
      // if(err.name === "TokenExpiredError"){
      // // return res.redirect(`${process.env.FRONTEND_URL}/againVerifyEmail`);
      // }
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.email_verify) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }
    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    user.email_verify = true;
    user.last_login_date = Date.now();
    user.verification_token = null;
    user.access_token = accessToken;
    user.verification_token_expiry = null;
    user.verification_link = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
    });

    // return res.redirect(`${process.env.FRONTEND_URL}/email-verified-success`);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const againVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Verification email missing",
      });
    }
    const user = await User.findOne({ email });
    console.log("again verify ka user: ", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const verificationToken = jwt.sign(
      { email: email },
      process.env.VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY,
      }
    );

    const verificationLink = `${process.env.APP_URL}/user/verify-email/?token=${verificationToken}`;

    await sendEmail({
      to: email,
      // name,
      verificationLink,
    });

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification link send successfully",
      verification_link: verificationLink,
    });
    // return res.redirect(`${process.env.FRONTEND_URL}/email-verified-success`);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          access_token: 1,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "User Logout Successfully",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password both required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This email user not found",
      });
    }
    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    user.access_token = accessToken;
    user.last_login_date = Date.now();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refresh_token -access_token"); 

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).select("-password -refresh_token -access_token");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const userDelete = async (req, res) => {
    try {
        const { userId } = req.params
        const deleteUser = await User.findByIdAndDelete(userId)

        return res.status(200)
            .json({
                success: true,
                message: "User Delete Successfully",
                data: deleteUser
            });
    } catch (error) {
        return res.status(500).json({success: false, message: "Server error" })
    }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const forgotPassToken = jwt.sign(
      { userId: user._id },
      process.env.FORGOT_PASSWORD_TOKEN_SECRET,
      { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRY}
    );

    // Reset link
    const verificationLink = `http://localhost:3000/user/reset-password/?token=${forgotPassToken}`;

   await sendEmail({
      to: email,
      // name,
      verificationLink,
    });

    
    user.forgot_password_token = forgotPassToken;
    user.forgot_password_expiry = Date.now() + 60 * 60 * 1000; // 1 hour from now

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Forgot password request sent to email",
      verificationLink: verificationLink,
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
    try {
      const {token} = req.query
        const { newPassword, confirmPassword } = req.body;
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);
        } catch (err) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        console.log('decode is: ', decoded)
        const user = await User.findOne({_id: decoded.userId });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        const passwordHash =await bcryptjs.hash(newPassword, 10)
        
        user.password = passwordHash;
        user.forgot_password_token = undefined;
        user.forgot_password_expiry = undefined;
        await user.save();

        return res
            .status(200)
            .json({ success: true, message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error?.message });
    }
};

const uploadProfile = async(req,res) => {
 try {
    const { userId } = req.params;
    const profileLocalPath = req?.files?.profile?.[0]?.path;
    if (!profileLocalPath) {
      return res.status(400).json({ success: false, message: "Profile image is required" });
    }
     console.log('userid: ',userId)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let oldProfile = user.profile
    if(oldProfile){
     await deleteFileFromCloudinary(oldProfile)
    }

    const uploadResult = await fileUploadCloudinary(profileLocalPath);
    if (!uploadResult) {
      return res.status(400).json({ success: false, message: "Error uploading to Cloudinary" });
    }

    user.profile = uploadResult.secure_url;
    await user.save();

   
    return res.status(200).json({
      success: true,
      message: "Profile uploaded successfully",
      profileUrl: uploadResult.secure_url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error?.message,
    });
  }
};

const deleteProfile = async(req,res) => {
  try {
    const {userId} = req.params;
    const user = await User.findById(userId)
     if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const profile = user.profile
    await deleteFileFromCloudinary(profile)
    user.profile = null;
    await user.save();

   
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      data: {},
    });

  }  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error?.message,
    });
  }
}

export {
  registerController,
  verifyEmail,
  logoutUser,
  againVerifyEmail,
  loginUser,
  getUserById,
  getAllUsers,
  userDelete,
  forgotPassword,
  resetPassword,
  uploadProfile,
  deleteProfile
};
