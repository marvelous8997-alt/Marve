
"use strict";

const {userProfileRepository} = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// VALIDATE USER ID
const validateUserId = (userId) => {
  if (
    !userId ||
    !/^\d+$/.test(String(userId)) ||
    Number(userId) < 1
  ) {
    throw new ApiError(401, "Authenticated user is required.");
  }

  return Number(userId);
};

// VALIDATE PROFILE DATA
const validateProfileData = (profileData) => {
  if (
    !profileData ||
    typeof profileData !== "object" ||
    Array.isArray(profileData)
  ) {
    throw new ApiError(400, "Invalid profile data.");
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "offersOptIn",
  ];

  const receivedFields = Object.keys(profileData);

  if (receivedFields.length === 0) {
    throw new ApiError(400, "No profile fields provided.");
  }

  const invalidFields = receivedFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new ApiError(
      400,
      `These profile fields cannot be updated: ${invalidFields.join(", ")}.`
    );
  }

  const payload = {};

  // VALIDATE FIRST NAME AND LAST NAME
  for (const field of ["firstName", "lastName"]) {
    if (Object.prototype.hasOwnProperty.call(profileData, field)) {
      if (typeof profileData[field] !== "string") {
        throw new ApiError(
          400,
          `${field} must be a string.`
        );
      }

      const value = profileData[field].trim();

      if (!value) {
        throw new ApiError(
          400,
          `${field} cannot be empty.`
        );
      }

      if (value.length > 100) {
        throw new ApiError(
          400,
          `${field} cannot exceed 100 characters.`
        );
      }

      payload[field] = value;
    }
  }

  // VALIDATE OFFERS OPT-IN
  if (
    Object.prototype.hasOwnProperty.call(
      profileData,
      "offersOptIn"
    )
  ) {
    if (typeof profileData.offersOptIn !== "boolean") {
      throw new ApiError(
        400,
        "offersOptIn must be a boolean."
      );
    }

    payload.offersOptIn = profileData.offersOptIn;
  }

  return payload;
};

// GET USER PROFILE
const getUserProfile = async (userId) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const user = await userProfileRepository.getUserProfile(
      authenticatedUserId
    );

    if (!user) {
      throw new ApiError(404, "User profile not found.");
    }

    return user.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// UPDATE USER PROFILE
const updateUserProfile = async (userId, profileData) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const payload = validateProfileData(profileData);

    const user = await userProfileRepository.updateUserProfile(
      authenticatedUserId,
      payload
    );

    if (!user) {
      throw new ApiError(404, "User profile not found.");
    }

    const updatedProfile =
      await userProfileRepository.getUserProfile(
        authenticatedUserId
      );

    if (!updatedProfile) {
      throw new ApiError(404, "User profile not found.");
    }

    logger.info(
      `User profile updated successfully. ID: ${authenticatedUserId}`
    );

    return updatedProfile.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
