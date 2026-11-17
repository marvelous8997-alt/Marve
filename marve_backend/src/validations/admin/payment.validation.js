"use strict";

const Joi = require("joi");

/* =========================================================
   CONSTANTS
========================================================= */

const PAYMENT_STATUSES = [
  "CREATED",
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

const FRONTEND_PAYMENT_STATUSES = [
  "PAID",
];

const PAYMENT_METHODS = [
  "ONLINE",
  "COD",
  "UPI",
  "CARD",
  "NETBANKING",
  "WALLET",
  "EMI",
  "OTHER",
];

const PAYMENT_PROVIDERS = [
  "RAZORPAY",
  "COD",
];

const REFUND_REASONS = [
  "CUSTOMER_REQUEST",
  "ORDER_CANCELLED",
  "PRODUCT_RETURNED",
  "PRODUCT_DAMAGED",
  "DUPLICATE_PAYMENT",
  "PAYMENT_ERROR",
  "OTHER",
];

const PAYMENT_SORT_FIELDS = [
  "paymentNumber",
  "amount",
  "status",
  "method",
  "provider",
  "createdAt",
  "updatedAt",
  "capturedAt",
];

/* =========================================================
   COMMON FIELDS
========================================================= */

const paymentIdentifierField = Joi.alternatives()
  .try(
    Joi.number().integer().positive(),
    Joi.string().trim().min(1).max(100)
  )
  .required()
  .messages({
    "alternatives.match": "Please provide a valid payment identifier.",
    "any.required": "Payment identifier is required.",
  });

const paymentStatusField = Joi.string()
  .trim()
  .uppercase()
  .valid(...PAYMENT_STATUSES, ...FRONTEND_PAYMENT_STATUSES)
  .messages({
    "string.empty": "Payment status is required.",
    "any.only": "Invalid payment status.",
  });

const paymentMethodField = Joi.string()
  .trim()
  .uppercase()
  .valid(...PAYMENT_METHODS)
  .messages({
    "string.empty": "Payment method is required.",
    "any.only": "Invalid payment method.",
  });

const paymentProviderField = Joi.string()
  .trim()
  .uppercase()
  .valid(...PAYMENT_PROVIDERS)
  .messages({
    "string.empty": "Payment provider is required.",
    "any.only": "Invalid payment provider.",
  });

/* =========================================================
   GET PAYMENTS - QUERY VALIDATION
========================================================= */

const getPaymentsSchema = Joi.object({
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

  status: paymentStatusField.optional(),

  method: paymentMethodField.optional(),

  provider: paymentProviderField.optional(),

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
    .valid(...PAYMENT_SORT_FIELDS)
    .default("createdAt")
    .messages({
      "any.only": "Invalid payment sorting field.",
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
   GET SINGLE PAYMENT
========================================================= */

const getPaymentSchema = Joi.object({
  identifier: paymentIdentifierField,
}).unknown(false);

/* =========================================================
   REFUND PAYMENT
========================================================= */

const refundPaymentSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Refund amount must be a valid number.",
      "number.positive": "Refund amount must be greater than zero.",
      "number.precision": "Refund amount cannot have more than two decimal places.",
      "any.required": "Refund amount is required.",
    }),

  reason: Joi.string()
    .trim()
    .uppercase()
    .valid(...REFUND_REASONS)
    .required()
    .messages({
      "string.empty": "Refund reason is required.",
      "any.only": "Invalid refund reason.",
      "any.required": "Refund reason is required.",
    }),
})
  .unknown(false);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  PAYMENT_STATUSES,
  FRONTEND_PAYMENT_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_PROVIDERS,
  REFUND_REASONS,
  PAYMENT_SORT_FIELDS,

  paymentIdentifierField,
  paymentStatusField,
  paymentMethodField,
  paymentProviderField,

  getPaymentsSchema,
  getPaymentSchema,
  refundPaymentSchema,
};
