
"use strict";

const Joi = require("joi");

/* =========================================================
   CONSTANTS
========================================================= */

const CUSTOMER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
];

/* =========================================================
   COMMON FIELDS
========================================================= */

// Customer identifier: database ID or a numeric string.
const customerIdentifierField = Joi.alternatives()
  .try(
    Joi.number().integer().positive(),
    Joi.string()
      .trim()
      .pattern(/^\d+$/)
      .max(20)
  )
  .required()
  .messages({
    "alternatives.match": "Please provide a valid customer ID.",
    "any.required": "Customer identifier is required.",
  });

const customerStatusField = Joi.string()
  .trim()
  .uppercase()
  .valid(...CUSTOMER_STATUSES)
  .messages({
    "string.empty": "Customer status is required.",
    "any.only": "Invalid customer status.",
  });

/* =========================================================
   GET CUSTOMERS - QUERY VALIDATION
========================================================= */

const getCustomersSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a valid number.",
      "number.integer": "Page must be an integer.",
      "number.min": "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(8)
    .messages({
      "number.base": "Limit must be a valid number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 100.",
    }),

  search: Joi.string()
    .trim()
    .max(255)
    .allow("")
    .default("")
    .messages({
      "string.max": "Search cannot exceed 255 characters.",
    }),

  status: Joi.string()
    .trim()
    .uppercase()
    .valid("ALL", ...CUSTOMER_STATUSES)
    .default("ALL")
    .messages({
      "any.only": "Invalid customer status filter.",
    }),

  sortBy: Joi.string()
    .trim()
    .valid(
      "firstName",
      "lastName",
      "email",
      "status",
      "createdAt",
      "updatedAt"
    )
    .default("createdAt")
    .messages({
      "any.only": "Invalid customer sorting field.",
    }),

  sortOrder: Joi.string()
    .trim()
    .uppercase()
    .valid("ASC", "DESC")
    .default("DESC")
    .messages({
      "any.only": "Sort order must be ASC or DESC.",
    }),
}).unknown(false);

/* =========================================================
   GET SINGLE CUSTOMER
========================================================= */

const getCustomerSchema = Joi.object({
  identifier: customerIdentifierField,
}).unknown(false);

/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

const updateCustomerStatusSchema = Joi.object({
  status: customerStatusField
    .required()
    .messages({
      "string.empty": "Customer status is required.",
      "any.required": "Customer status is required.",
      "any.only": "Invalid customer status.",
    }),
}).unknown(false);

module.exports = {
  CUSTOMER_STATUSES,
  customerIdentifierField,

  getCustomersSchema,
  getCustomerSchema,
  updateCustomerStatusSchema,
};
