
"use strict";

const Joi = require("joi");

/* =========================================================
   CONSTANTS
========================================================= */

const RETURN_REQUEST_STATUSES = [
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
  "CANCELLED",
];

const RETURN_REASONS = [
  "SIZE_TOO_SMALL",
  "SIZE_TOO_LARGE",
  "PRODUCT_DAMAGED",
  "WRONG_PRODUCT",
  "PRODUCT_NOT_AS_DESCRIBED",
  "QUALITY_ISSUE",
  "OTHER",
];

const RETURN_SORT_FIELDS = [
  "returnNumber",
  "status",
  "reason",
  "refundAmount",
  "requestedAt",
  "approvedAt",
  "rejectedAt",
  "createdAt",
  "updatedAt",
];

/* =========================================================
   COMMON FIELDS
========================================================= */

const returnRequestIdentifierField = Joi.string()
  .trim()
  .guid({
    version: ["uuidv4", "uuidv5"],
  })
  .required()
  .messages({
    "string.empty": "Return request identifier is required.",
    "string.guid": "Please provide a valid return request UUID.",
    "any.required": "Return request identifier is required.",
  });

const returnRequestStatusField = Joi.string()
  .trim()
  .uppercase()
  .valid(...RETURN_REQUEST_STATUSES)
  .messages({
    "string.empty": "Return request status is required.",
    "any.only": "Invalid return request status.",
  });

const returnReasonField = Joi.string()
  .trim()
  .uppercase()
  .valid(...RETURN_REASONS)
  .messages({
    "string.empty": "Return reason is required.",
    "any.only": "Invalid return reason.",
  });

const adminNoteField = Joi.string()
  .trim()
  .max(1000)
  .allow("", null)
  .messages({
    "string.max": "Admin note cannot exceed 1000 characters.",
  });

/* =========================================================
   GET RETURN REQUESTS - QUERY VALIDATION
========================================================= */

const getReturnRequestsSchema = Joi.object({
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

  returnNumber: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .messages({
      "string.max": "Return number cannot exceed 100 characters.",
    }),

  orderNumber: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .messages({
      "string.max": "Order number cannot exceed 100 characters.",
    }),

  customer: Joi.string()
    .trim()
    .max(255)
    .allow("")
    .messages({
      "string.max": "Customer search cannot exceed 255 characters.",
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .allow("")
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.max": "Email cannot exceed 255 characters.",
    }),

  phone: Joi.string()
    .trim()
    .max(30)
    .allow("")
    .messages({
      "string.max": "Phone search cannot exceed 30 characters.",
    }),

  status: returnRequestStatusField.optional(),

  reason: returnReasonField.optional(),

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
    .valid(...RETURN_SORT_FIELDS)
    .default("requestedAt")
    .messages({
      "any.only": "Invalid return request sorting field.",
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
   GET SINGLE RETURN REQUEST
========================================================= */

const getReturnRequestSchema = Joi.object({
  identifier: returnRequestIdentifierField,
}).unknown(false);

/* =========================================================
   REFRESH RETURN TRACKING
========================================================= */

const refreshReturnTrackingSchema = Joi.object({}).unknown(false);

/* =========================================================
   APPROVE RETURN REQUEST
========================================================= */

const approveReturnRequestSchema = Joi.object({
  adminNote: adminNoteField.optional(),
}).unknown(false);

/* =========================================================
   REJECT RETURN REQUEST
========================================================= */

const rejectReturnRequestSchema = Joi.object({
  rejectionReason: Joi.string()
    .trim()
    .min(3)
    .max(1000)
    .required()
    .messages({
      "string.empty": "Rejection reason is required.",
      "string.min": "Rejection reason must contain at least 3 characters.",
      "string.max": "Rejection reason cannot exceed 1000 characters.",
      "any.required": "Rejection reason is required.",
    }),

  adminNote: adminNoteField.optional(),
}).unknown(false);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  RETURN_REQUEST_STATUSES,
  RETURN_REASONS,
  RETURN_SORT_FIELDS,

  returnRequestIdentifierField,
  returnRequestStatusField,
  returnReasonField,
  adminNoteField,

  getReturnRequestsSchema,
  getReturnRequestSchema,
  approveReturnRequestSchema,
  rejectReturnRequestSchema,
  refreshReturnTrackingSchema,
};