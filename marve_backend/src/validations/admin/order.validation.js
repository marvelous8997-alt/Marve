
"use strict";

const Joi = require("joi");

/* =========================================================
   CONSTANTS
========================================================= */

const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
];

const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

const PAYMENT_METHODS = ["ONLINE", "COD"];

/* =========================================================
   COMMON FIELDS
========================================================= */

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

const orderStatusField = Joi.string()
  .trim()
  .uppercase()
  .valid(...ORDER_STATUSES)
  .messages({
    "string.empty": "Order status is required.",
    "any.only": "Invalid order status.",
  });

const paymentStatusField = Joi.string()
  .trim()
  .uppercase()
  .valid(...PAYMENT_STATUSES)
  .messages({
    "string.empty": "Payment status is required.",
    "any.only": "Invalid payment status.",
  });

/* =========================================================
   GET ORDERS - QUERY VALIDATION
========================================================= */

const getOrdersSchema = Joi.object({
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

  phone: Joi.string()
    .trim()
    .max(30)
    .allow("")
    .messages({
      "string.max": "Phone search cannot exceed 30 characters.",
    }),

  product: Joi.string()
    .trim()
    .max(255)
    .allow("")
    .messages({
      "string.max": "Product search cannot exceed 255 characters.",
    }),

  orderStatus: orderStatusField.optional(),

  paymentStatus: paymentStatusField.optional(),

  paymentMethod: Joi.string()
    .trim()
    .uppercase()
    .valid(...PAYMENT_METHODS)
    .messages({
      "any.only": "Payment method must be ONLINE or COD.",
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
      "orderNumber",
      "subtotal",
      "totalAmount",
      "orderStatus",
      "paymentStatus",
      "paymentMethod",
      "createdAt",
      "updatedAt"
    )
    .default("createdAt")
    .messages({
      "any.only": "Invalid order sorting field.",
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
   GET SINGLE ORDER
========================================================= */

const getOrderSchema = Joi.object({
  identifier: orderIdentifierField,
}).unknown(false);

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

const updateOrderStatusSchema = Joi.object({
  status: orderStatusField.required().messages({
    "string.empty": "Order status is required.",
    "any.required": "Order status is required.",
    "any.only": "Invalid order status.",
  }),
}).unknown(false);

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

const updatePaymentStatusSchema = Joi.object({
  paymentStatus: paymentStatusField.required().messages({
    "string.empty": "Payment status is required.",
    "any.required": "Payment status is required.",
    "any.only": "Invalid payment status.",
  }),
}).unknown(false);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,

  orderIdentifierField,

  getOrdersSchema,
  getOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
};
