
"use strict";

const Joi = require("joi");

const productVariationFields = {
  product_id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "Please select a valid product.",
      "number.integer": "Product ID must be an integer.",
      "number.positive": "Please select a valid product.",
    }),

  name: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .messages({
      "string.empty": "Variation name is required.",
      "string.min": "Variation name is required.",
      "string.max": "Variation name cannot exceed 255 characters.",
      "any.required": "Variation name is required.",
    }),

  sku: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .messages({
      "string.empty": "Variation SKU is required.",
      "string.min": "Variation SKU is required.",
      "string.max": "SKU cannot exceed 100 characters.",
      "any.required": "Variation SKU is required.",
    }),

  attributes: Joi.object()
    .pattern(
      Joi.string().trim().min(1).max(100),
      Joi.alternatives().try(
        Joi.string().trim().min(1).max(255),
        Joi.number(),
        Joi.boolean()
      )
    )
    .max(50)
    .messages({
      "object.base": "Variation attributes must be a valid object.",
      "object.max": "A maximum of 50 variation attributes is allowed.",
      "string.empty": "Attribute values cannot be empty.",
      "string.min": "Attribute values cannot be empty.",
      "string.max": "Attribute values cannot exceed 255 characters.",
    }),

  price: Joi.number()
    .min(0)
    .messages({
      "number.base": "Variation price must be a valid number.",
      "number.min": "Variation price cannot be negative.",
      "any.required": "Variation price is required.",
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
};

const createProductVariationSchema = Joi.object({
  ...productVariationFields,

  product_id: productVariationFields.product_id.required(),

  name: productVariationFields.name.required(),

  sku: productVariationFields.sku.required(),

  attributes: productVariationFields.attributes.default({}),

  price: productVariationFields.price.required(),

  compare_at_price: productVariationFields.compare_at_price
    .optional()
    .allow(null),

  stock: productVariationFields.stock.default(0),

  sort_order: productVariationFields.sort_order.default(0),

  status: productVariationFields.status.default("ACTIVE"),
}).unknown(false);

const updateProductVariationSchema = Joi.object({
  ...productVariationFields,
}).unknown(false);

const updateProductVariationStatusSchema = Joi.object({
  status: Joi.string()
    .trim()
    .uppercase()
    .valid("ACTIVE", "INACTIVE")
    .required()
    .messages({
      "string.empty": "Variation status is required.",
      "any.only": "Status must be ACTIVE or INACTIVE.",
      "any.required": "Variation status is required.",
    }),
}).unknown(false);


const bulkCreateProductVariationsSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),

  variations: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().max(255).required(),
        sku: Joi.string().trim().max(100).required(),

        attributes: Joi.object()
          .pattern(
            Joi.string().trim().min(1),
            Joi.alternatives().try(
              Joi.string().trim().min(1),
              Joi.number(),
              Joi.boolean()
            )
          )
          .min(1)
          .required(),

        price: Joi.number().min(0).max(99999999.99).precision(2).required(),

        compare_at_price: Joi.alternatives()
          .try(
            Joi.number().min(0).max(99999999.99).precision(2),
            Joi.valid(null),
            Joi.string().valid("")
          )
          .optional(),

        stock: Joi.number().integer().min(0).default(0),
        status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
        sort_order: Joi.number().integer().min(0).default(0),
      })
    )
    .min(1)
    .max(100)
    .required(),
});


module.exports = {
  createProductVariationSchema,
  updateProductVariationSchema,
  updateProductVariationStatusSchema,
  bulkCreateProductVariationsSchema,
};
