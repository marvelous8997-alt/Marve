
"use strict";

const Joi = require("joi");

// COMMON USER PROFILE FIELDS
const userProfileFields = {
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .messages({
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 1 character long.",
      "string.max": "First name cannot exceed 100 characters.",
      "string.base": "First name must be a string.",
    }),

  lastName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .messages({
      "string.empty": "Last name is required.",
      "string.min": "Last name must be at least 1 character long.",
      "string.max": "Last name cannot exceed 100 characters.",
      "string.base": "Last name must be a string.",
    }),

  offersOptIn: Joi.boolean()
    .messages({
      "boolean.base": "Offers preference must be true or false.",
    }),
};

// UPDATE USER PROFILE
const updateUserProfileSchema = Joi.object({
  firstName: userProfileFields.firstName.optional(),
  lastName: userProfileFields.lastName.optional(),
  offersOptIn: userProfileFields.offersOptIn.optional(),
})
  .required()
  .min(1)
  .unknown(false);

module.exports = {
  updateUserProfileSchema,
};
