
"use strict";

const Joi = require("joi");

const createInquirySchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "any.required": "First name is required.",
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name cannot exceed 100 characters.",
    }),

  lastName: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages({
      "string.max": "Last name cannot exceed 100 characters.",
    }),

  email: Joi.string()
    .trim()
    .email({
      tlds: { allow: false },
    })
    .lowercase()
    .max(255)
    .required()
    .messages({
      "any.required": "Email address is required.",
      "string.empty": "Email address is required.",
      "string.email": "Please provide a valid email address.",
      "string.max": "Email address cannot exceed 255 characters.",
    }),

  phone: Joi.string()
    .trim()
    .max(30)
    .allow("")
    .optional()
    .messages({
      "string.max": "Phone number cannot exceed 30 characters.",
    }),

  subject: Joi.string()
    .trim()
    .uppercase()
    .valid("ORDER", "PRODUCT", "DELIVERY", "RETURN", "OTHER")
    .required()
    .messages({
      "any.required": "Inquiry subject is required.",
      "string.empty": "Inquiry subject is required.",
      "any.only": "Please select a valid inquiry subject.",
    }),

  message: Joi.string()
    .trim()
    .min(10)
    .max(5000)
    .required()
    .messages({
      "any.required": "Message is required.",
      "string.empty": "Message is required.",
      "string.min": "Message must be at least 10 characters long.",
      "string.max": "Message cannot exceed 5000 characters.",
    }),
})
  .required()
  .unknown(false);

  const inquiryIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Inquiry ID must be a number.",
      "number.integer": "Inquiry ID must be an integer.",
      "number.positive": "Inquiry ID must be greater than zero.",
      "any.required": "Inquiry ID is required.",
    }),
}).required();

module.exports = {
  createInquirySchema,
  inquiryIdSchema
};
