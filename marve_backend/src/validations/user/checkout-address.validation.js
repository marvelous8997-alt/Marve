
"use strict";

const Joi = require("joi");

// COMMON CHECKOUT ADDRESS FIELDS
const checkoutAddressFields = {
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .messages({
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 2 characters long.",
      "string.max": "Full name cannot exceed 150 characters.",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9\s()-]{10,20}$/)
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Please provide a valid phone number.",
    }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .lowercase()
    .max(191)
    .allow(null, "")
    .optional()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.max": "Email address cannot exceed 191 characters.",
    }),

  pincode: Joi.string()
    .trim()
    .pattern(/^[0-9]{6}$/)
    .messages({
      "string.empty": "Pincode is required.",
      "string.pattern.base": "Pincode must contain exactly 6 digits.",
    }),

  houseNumber: Joi.string()
    .trim()
    .min(1)
    .max(150)
    .messages({
      "string.empty": "House number is required.",
      "string.max": "House number cannot exceed 150 characters.",
    }),

  address: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .messages({
      "string.empty": "Address is required.",
      "string.max": "Address cannot exceed 255 characters.",
    }),

  locality: Joi.string()
    .trim()
    .min(1)
    .max(150)
    .messages({
      "string.empty": "Locality is required.",
      "string.max": "Locality cannot exceed 150 characters.",
    }),

  landmark: Joi.string()
    .trim()
    .max(150)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Landmark cannot exceed 150 characters.",
    }),

  city: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .messages({
      "string.empty": "City is required.",
      "string.max": "City cannot exceed 100 characters.",
    }),

  state: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .messages({
      "string.empty": "State is required.",
      "string.max": "State cannot exceed 100 characters.",
    }),

  addressType: Joi.string()
    .trim()
    .uppercase()
    .valid("HOME", "FRIENDS", "WORK", "OTHER")
    .default("HOME")
    .messages({
      "any.only": "Please select a valid address type.",
    }),

  isDefault: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": "Default address must be true or false.",
    }),

  latitude: Joi.number()
    .min(-90)
    .max(90)
    .allow(null)
    .optional()
    .messages({
      "number.base": "Latitude must be a number.",
      "number.min": "Latitude cannot be less than -90.",
      "number.max": "Latitude cannot exceed 90.",
    }),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .allow(null)
    .optional()
    .messages({
      "number.base": "Longitude must be a number.",
      "number.min": "Longitude cannot be less than -180.",
      "number.max": "Longitude cannot exceed 180.",
    }),
};

// CREATE CHECKOUT ADDRESS
const createCheckoutAddressSchema = Joi.object({
  ...checkoutAddressFields,

  fullName: checkoutAddressFields.fullName.required(),
  phone: checkoutAddressFields.phone.required(),
  pincode: checkoutAddressFields.pincode.required(),
  houseNumber: checkoutAddressFields.houseNumber.required(),
  address: checkoutAddressFields.address.required(),
  locality: checkoutAddressFields.locality.required(),
  city: checkoutAddressFields.city.required(),
  state: checkoutAddressFields.state.required(),
})
  .required()
  .unknown(false);

// UPDATE CHECKOUT ADDRESS
const updateCheckoutAddressSchema = Joi.object({
  fullName: checkoutAddressFields.fullName.optional(),
  phone: checkoutAddressFields.phone.optional(),
  email: checkoutAddressFields.email,
  pincode: checkoutAddressFields.pincode.optional(),
  houseNumber: checkoutAddressFields.houseNumber.optional(),
  address: checkoutAddressFields.address.optional(),
  locality: checkoutAddressFields.locality.optional(),
  landmark: checkoutAddressFields.landmark,
  city: checkoutAddressFields.city.optional(),
  state: checkoutAddressFields.state.optional(),
  addressType: checkoutAddressFields.addressType.optional(),
  isDefault: checkoutAddressFields.isDefault.optional(),
  latitude: checkoutAddressFields.latitude,
  longitude: checkoutAddressFields.longitude,
})
  .required()
  .min(1)
  .unknown(false);

// CHECKOUT ADDRESS ID
const checkoutAddressIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Checkout address ID must be a number.",
      "number.integer": "Checkout address ID must be an integer.",
      "number.positive": "Checkout address ID must be greater than zero.",
      "any.required": "Checkout address ID is required.",
    }),
})
  .required()
  .unknown(false);

module.exports = {
  createCheckoutAddressSchema,
  updateCheckoutAddressSchema,
  checkoutAddressIdSchema,
};
