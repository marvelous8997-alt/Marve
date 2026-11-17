
"use strict";

const Joi = require("joi");

// =====================================================
// COMMON DATABASE ID
// =====================================================

const databaseId = (fieldName = "ID") =>
  Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": `${fieldName} must be a number.`,
      "number.integer": `${fieldName} must be an integer.`,
      "number.positive": `${fieldName} must be greater than zero.`,
      "any.required": `${fieldName} is required.`,
    });

// =====================================================
// UUID VALIDATION
// =====================================================

const uuidField = (fieldName = "UUID") =>
  Joi.string()
    .trim()
    .guid({
      version: ["uuidv4", "uuidv5"],
    })
    .required()
    .messages({
      "string.empty": `${fieldName} is required.`,
      "string.guid": `Please provide a valid ${fieldName}.`,
      "any.required": `${fieldName} is required.`,
    });

// =====================================================
// ORDER UUID
// =====================================================

const returnShipmentOrderUuidSchema = Joi.object({
  orderUuid: uuidField("Order UUID"),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN SHIPMENT ID
// =====================================================

const returnShipmentIdSchema = Joi.object({
  id: databaseId("Return shipment ID"),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN SHIPMENT UUID
// =====================================================

const returnShipmentUuidSchema = Joi.object({
  uuid: uuidField("Return shipment UUID"),
})
  .required()
  .unknown(false);

// =====================================================
// TRACKING NUMBER
// =====================================================

const returnShipmentTrackingNumberSchema = Joi.object({
  trackingNumber: Joi.string()
    .trim()
    .min(1)
    .max(150)
    .required()
    .messages({
      "string.empty": "Tracking number is required.",
      "string.min": "Tracking number is required.",
      "string.max": "Tracking number cannot exceed 150 characters.",
      "any.required": "Tracking number is required.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN TRACKING EVENT ID
// =====================================================

const returnTrackingEventIdSchema = Joi.object({
  eventId: databaseId("Return tracking event ID"),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN SHIPMENT LIST QUERY
// =====================================================

const getReturnShipmentsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number.",
      "number.integer": "Page must be an integer.",
      "number.min": "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 100.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// RETURN TRACKING HISTORY QUERY
// =====================================================

const getReturnTrackingHistoryQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number.",
      "number.integer": "Page must be an integer.",
      "number.min": "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 100.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  returnShipmentOrderUuidSchema,
  returnShipmentIdSchema,
  returnShipmentUuidSchema,
  returnShipmentTrackingNumberSchema,
  returnTrackingEventIdSchema,
  getReturnShipmentsQuerySchema,
  getReturnTrackingHistoryQuerySchema,
};
