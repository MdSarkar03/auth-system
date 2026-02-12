import rateLimit from "express-rate-limit";
import { RATE_LIMIT_CONFIG } from "../config/rateLimitConfig.js";

export const generalLimiter = rateLimit(RATE_LIMIT_CONFIG.GENERAL);
export const registerLimiter = rateLimit(RATE_LIMIT_CONFIG.REGISTER);
export const loginLimiter = rateLimit(RATE_LIMIT_CONFIG.LOGIN);
export const resetPasswordLimiter = rateLimit(RATE_LIMIT_CONFIG.RESET_PASSWORD);
export const otpLimiter = rateLimit(RATE_LIMIT_CONFIG.OTP_VERIFY);
export const resendOtpLimiter = rateLimit(RATE_LIMIT_CONFIG.OTP_RESEND);
