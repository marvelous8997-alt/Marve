
"use strict";

const Joi = require("joi");

// =====================================================
// COMMON UUID VALIDATION
// =====================================================

const uuidField = Joi.string()
  .trim()
  .guid({
    version: ["uuidv4", "uuidv5"],
  })
  .messages({
    "string.guid": "Please provide a valid UUID.",
    "string.empty": "UUID is required.",
  });

// =====================================================
// RETURN REASONS
// =====================================================

const returnReasons = [
  "SIZE_TOO_SMALL",
  "SIZE_TOO_LARGE",
  "PRODUCT_DAMAGED",
  "WRONG_PRODUCT",
  "PRODUCT_NOT_AS_DESCRIBED",
  "QUALITY_ISSUE",
  "OTHER",
];

// =====================================================
// RETURN REQUEST ITEM SCHEMA
// =====================================================

const returnRequestItemSchema = Joi.object({
  orderItemUuid: uuidField.required().messages({
    "any.required": "Order item UUID is required.",
  }),

  quantity: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Return quantity must be a number.",
      "number.integer": "Return quantity must be an integer.",
      "number.positive": "Return quantity must be greater than zero.",
      "any.required": "Return quantity is required.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// CREATE RETURN REQUEST
// =====================================================

const createReturnRequestSchema = Joi.object({
  orderUuid: uuidField.required().messages({
    "any.required": "Order UUID is required.",
  }),

  reason: Joi.string()
    .trim()
    .uppercase()
    .valid(...returnReasons)
    .required()
    .messages({
      "any.only": "Please select a valid return reason.",
      "any.required": "Return reason is required.",
      "string.empty": "Return reason is required.",
    }),

  description: Joi.string()
    .trim()
    .max(5000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description cannot exceed 5000 characters.",
    }),

  items: Joi.array()
    .items(returnRequestItemSchema)
    .min(1)
    .required()
    .unique("orderItemUuid")
    .messages({
      "array.base": "Return items must be an array.",
      "array.min": "At least one return item is required.",
      "array.unique": "Duplicate order items are not allowed.",
      "any.required": "Return items are required.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN REQUEST UUID
// =====================================================

const returnRequestUuidSchema = Joi.object({
  uuid: uuidField.required().messages({
    "any.required": "Return request UUID is required.",
  }),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN REQUEST ID
// =====================================================

const returnRequestIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Return request ID must be a number.",
      "number.integer": "Return request ID must be an integer.",
      "number.positive": "Return request ID must be greater than zero.",
      "any.required": "Return request ID is required.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// ORDER UUID
// =====================================================

const returnRequestOrderUuidSchema = Joi.object({
  orderUuid: uuidField.required().messages({
    "any.required": "Order UUID is required.",
  }),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN REQUEST LIST QUERY
// =====================================================

const getReturnRequestsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number.",
      "number.integer": "Page must be an integer.",
      "number.min": "Page must be greater than zero.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 50.",
    }),

  status: Joi.string()
    .trim()
    .uppercase()
    .valid(
      "REQUESTED",
      "APPROVED",
      "REJECTED",
      "PICKUP_SCHEDULED",
      "PICKED_UP",
      "RECEIVED",
      "INSPECTING",
      "REFUND_APPROVED",
      "REFUND_INITIATED",
      "REFUNDED",
      "CANCELLED"
    )
    .optional()
    .messages({
      "any.only": "Please provide a valid return request status.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createReturnRequestSchema,
  returnRequestUuidSchema,
  returnRequestIdSchema,
  returnRequestOrderUuidSchema,
  getReturnRequestsQuerySchema,
};
