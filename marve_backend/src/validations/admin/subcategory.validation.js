"use strict";

const Joi = require("joi");
const { CATEGORY_ICONS } = require("../../constants/categoryIcons");

const createSubcategorySchema = Joi.object({
  category_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Parent category ID must be a number.",
      "number.integer": "Parent category ID must be an integer.",
      "number.positive": "Please select a valid parent category.",
      "any.required": "Parent category is required.",
    }),

  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.empty": "Subcategory name is required.",
      "string.min": "Subcategory name must be at least 2 characters.",
      "string.max": "Subcategory name must not exceed 150 characters.",
      "any.required": "Subcategory name is required.",
    }),

  slug: Joi.string()
    .trim()
    .min(2)
    .max(180)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.empty": "Subcategory slug is required.",
      "string.min": "Subcategory slug must be at least 2 characters.",
      "string.max": "Subcategory slug must not exceed 180 characters.",
      "string.pattern.base":
        "Slug must contain lowercase letters, numbers, and hyphens only.",
      "any.required": "Subcategory slug is required.",
    }),

  description: Joi.string()
    .trim()
    .allow("")
    .max(5000)
    .optional()
    .messages({
      "string.max": "Description must not exceed 5000 characters.",
    }),

  icon: Joi.string()
    .trim()
    .valid(...CATEGORY_ICONS)
    .allow("", null)
    .optional()
    .messages({
      "any.only": "Please select a valid subcategory icon.",
    }),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .default("ACTIVE")
    .messages({
      "any.only": "Status must be ACTIVE or INACTIVE.",
    }),

  sort_order: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      "number.base": "Sort order must be a number.",
      "number.integer": "Sort order must be an integer.",
      "number.min": "Sort order cannot be negative.",
    }),
}).unknown(false);

const updateSubcategorySchema = Joi.object({
  category_id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "Parent category ID must be a number.",
      "number.integer": "Parent category ID must be an integer.",
      "number.positive": "Please select a valid parent category.",
    }),

  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .messages({
      "string.empty": "Subcategory name cannot be empty.",
      "string.min": "Subcategory name must be at least 2 characters.",
      "string.max": "Subcategory name must not exceed 150 characters.",
    }),

  slug: Joi.string()
    .trim()
    .min(2)
    .max(180)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .messages({
      "string.empty": "Subcategory slug cannot be empty.",
      "string.min": "Subcategory slug must be at least 2 characters.",
      "string.max": "Subcategory slug must not exceed 180 characters.",
      "string.pattern.base":
        "Slug must contain lowercase letters, numbers, and hyphens only.",
    }),

  description: Joi.string()
    .trim()
    .allow("")
    .max(5000)
    .messages({
      "string.max": "Description must not exceed 5000 characters.",
    }),

  icon: Joi.string()
    .trim()
    .valid(...CATEGORY_ICONS)
    .allow("", null)
    .optional()
    .messages({
      "any.only": "Please select a valid subcategory icon.",
    }),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .messages({
      "any.only": "Status must be ACTIVE or INACTIVE.",
    }),

  sort_order: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "Sort order must be a number.",
      "number.integer": "Sort order must be an integer.",
      "number.min": "Sort order cannot be negative.",
    }),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "At least one field is required to update a subcategory.",
  });

module.exports = {
  createSubcategorySchema,
  updateSubcategorySchema,
};