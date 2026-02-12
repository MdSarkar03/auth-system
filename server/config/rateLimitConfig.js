// base config applied to all limiters
const baseConfig = {
  standardHeaders: true,
  legacyHeaders: false,
  //   skip: (req) => process.env.NODE_ENV !== "production",
};

export const RATE_LIMIT_CONFIG = {
  // general API - 100 requests per 15 minutes
  GENERAL: {
    ...baseConfig,
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  },

  REGISTER: {
    ...baseConfig,
    windowMs: 60 * 60 * 1000,
    max: 3,
    skipSuccessfulRequests: true,
    message: "Too many accounts created from this IP, please try again later.",
  },

  LOGIN: {
    ...baseConfig,
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    message: "Too many login attempts, please try again later.",
  },

  RESET_PASSWORD: {
    ...baseConfig,
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: "Too many password reset attempts, please try again later.",
  },

  OTP_VERIFY: {
    ...baseConfig,
    windowMs: 30 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: "Too many OTP verification attempts, please try again later.",
  },

  OTP_RESEND: {
    ...baseConfig,
    windowMs: 60 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: "Too many OTP resend attempts, please try again later.",
  },
};
