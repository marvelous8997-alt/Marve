
"use strict";

const Joi = require("joi");

/* =========================
   SAVE HOME HERO BANNER
========================= */

const saveHomeHeroBannerSchema = Joi.object({
  type: Joi.string()
    .valid("HOME_HERO")
    .optional()
    .messages({
      "any.only": "Banner type must be HOME_HERO.",
    }),

  eyebrow: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Eyebrow text is required.",
      "string.min": "Eyebrow text is required.",
      "string.max": "Eyebrow text must not exceed 255 characters.",
      "any.required": "Eyebrow text is required.",
    }),

  heading: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Heading is required.",
      "string.min": "Heading is required.",
      "string.max": "Heading must not exceed 255 characters.",
      "any.required": "Heading is required.",
    }),

  highlighted_heading: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Highlighted heading is required.",
      "string.min": "Highlighted heading is required.",
      "string.max":
        "Highlighted heading must not exceed 255 characters.",
      "any.required": "Highlighted heading is required.",
    }),

  description: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .messages({
      "string.empty": "Description is required.",
      "string.min": "Description is required.",
      "string.max": "Description must not exceed 5000 characters.",
      "any.required": "Description is required.",
    }),

  button_text: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Button text is required.",
      "string.min": "Button text is required.",
      "string.max": "Button text must not exceed 100 characters.",
      "any.required": "Button text is required.",
    }),

  button_link: Joi.string()
    .trim()
    .min(1)
    .max(2048)
    .required()
    .messages({
      "string.empty": "Button link is required.",
      "string.min": "Button link is required.",
      "string.max": "Button link must not exceed 2048 characters.",
      "any.required": "Button link is required.",
    }),

  bottom_label: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Bottom label is required.",
      "string.min": "Bottom label is required.",
      "string.max": "Bottom label must not exceed 255 characters.",
      "any.required": "Bottom label is required.",
    }),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .default("ACTIVE")
    .messages({
      "any.only": "Status must be ACTIVE or INACTIVE.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "{{#label}} is not an allowed field.",
  });

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateHomeHeroBannerStatusSchema = Joi.object({
  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .required()
    .messages({
      "string.empty": "Status is required.",
      "any.only": "Status must be ACTIVE or INACTIVE.",
      "any.required": "Status is required.",
    }),
}).unknown(false);

module.exports = {
  saveHomeHeroBannerSchema,
  updateHomeHeroBannerStatusSchema,
};
