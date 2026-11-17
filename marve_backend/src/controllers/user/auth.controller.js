"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");
const {userAuthService} = require("../../services/index");
const { sendOtpSchema, verifyOtpSchema } = require("../../validations/user/auth.validation");

const sendOtp = asyncHandler(async (req, res) => {
    const { error, value } = sendOtpSchema.validate(
        req.body,
        {
            abortEarly: true,
        }
    );
    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }
    const result = await userAuthService.sendOtp(value);
    return ResponseHelper.success(
        res,
        "OTP sent successfully.",
        result,
        200
    );
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { error, value } = verifyOtpSchema.validate(
        req.body,
        {
            abortEarly: true,
        }
    );
    if (error) {
        return ResponseHelper.error(
            res,
            error.details[0].message,
            null,
            422
        );
    }
    const result = await userAuthService.verifyOtp(value);
    return ResponseHelper.success(
        res,
        "OTP verified successfully. Login successful.",
        result,
        200
    );
});

module.exports = {
    sendOtp,
    verifyOtp,
};