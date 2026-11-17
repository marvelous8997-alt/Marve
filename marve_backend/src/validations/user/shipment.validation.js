
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
// ORDER ID
// =====================================================

const shipmentOrderIdSchema = Joi.object({
  orderId: databaseId("Order ID"),
})
  .required()
  .unknown(false);

// =====================================================
// SHIPMENT ID
// =====================================================

const shipmentIdSchema = Joi.object({
  id: databaseId("Shipment ID"),
})
  .required()
  .unknown(false);

// =====================================================
// SHIPMENT UUID
// =====================================================

const shipmentUuidSchema = Joi.object({
  uuid: Joi.string()
    .trim()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required()
    .messages({
      "string.empty": "Shipment UUID is required.",
      "string.guid": "Please provide a valid shipment UUID.",
      "any.required": "Shipment UUID is required.",
    }),
})
  .required()
  .unknown(false);

// =====================================================
// TRACKING NUMBER
// =====================================================

const trackingNumberSchema = Joi.object({
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
// SHIPMENT TRACKING EVENT ID
// =====================================================

const trackingEventIdSchema = Joi.object({
  eventId: databaseId("Tracking event ID"),
})
  .required()
  .unknown(false);

// =====================================================
// SHIPMENT LIST QUERY
// =====================================================

const getShipmentsQuerySchema = Joi.object({
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
// TRACKING HISTORY QUERY
// =====================================================

const getTrackingHistoryQuerySchema = Joi.object({
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
  shipmentOrderIdSchema,
  shipmentIdSchema,
  shipmentUuidSchema,
  trackingNumberSchema,
  trackingEventIdSchema,
  getShipmentsQuerySchema,
  getTrackingHistoryQuerySchema,
};
