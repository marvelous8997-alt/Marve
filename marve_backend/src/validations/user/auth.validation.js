"use strict";

const Joi = require("joi");
const phoneRegex = /^\+?[1-9]\d{9,14}$/;

const emailSchema = Joi.string()
  .trim()
  .email({
    tlds: { allow: false },
  })
  .lowercase()
  .messages({
    "string.email": "Please provide a valid email address.",
  });

const phoneSchema = Joi.string()
  .trim()
  .pattern(phoneRegex)
  .messages({
    "string.pattern.base": "Please provide a valid phone number.",
  });

const identifier = Joi.alternatives()
  .try(emailSchema, phoneSchema)
  .required()
  .messages({
    "any.required": "Email or phone number is required.",
    "alternatives.match":
      "Please provide a valid email address or phone number.",
  });

const sendOtpSchema = Joi.object({
  identifier,
  offersOptIn: Joi.boolean().optional().default(true),
}).required();

const verifyOtpSchema = Joi.object({
  identifier,
  otp: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "any.required": "OTP is required.",
      "string.empty": "OTP is required.",
      "string.length": "OTP must be exactly 6 digits.",
      "string.pattern.base": "OTP must contain only numbers.",
    }),
}).required();

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
};
