import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetPassOtp,
  sendVerifyOtp,
  verifyEmail,
  verifyResetOtp,
} from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";
import {
  loginLimiter,
  registerLimiter,
  resetPasswordLimiter,
  otpLimiter,
  resendOtpLimiter,
} from "../middlewares/rateLimiter.js";

const authRouter = express.Router();

authRouter.post("/register", registerLimiter, register);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, resendOtpLimiter, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, otpLimiter, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", resetPasswordLimiter, sendResetPassOtp);
authRouter.post("/verify-reset-otp", otpLimiter, verifyResetOtp);
authRouter.post("/reset-password", resetPasswordLimiter, resetPassword);

export default authRouter;
