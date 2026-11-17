"use strict";

const { User, UserOtp } = require("../../database/models");
const { Op } = require("sequelize");

// Find user by email
const findUserByEmail = async (email) => {
    return await User.findOne({
        where: {
            email,
        },
    });
};

// Find user by phone
const findUserByPhone = async (phone) => {
    return await User.findOne({
        where: {
            phone,
        },
    });
};

// Find user by identifier
const findUserByIdentifier = async (identifier, type) => {
    const where =
        type === "EMAIL"
            ? { email: identifier }
            : { phone: identifier };

    return await User.findOne({
        where,
    });
};

// Create a new customer user
const createUser = async (data) => {
    return await User.create(data);
};

// Update existing customer user
const updateUser = async (user, data) => {
    return await user.update(data);
};

// Update user's last login time
const updateLastLogin = async (userId) => {
    return await User.update(
        {
            lastLoginAt: new Date(),
        },
        {
            where: {
                id: userId,
            },
        }
    );
};

// Create OTP record
const createOtp = async (data) => {
    return await UserOtp.create(data);
};

// Find latest active OTP
const findLatestOtp = async (userId, identifier, type) => {
    return await UserOtp.findOne({
        where: {
            userId,
            identifier,
            type,
            verifiedAt: null,
        },
        order: [
            ["createdAt", "DESC"],
        ],
    });
};


/**
 * Find latest OTP for verification
 */
const findLatestValidOtp = async (
    userId,
    identifier,
    type
) => {
    return UserOtp.findOne({
        where: {
            userId,
            identifier,
            type,
            verifiedAt: null,
            expiresAt: {
                [Op.gt]: new Date(),
            },
        },
        order: [["createdAt", "DESC"]],
    });
};


/**
 * Update OTP record
 */
const updateOtp = async (otp, data) => {
    return await otp.update(data);
};


/**
 * Invalidate all previous unverified OTPs
 */
const invalidatePreviousOtps = async (
    userId,
    identifier,
    type
) => {
    return await UserOtp.update(
        {
            verifiedAt: new Date(),
        },
        {
            where: {
                userId,
                identifier,
                type,
                verifiedAt: null,
            },
        }
    );
};


/**
 * Mark OTP as verified
 */
const markOtpAsVerified = async (otp) => {
    return await otp.update({
        verifiedAt: new Date(),
    });
};


/**
 * Increment OTP attempts
 */
const incrementOtpAttempts = async (otp) => {
    return await otp.increment("attempts");
};


module.exports = {
    findUserByEmail,
    findUserByPhone,
    findUserByIdentifier,
    createUser,
    updateUser,
    updateLastLogin,

    createOtp,
    findLatestOtp,
    findLatestValidOtp,
    updateOtp,
    invalidatePreviousOtps,
    markOtpAsVerified,
    incrementOtpAttempts,
};