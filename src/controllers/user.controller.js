import { User } from '../models/user.model'
import bcryptjs from 'bcryptjs'

const registerController = async (req, res) => {

    try {
        let user;
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are requires" })
        }
         user = await User.findOne({ email })
        if (user) {
            return response.json({
                message: "Already register email",
                error: true,
                success: false
            })
        }

        const verifyCode = Math.floor(1000000 + Math.random() * 9000000).toString();
  const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new User(payload)
        await newUser.save()

const resp = sendEmailFunc(email, "Verify email", "", "Your otp is "+ verifyCode)

const verifyEmail = await sendEmail({
  sendTo: email,
  subject: "Verify email from binkeyit",
  html: verifyEmailTemplate({
    name,
    url: VerifyEmailUrl
  })
})


    

        return response.json({
            message: "User register successfully",
            error: false,
            success: true
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: "Server error"
        })
    }
};

const verifyEmailController = async (req, res) => {
    try {

    } catch (error) {

    }
};

const loginController = async (req, res) => {
    try {

    } catch (error) {

    }
};

const logoutController = async (req, res) => {
    try {

    } catch (error) {

    }
};

const uploadAvatar = async (req, res) => {
    try {

    } catch (error) {

    }
};

const updateUserDetails = async (req, res) => {
    try {

    } catch (error) {

    }
};

const verifyForgotPasswordOtp = async (req, res) => {
    try {

    } catch (error) {

    }
};

const forgotPasswordController = async (req, res) => {
    try {

    } catch (error) {

    }
};

const resetPassword = async (req, res) => {
    try {

    } catch (error) {

    }
};

const refreshToken = async (req, res) => {
    try {

    } catch (error) {

    }
};

const userDetails = async (req, res) => {
    try {

    } catch (error) {

    }
};


export {
    registerController,
    verifyEmailController,
    loginController,
    logoutController,
    uploadAvatar,
    updateUserDetails,
    verifyForgotPasswordOtp,
    forgotPasswordController,
    resetPassword,
    refreshToken,
    userDetails
}