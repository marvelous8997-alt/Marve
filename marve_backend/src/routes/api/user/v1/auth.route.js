"use strict";

const express = require("express");
const router = express.Router();
const { userAuthController } = require("../../../../../src/controllers/index");
const { otpSendRateLimiter, otpVerifyRateLimiter } = require("../../../../middleware/otpRateLimiter");

// Send OTP
router.post(
    "/send-otp",
    otpSendRateLimiter,
    userAuthController.sendOtp
);

// Verify OTP
router.post(
    "/verify-otp",
    otpVerifyRateLimiter,
    userAuthController.verifyOtp
);

module.exports = router;
