"use strict";

const { rateLimit } = require("express-rate-limit");

// OTP Send Rate Limiter
// Maximum 3 OTP requests per 15 minutes per IP.
const otpSendRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many OTP requests. Please try again after 15 minutes.",
  },

  handler: (req, res) => {
    res.setHeader("Retry-After", "900");
    return res.status(429).json({
      success: false,
      message:
        "Too many OTP requests. Please try again after 15 minutes.",
    });
  },
});

// OTP Verify Rate Limiter
// Maximum 5 verification requests per 15 minutes per IP.
const otpVerifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many OTP verification attempts. Please try again after 15 minutes.",
  },

  handler: (req, res) => {
    res.setHeader("Retry-After", "900");
    return res.status(429).json({
      success: false,
      message:
        "Too many OTP verification attempts. Please try again after 15 minutes.",
    });
  },
});

module.exports = {
  otpSendRateLimiter,
  otpVerifyRateLimiter,
};
