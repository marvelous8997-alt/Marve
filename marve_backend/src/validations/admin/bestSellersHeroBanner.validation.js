
"use strict";

const Joi = require("joi");

/* =========================
   SAVE BEST SELLERS HERO BANNER
========================= */

const saveBestSellersHeroBannerSchema = Joi.object({
  type: Joi.string()
    .valid("BEST_SELLERS_HERO")
    .optional()
    .messages({
      "any.only": "Banner type must be BEST_SELLERS_HERO.",
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

  rating_text: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Rating text is required.",
      "string.min": "Rating text is required.",
      "string.max": "Rating text must not exceed 255 characters.",
      "any.required": "Rating text is required.",
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

  floating_label: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Floating label is required.",
      "string.min": "Floating label is required.",
      "string.max":
        "Floating label must not exceed 255 characters.",
      "any.required": "Floating label is required.",
    }),

  floating_title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Floating title is required.",
      "string.min": "Floating title is required.",
      "string.max":
        "Floating title must not exceed 255 characters.",
      "any.required": "Floating title is required.",
    }),

  floating_description: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .messages({
      "string.empty": "Floating description is required.",
      "string.min": "Floating description is required.",
      "string.max":
        "Floating description must not exceed 5000 characters.",
      "any.required": "Floating description is required.",
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
  .messages({
    "object.unknown": "{{#label}} is not an allowed field.",
  })
  .unknown(false);

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateBestSellersHeroBannerStatusSchema = Joi.object({
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
  saveBestSellersHeroBannerSchema,
  updateBestSellersHeroBannerStatusSchema,
};
