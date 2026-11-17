
"use strict";

const Joi = require("joi");

/* =========================================================
   CONSTANTS
========================================================= */

const SHIPMENT_STATUSES = [
  "PENDING",
  "READY_TO_SHIP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
  "RETURN_TO_ORIGIN",
];

const TRACKING_SOURCES = ["ADMIN", "COURIER", "SYSTEM"];

/* =========================================================
   COMMON FIELDS
========================================================= */

const shipmentIdentifierField = Joi.alternatives()
  .try(
    Joi.number().integer().positive(),
    Joi.string().trim().min(1).max(100)
  )
  .required()
  .messages({
    "alternatives.match": "Please provide a valid shipment identifier.",
    "any.required": "Shipment identifier is required.",
  });

const orderIdentifierField = Joi.alternatives()
  .try(
    Joi.number().integer().positive(),
    Joi.string().trim().min(1).max(100)
  )
  .required()
  .messages({
    "alternatives.match": "Please provide a valid order identifier.",
    "any.required": "Order identifier is required.",
  });

const shipmentStatusField = Joi.string()
  .trim()
  .uppercase()
  .valid(...SHIPMENT_STATUSES)
  .messages({
    "string.empty": "Shipment status is required.",
    "any.only": "Invalid shipment status.",
  });

/* =========================================================
   GET SHIPMENTS - QUERY VALIDATION
========================================================= */

const getShipmentsSchema = Joi.object({
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
    .default(10)
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

  status: shipmentStatusField.optional(),

  courierName: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .messages({
      "string.max": "Courier name cannot exceed 150 characters.",
    }),

  orderNumber: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .messages({
      "string.max": "Order number cannot exceed 100 characters.",
    }),

  trackingNumber: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .messages({
      "string.max": "Tracking number cannot exceed 150 characters.",
    }),

  dateFrom: Joi.date()
    .iso()
    .messages({
      "date.base": "Please provide a valid start date.",
      "date.format": "Start date must use a valid ISO date format.",
    }),

  dateTo: Joi.date()
    .iso()
    .messages({
      "date.base": "Please provide a valid end date.",
      "date.format": "End date must use a valid ISO date format.",
    }),

  sortBy: Joi.string()
    .trim()
    .valid(
      "createdAt",
      "updatedAt",
      "shippedAt",
      "estimatedDeliveryAt",
      "deliveredAt",
      "status",
      "courierName",
      "trackingNumber"
    )
    .default("createdAt")
    .messages({
      "any.only": "Invalid shipment sorting field.",
    }),

  sortOrder: Joi.string()
    .trim()
    .uppercase()
    .valid("ASC", "DESC")
    .default("DESC")
    .messages({
      "any.only": "Sort order must be ASC or DESC.",
    }),
})
  .custom((value, helpers) => {
    if (
      value.dateFrom &&
      value.dateTo &&
      new Date(value.dateFrom) > new Date(value.dateTo)
    ) {
      return helpers.error("date.range");
    }

    return value;
  })
  .messages({
    "date.range": "Start date cannot be after end date.",
  })
  .unknown(false);

/* =========================================================
   GET SINGLE SHIPMENT
========================================================= */

const getShipmentSchema = Joi.object({
  identifier: shipmentIdentifierField,
}).unknown(false);

/* =========================================================
   CREATE SHIPMENT
========================================================= */

/* =========================================================
   CREATE SHIPMENT
========================================================= */

const createShipmentSchema = Joi.object({
  orderIdentifier: orderIdentifierField,

  courierId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Courier ID must be a valid number.",
      "number.integer": "Courier ID must be an integer.",
      "number.positive": "Courier ID must be greater than 0.",
    }),

  notes: Joi.string()
    .trim()
    .max(1000)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Shipment notes cannot exceed 1000 characters.",
    }),

  length: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Package length must be a valid number.",
      "number.positive": "Package length must be greater than zero.",
      "any.required": "Package length is required.",
    }),

  breadth: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Package breadth must be a valid number.",
      "number.positive": "Package breadth must be greater than zero.",
      "any.required": "Package breadth is required.",
    }),

  height: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Package height must be a valid number.",
      "number.positive": "Package height must be greater than zero.",
      "any.required": "Package height is required.",
    }),

  weight: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Package weight must be a valid number.",
      "number.positive": "Package weight must be greater than zero.",
      "any.required": "Package weight is required.",
    }),
}).unknown(false);

/* =========================================================
   UPDATE SHIPMENT STATUS
========================================================= */

const updateShipmentStatusSchema = Joi.object({
  status: shipmentStatusField.required().messages({
    "string.empty": "Shipment status is required.",
    "any.required": "Shipment status is required.",
    "any.only": "Invalid shipment status.",
  }),

  location: Joi.string()
    .trim()
    .max(255)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Tracking location cannot exceed 255 characters.",
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Tracking description cannot exceed 1000 characters.",
    }),

  eventAt: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "Please provide a valid tracking event date.",
      "date.format": "Tracking event date must use a valid ISO date format.",
    }),

  source: Joi.string()
    .trim()
    .uppercase()
    .valid("ADMIN")
    .default("ADMIN")
    .messages({
      "any.only": "Invalid tracking event source.",
    }),
}).unknown(false);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  SHIPMENT_STATUSES,
  TRACKING_SOURCES,

  shipmentIdentifierField,
  orderIdentifierField,

  getShipmentsSchema,
  getShipmentSchema,
  createShipmentSchema,
  updateShipmentStatusSchema,
};
