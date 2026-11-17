
"use strict";

const Joi = require("joi");

// ======================== SHARED FIELDS ========================

const couponCodeSchema = Joi.string()
  .trim()
  .uppercase()
  .pattern(/^[A-Z0-9_-]+$/)
  .min(2)
  .max(100)
  .messages({
    "string.empty": "BOGO coupon code is required.",
    "string.min": "Coupon code must be at least 2 characters.",
    "string.max": "Coupon code must not exceed 100 characters.",
    "string.pattern.base":
      "Coupon code may contain only letters, numbers, hyphens and underscores.",
    "any.required": "BOGO coupon code is required.",
  });

const couponNameSchema = Joi.string()
  .trim()
  .min(2)
  .max(255)
  .messages({
    "string.empty": "BOGO coupon name is required.",
    "string.min": "Coupon name must be at least 2 characters.",
    "string.max": "Coupon name must not exceed 255 characters.",
    "any.required": "BOGO coupon name is required.",
  });

const descriptionSchema = Joi.string()
  .trim()
  .allow("", null)
  .max(5000)
  .messages({
    "string.max": "Description must not exceed 5000 characters.",
  });

const quantitySchema = Joi.number()
  .integer()
  .min(1)
  .max(2147483647)
  .required()
  .messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be a whole number.",
    "number.min": "Quantity must be at least 1.",
    "number.max": "Quantity exceeds the allowed limit.",
    "any.required": "Quantity is required.",
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
  .max(2147483647)
  .allow(null, "")
  .messages({
    "number.base": "Usage limit must be a number.",
    "number.integer": "Usage limit must be a whole number.",
    "number.min": "Usage limit must be at least 1.",
    "number.max": "Usage limit exceeds the allowed limit.",
  });

const perCustomerLimitSchema = Joi.number()
  .integer()
  .min(1)
  .max(2147483647)
  .allow(null, "")
  .messages({
    "number.base": "Per-customer limit must be a number.",
    "number.integer": "Per-customer limit must be a whole number.",
    "number.min": "Per-customer limit must be at least 1.",
    "number.max": "Per-customer limit exceeds the allowed limit.",
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
  .max(2147483647)
  .messages({
    "number.base": "Sort order must be a number.",
    "number.integer": "Sort order must be a whole number.",
    "number.min": "Sort order cannot be negative.",
    "number.max": "Sort order exceeds the allowed limit.",
  });

// Product IDs must be unique positive integers.
const productIdsSchema = Joi.array()
  .items(
    Joi.number()
      .integer()
      .positive()
      .max(Number.MAX_SAFE_INTEGER)
      .required()
  )
  .min(1)
  .unique()
  .required()
  .messages({
    "array.base": "Product IDs must be an array.",
    "array.min": "Select at least one product.",
    "array.unique": "Duplicate product IDs are not allowed.",
    "any.required": "Product IDs are required.",
    "number.base": "Product ID must be a number.",
    "number.integer": "Product ID must be a whole number.",
    "number.positive": "Product ID must be greater than zero.",
  });

// ======================== CREATE BOGO COUPON ========================

const createBogoCouponSchema = Joi.object({
  code: couponCodeSchema.required(),

  name: couponNameSchema.required(),

  description: descriptionSchema.optional(),

  buy_quantity: quantitySchema,

  get_quantity: quantitySchema,

  minimum_order_value: minimumOrderValueSchema.default(0),

  usage_limit: usageLimitSchema.optional().allow(null),

  per_customer_limit: perCustomerLimitSchema.optional().allow(null),

  start_date: dateSchema,

  end_date: dateSchema,

  status: statusSchema.default("ACTIVE"),

  sort_order: sortOrderSchema.default(0),

  buy_product_ids: productIdsSchema,

  get_product_ids: productIdsSchema,
})
  .custom((value, helpers) => {
    if (
      value.start_date &&
      value.end_date &&
      new Date(value.end_date).getTime() <=
        new Date(value.start_date).getTime()
    ) {
      return helpers.error("bogo.invalidDateRange");
    }

    return value;
  })
  .messages({
    "bogo.invalidDateRange":
      "BOGO coupon end date must be later than its start date.",
  })
  .unknown(false);

// ======================== UPDATE BOGO COUPON ========================

const updateBogoCouponSchema = Joi.object({
  code: couponCodeSchema.optional(),

  name: couponNameSchema.optional(),

  description: descriptionSchema.optional(),

  buy_quantity: quantitySchema.optional(),

  get_quantity: quantitySchema.optional(),

  minimum_order_value: minimumOrderValueSchema.optional(),

  usage_limit: usageLimitSchema.optional().allow(null),

  per_customer_limit: perCustomerLimitSchema.optional().allow(null),

  start_date: dateSchema.optional(),

  end_date: dateSchema.optional(),

  status: statusSchema.optional(),

  sort_order: sortOrderSchema.optional(),

  buy_product_ids: productIdsSchema.optional(),

  get_product_ids: productIdsSchema.optional(),
})
  .min(1)
  .custom((value, helpers) => {
    if (
      value.start_date &&
      value.end_date &&
      new Date(value.end_date).getTime() <=
        new Date(value.start_date).getTime()
    ) {
      return helpers.error("bogo.invalidDateRange");
    }

    return value;
  })
  .messages({
    "object.min":
      "At least one field is required to update a BOGO coupon.",
    "bogo.invalidDateRange":
      "BOGO coupon end date must be later than its start date.",
  })
  .unknown(false);

// ======================== UPDATE STATUS ========================

const updateBogoCouponStatusSchema = Joi.object({
  status: statusSchema.required().messages({
    "any.required": "BOGO coupon status is required.",
  }),
}).unknown(false);

module.exports = {
  createBogoCouponSchema,
  updateBogoCouponSchema,
  updateBogoCouponStatusSchema,
};
