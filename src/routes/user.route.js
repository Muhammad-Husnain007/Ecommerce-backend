import { Router } from 'express'
import { 
  forgotPasswordController, 
  loginController, 
  logoutController, 
  refreshToken, 
  registerController, 
  verifyEmailController,
  uploadAvatar,
  updateUserDetails,
  forgotPasswordOtpController,
  verifyForgotPasswordOtp,
  resetPassword,
  userDetails
} from '../../controllers/auth.js' // Assuming all controllers are imported from auth.js
import auth from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js' // Assuming single function/instance

const userRouter = Router()

userRouter.post('/register', registerController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
userRouter.post('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details', auth, userDetails)

export default userRouter;