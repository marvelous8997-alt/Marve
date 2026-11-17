"use strict";

const crypto = require("crypto");
const {userAuthRepository} = require("../../repositories/index");
const ApiError = require("../../utils/ApiError");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt");

const OTP_LENGTH = 6;
const OTP_EXPIRES_MINUTES = 1;
const MAX_OTP_ATTEMPTS = 5;

const getIdentifierType = (identifier) => {
    const value = identifier.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (emailRegex.test(value)) {
        return "EMAIL";
    }
    if (phoneRegex.test(value)) {
        return "PHONE";
    }
    throw new ApiError(
        422,
        "Please provide a valid email address or phone number."
    );
};

const normalizeIdentifier = (identifier, type) => {
    const value = identifier.trim();
    if (type === "EMAIL") {
        return value.toLowerCase();
    }
    return value;
};

const generateOtp = () => {
    const minimum = 10 ** (OTP_LENGTH - 1);
    const maximum = 10 ** OTP_LENGTH;
    return crypto
        .randomInt(minimum, maximum)
        .toString();
};

const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};

const compareOtp = (otp, otpHash) => {
    const hashedOtp = hashOtp(otp);
    return crypto.timingSafeEqual(
        Buffer.from(hashedOtp),
        Buffer.from(otpHash)
    );
};

const sendOtp = async ({
    identifier,
    offersOptIn = true,
}) => {
    const type = getIdentifierType(identifier);
    const normalizedIdentifier =
        normalizeIdentifier(
            identifier,
            type
        );
    let user =
        await userAuthRepository.findUserByIdentifier(
            normalizedIdentifier,
            type
        );
    if (!user) {
        const userData = { offersOptIn, status: "ACTIVE", };
        if (type === "EMAIL") {
            userData.email =
                normalizedIdentifier;
        }
        if (type === "PHONE") {
            userData.phone =
                normalizedIdentifier;
        }
        user = await userAuthRepository.createUser(userData);
    }
    if (user.status === "BLOCKED") {
        throw new ApiError(
            403,
            "Your account has been blocked."
        );
    }
    if (user.status !== "ACTIVE") {
        throw new ApiError(
            403,
            "Your account is inactive."
        );
    }
    await userAuthRepository.invalidatePreviousOtps(
        user.id,
        normalizedIdentifier,
        type
    );
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(
        Date.now() +
        OTP_EXPIRES_MINUTES * 60 * 1000
    );
    await userAuthRepository.createOtp({
        userId: user.id,
        identifier: normalizedIdentifier,
        type,
        otpHash,
        expiresAt,
        attempts: 0,
    });
    if (
        process.env.NODE_ENV === "local" ||
        process.env.NODE_ENV === "development"
    ) {
        console.log(
            `[DEV OTP] ${type}: ${normalizedIdentifier} -> ${otp}`
        );
    }
    return {
        identifier: normalizedIdentifier,
        type,
        expiresIn: OTP_EXPIRES_MINUTES * 60,
        message:
            "If the account is eligible, an OTP has been sent.",
    };
};

// Verify OTP
const verifyOtp = async ({
    identifier,
    otp,
}) => {
    const type = getIdentifierType(identifier);
    const normalizedIdentifier = normalizeIdentifier(
        identifier,
        type
    );
    const user = await userAuthRepository.findUserByIdentifier(
        normalizedIdentifier,
        type
    );
    if (!user) {
        throw new ApiError(
            401,
            "Invalid or expired OTP."
        );
    }
    if (user.status === "BLOCKED") {
        throw new ApiError(
            403,
            "Your account has been blocked."
        );
    }
    if (user.status !== "ACTIVE") {
        throw new ApiError(
            403,
            "Your account is inactive."
        );
    }
    const otpRecord = await userAuthRepository.findLatestValidOtp(
        user.id,
        normalizedIdentifier,
        type
    );
    if (!otpRecord) {
        throw new ApiError(
            401,
            "Invalid or expired OTP."
        );
    }
    if (
        otpRecord.attempts >=
        MAX_OTP_ATTEMPTS
    ) {
        throw new ApiError(
            429,
            "Too many incorrect OTP attempts. Please request a new OTP."
        );
    }
    if (
        new Date() >
        new Date(otpRecord.expiresAt)
    ) {
        throw new ApiError(
            401,
            "OTP has expired. Please request a new OTP."
        );
    }
    let isOtpValid = false;
    try {
        isOtpValid = compareOtp(otp, otpRecord.otpHash);
    } catch (error) {
        isOtpValid = false;
    }
    if (!isOtpValid) {
        await userAuthRepository.incrementOtpAttempts(otpRecord);
        throw new ApiError(
            401,
            "Invalid OTP."
        );
    }
    await userAuthRepository.markOtpAsVerified(otpRecord);
    const verificationData =
        type === "EMAIL"
            ? {
                  isEmailVerified: true,
              }
            : {
                  isPhoneVerified: true,
              };
    await userAuthRepository.updateUser(
        user,
        verificationData
    );
    await userAuthRepository.updateLastLogin(
        user.id
    );
    const accessToken = generateAccessToken({
        id: user.id,
        type: "USER",
    });
    const refreshToken = generateRefreshToken({
        id: user.id,
        type: "USER",
    });
    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            isEmailVerified: type === "EMAIL" ? true : user.isEmailVerified,
            isPhoneVerified: type === "PHONE" ? true : user.isPhoneVerified,
            offersOptIn: user.offersOptIn,
            status: user.status,
            lastLoginAt:
            new Date(),
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};

module.exports = {
    sendOtp,
    verifyOtp,
};