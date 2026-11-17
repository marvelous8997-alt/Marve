
"use strict";

const Joi = require("joi");

// ======================== SHARED FIELDS ========================

const couponCodeSchema = Joi.string()
  .trim()
  .uppercase()
  .pattern(/^[A-Z0-9_-]+$/)
  .min(2)
  .max(50)
  .messages({
    "string.empty": "Coupon code is required.",
    "string.min": "Coupon code must be at least 2 characters.",
    "string.max": "Coupon code must not exceed 50 characters.",
    "string.pattern.base":
      "Coupon code may contain only letters, numbers, hyphens and underscores.",
  });

const couponNameSchema = Joi.string()
  .trim()
  .min(2)
  .max(150)
  .messages({
    "string.empty": "Coupon name is required.",
    "string.min": "Coupon name must be at least 2 characters.",
    "string.max": "Coupon name must not exceed 150 characters.",
  });

const descriptionSchema = Joi.string()
  .trim()
  .allow("")
  .max(5000)
  .messages({
    "string.max": "Description must not exceed 5000 characters.",
  });

const discountTypeSchema = Joi.string()
  .valid("PERCENTAGE", "FIXED")
  .messages({
    "any.only": "Discount type must be PERCENTAGE or FIXED.",
  });

const discountValueSchema = Joi.number()
  .positive()
  .precision(2)
  .required()
  .messages({
    "number.base": "Discount value must be a number.",
    "number.positive": "Discount value must be greater than zero.",
    "number.precision": "Discount value may have at most 2 decimal places.",
    "any.required": "Discount value is required.",
  });

const maximumDiscountSchema = Joi.number()
  .positive()
  .precision(2)
  .allow(null, "")
  .messages({
    "number.base": "Maximum discount must be a number.",
    "number.positive": "Maximum discount must be greater than zero.",
    "number.precision":
      "Maximum discount may have at most 2 decimal places.",
  });

const minimumOrderValueSchema = Joi.number()
  .min(0)
  .precision(2)
  .allow(null, "")
  .messages({
    "number.base": "Minimum order value must be a number.",
    "number.min": "Minimum order value cannot be negative.",
    "number.precision":
      "Minimum order value may have at most 2 decimal places.",
  });

const usageLimitSchema = Joi.number()
  .integer()
  .min(1)
  .allow(null, "")
  .messages({
    "number.base": "Usage limit must be a number.",
    "number.integer": "Usage limit must be a whole number.",
    "number.min": "Usage limit must be at least 1.",
  });

const perCustomerLimitSchema = Joi.number()
  .integer()
  .min(1)
  .allow(null, "")
  .messages({
    "number.base": "Per-customer limit must be a number.",
    "number.integer": "Per-customer limit must be a whole number.",
    "number.min": "Per-customer limit must be at least 1.",
  });

const dateSchema = Joi.date()
  .iso()
  .required()
  .messages({
    "date.base": "Please provide a valid date and time.",
    "date.format": "Please provide a valid ISO date and time.",
    "any.required": "Coupon date is required.",
  });

const statusSchema = Joi.string()
  .valid("ACTIVE", "INACTIVE")
  .messages({
    "any.only": "Status must be ACTIVE or INACTIVE.",
  });

const sortOrderSchema = Joi.number()
  .integer()
  .min(0)
  .messages({
    "number.base": "Sort order must be a number.",
    "number.integer": "Sort order must be an integer.",
    "number.min": "Sort order cannot be negative.",
  });

// ======================== CREATE DISCOUNT COUPON ========================

const createDiscountCouponSchema = Joi.object({
  code: couponCodeSchema.required().messages({
    "any.required": "Coupon code is required.",
  }),

  name: couponNameSchema.required().messages({
    "any.required": "Coupon name is required.",
  }),

  description: descriptionSchema.optional(),

  discount_type: discountTypeSchema.required().messages({
    "any.required": "Discount type is required.",
  }),

  discount_value: discountValueSchema,

  maximum_discount: maximumDiscountSchema.optional(),

  minimum_order_value: minimumOrderValueSchema.optional(),

  usage_limit: usageLimitSchema.optional(),

  per_customer_limit: perCustomerLimitSchema.optional(),

  start_date: dateSchema,

  end_date: dateSchema,

  status: statusSchema.default("ACTIVE"),

  sort_order: sortOrderSchema.default(0),
})
  .custom((value, helpers) => {
    if (
      value.discount_type === "PERCENTAGE" &&
      Number(value.discount_value) > 100
    ) {
      return helpers.error("coupon.percentageLimit");
    }

    if (
      value.discount_type === "FIXED" &&
      value.maximum_discount != null &&
      value.maximum_discount !== ""
    ) {
      return helpers.error("coupon.fixedMaximumDiscount");
    }

    if (
      value.start_date &&
      value.end_date &&
      new Date(value.end_date).getTime() <=
        new Date(value.start_date).getTime()
    ) {
      return helpers.error("coupon.invalidDateRange");
    }

    return value;
  })
  .messages({
    "coupon.percentageLimit":
      "Percentage discount cannot exceed 100.",
    "coupon.fixedMaximumDiscount":
      "Maximum discount is only applicable to percentage coupons.",
    "coupon.invalidDateRange":
      "Coupon end date must be later than its start date.",
  })
  .unknown(false);

// ======================== UPDATE DISCOUNT COUPON ========================

const updateDiscountCouponSchema = Joi.object({
  code: couponCodeSchema.optional(),

  name: couponNameSchema.optional(),

  description: descriptionSchema.optional(),

  discount_type: discountTypeSchema.optional(),

  discount_value: discountValueSchema.optional(),

  maximum_discount: maximumDiscountSchema.optional(),

  minimum_order_value: minimumOrderValueSchema.optional(),

  usage_limit: usageLimitSchema.optional(),

  per_customer_limit: perCustomerLimitSchema.optional(),

  start_date: dateSchema.optional(),

  end_date: dateSchema.optional(),

  status: statusSchema.optional(),

  sort_order: sortOrderSchema.optional(),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min":
      "At least one field is required to update a discount coupon.",
  });

// ======================== UPDATE STATUS ========================

const updateDiscountCouponStatusSchema = Joi.object({
  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .required()
    .messages({
      "any.only": "Status must be ACTIVE or INACTIVE.",
      "any.required": "Coupon status is required.",
    }),
}).unknown(false);

module.exports = {
  createDiscountCouponSchema,
  updateDiscountCouponSchema,
  updateDiscountCouponStatusSchema,
};
