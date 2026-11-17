"use strict";

const { User } = require("../../database/models");

// GET USER PROFILE
const getUserProfile = async (userId, options = {}) => {
  return await User.findByPk(userId, {
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "phone",
      "isEmailVerified",
      "isPhoneVerified",
      "offersOptIn",
      "createdAt",
      "updatedAt",
    ],
    ...options,
  });
};

// UPDATE USER PROFILE
const updateUserProfile = async (
  userId,
  profileData,
  options = {}
) => {
  const user = await User.findByPk(userId, options);

  if (!user) {
    return null;
  }

  await user.update(profileData, options);

  return user;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};