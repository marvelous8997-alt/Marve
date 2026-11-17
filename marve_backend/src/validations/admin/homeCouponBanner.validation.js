
"use strict";

const Joi = require("joi");

/* =========================
   SAVE HOME COUPON BANNER
========================= */

const saveHomeCouponBannerSchema = Joi.object({
  type: Joi.string()
    .valid("HOME_COUPON")
    .optional()
    .messages({
      "any.only": "Banner type must be HOME_COUPON.",
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

  offer_text: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Offer text is required.",
      "string.min": "Offer text is required.",
      "string.max": "Offer text must not exceed 255 characters.",
      "any.required": "Offer text is required.",
    }),

  discount_value: Joi.number()
    .greater(0)
    .required()
    .messages({
      "number.base": "Discount value must be a valid number.",
      "number.greater": "Discount value must be greater than zero.",
      "any.required": "Discount value is required.",
    }),

  discount_type: Joi.string()
    .valid("PERCENTAGE", "FIXED")
    .default("PERCENTAGE")
    .required()
    .messages({
      "any.only": "Discount type must be PERCENTAGE or FIXED.",
      "any.required": "Discount type is required.",
    }),

  coupon_code: Joi.string()
    .trim()
    .uppercase()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Coupon code is required.",
      "string.min": "Coupon code is required.",
      "string.max": "Coupon code must not exceed 100 characters.",
      "any.required": "Coupon code is required.",
    }),

  terms_text: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "string.empty": "Terms and conditions text is required.",
      "string.min": "Terms and conditions text is required.",
      "any.required": "Terms and conditions text is required.",
    }),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .default("ACTIVE")
    .messages({
      "any.only": "Status must be ACTIVE or INACTIVE.",
    }),
})
  // Percentage discounts must be between 0 and 100.
  .custom((value, helpers) => {
    if (
      value.discount_type === "PERCENTAGE" &&
      value.discount_value > 100
    ) {
      return helpers.error("discount.percentage");
    }

    return value;
  })
  .messages({
    "discount.percentage":
      "Percentage discount cannot exceed 100.",
    "object.unknown": "{{#label}} is not an allowed field.",
  })
  .unknown(false);

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateHomeCouponBannerStatusSchema = Joi.object({
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
  saveHomeCouponBannerSchema,
  updateHomeCouponBannerStatusSchema,
};
