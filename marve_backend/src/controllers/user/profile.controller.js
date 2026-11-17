
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userProfileService } = require("../../services");

const {
  updateUserProfileSchema,
} = require("../../validations/user/profile.validation");

// GET USER PROFILE
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to view your profile."
    );
  }

  const profile = await userProfileService.getUserProfile(userId);

  return ResponseHelper.success(
    res,
    "User profile fetched successfully.",
    profile
  );
});

// UPDATE USER PROFILE
const updateUserProfile = asyncHandler(async (req, res) => {
  const { error, value } = updateUserProfileSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to update your profile."
    );
  }

  const profile = await userProfileService.updateUserProfile(
    userId,
    value
  );

  return ResponseHelper.success(
    res,
    "User profile updated successfully.",
    profile
  );
});

module.exports = {
  getUserProfile,
  updateUserProfile,
};
