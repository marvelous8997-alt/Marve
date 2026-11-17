"use strict";

const Joi = require("joi");

const productFields = {
  name: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .messages({
      "string.empty": "Product name is required.",
      "string.min": "Product name is required.",
      "string.max": "Product name cannot exceed 255 characters.",
      "any.required": "Product name is required.",
    }),

  slug: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .messages({
      "string.empty": "Product slug is required.",
      "string.min": "Product slug is required.",
      "string.max": "Product slug cannot exceed 255 characters.",
      "any.required": "Product slug is required.",
    }),

  category_id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "Please select a valid category.",
      "number.integer": "Category ID must be an integer.",
      "number.positive": "Please select a valid category.",
    }),

  subcategory_id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "Please select a valid subcategory.",
      "number.integer": "Subcategory ID must be an integer.",
      "number.positive": "Please select a valid subcategory.",
    }),

  description: Joi.string()
    .trim()
    .max(10000)
    .allow("", null)
    .messages({
      "string.max": "Product description cannot exceed 10000 characters.",
    }),

  sku: Joi.string()
    .trim()
    .max(100)
    .allow("", null)
    .messages({
      "string.max": "SKU cannot exceed 100 characters.",
    }),

  short_description: Joi.string()
    .trim()
    .max(1000)
    .allow("", null)
    .messages({
      "string.max": "Short description cannot exceed 1000 characters.",
    }),

  price: Joi.number()
    .min(0)
    .messages({
      "number.base": "Product price must be a valid number.",
      "number.min": "Product price cannot be negative.",
    }),

  compare_at_price: Joi.alternatives()
    .try(
      Joi.number().min(0),
      Joi.string().valid(""),
      Joi.valid(null)
    )
    .messages({
      "alternatives.match":
        "Compare-at price must be a valid non-negative number.",
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "Stock must be a number.",
      "number.integer": "Stock must be an integer.",
      "number.min": "Stock cannot be negative.",
    }),

  // Product dimensions
  height: Joi.alternatives()
    .try(
      Joi.number().min(0),
      Joi.string().valid(""),
      Joi.valid(null)
    )
    .messages({
      "alternatives.match":
        "Product height must be a valid non-negative number.",
    }),

  width: Joi.alternatives()
    .try(
      Joi.number().min(0),
      Joi.string().valid(""),
      Joi.valid(null)
    )
    .messages({
      "alternatives.match":
        "Product width must be a valid non-negative number.",
    }),

  length: Joi.alternatives()
    .try(
      Joi.number().min(0),
      Joi.string().valid(""),
      Joi.valid(null)
    )
    .messages({
      "alternatives.match":
        "Product length must be a valid non-negative number.",
    }),

  // Product weight
  weight: Joi.alternatives()
    .try(
      Joi.number().min(0),
      Joi.string().valid(""),
      Joi.valid(null)
    )
    .messages({
      "alternatives.match":
        "Product weight must be a valid non-negative number.",
    }),

  // Dimension unit
  dimension_unit: Joi.string()
    .trim()
    .lowercase()
    .valid("mm", "cm", "m", "in", "ft")
    .messages({
      "string.base": "Dimension unit must be a string.",
      "any.only":
        "Dimension unit must be mm, cm, m, in, or ft.",
    }),

  // Weight unit
  weight_unit: Joi.string()
    .trim()
    .lowercase()
    .valid("g", "kg", "mg", "lb", "oz")
    .messages({
      "string.base": "Weight unit must be a string.",
      "any.only":
        "Weight unit must be g, kg, mg, lb, or oz.",
    }),

  sort_order: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "Sort order must be a number.",
      "number.integer": "Sort order must be an integer.",
      "number.min": "Sort order cannot be negative.",
    }),

  status: Joi.string()
    .trim()
    .uppercase()
    .valid("ACTIVE", "INACTIVE")
    .messages({
      "any.only": "Status must be ACTIVE or INACTIVE.",
    }),

  featured: Joi.boolean().empty(""),
  is_new_arrival: Joi.boolean().empty(""),
  is_bestseller: Joi.boolean().empty(""),
  is_sale: Joi.boolean().empty(""),
  is_offer: Joi.boolean().empty(""),
  is_gift: Joi.boolean().empty(""),

  image_manifest: Joi.string()
    .max(50000)
    .optional()
    .messages({
      "string.max": "Image metadata is too large.",
    }),
};

const createProductSchema = Joi.object({
  ...productFields,

  name: productFields.name.required(),
  slug: productFields.slug.required(),
  category_id: productFields.category_id.required(),
  subcategory_id: productFields.subcategory_id.required(),
  price: productFields.price.required(),

  stock: productFields.stock.default(0),
  sort_order: productFields.sort_order.default(0),
  status: productFields.status.default("ACTIVE"),

  featured: productFields.featured.default(false),
  is_new_arrival: productFields.is_new_arrival.default(false),
  is_bestseller: productFields.is_bestseller.default(false),
  is_sale: productFields.is_sale.default(false),
  is_offer: productFields.is_offer.default(false),
  is_gift: productFields.is_gift.default(false),
}).unknown(false);

const updateProductSchema = Joi.object({
  ...productFields,
}).unknown(false);

const updateProductStatusSchema = Joi.object({
  status: Joi.string()
    .trim()
    .uppercase()
    .valid("ACTIVE", "INACTIVE")
    .required()
    .messages({
      "string.empty": "Product status is required.",
      "any.only": "Status must be ACTIVE or INACTIVE.",
      "any.required": "Product status is required.",
    }),
}).unknown(false);

module.exports = {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
};