"use strict";

const Joi = require("joi");

// COMMON ORDER FIELDS
const orderFields = {
  checkoutAddressId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Checkout address ID must be a number.",
      "number.integer": "Checkout address ID must be an integer.",
      "number.positive": "Checkout address ID must be greater than zero.",
      "any.required": "Checkout address ID is required.",
    }),

  paymentMethod: Joi.string()
    .trim()
    .uppercase()
    .valid("ONLINE", "COD")
    .required()
    .messages({
      "string.empty": "Payment method is required.",
      "any.only": "Payment method must be ONLINE or COD.",
      "any.required": "Payment method is required.",
    }),

  couponCode: Joi.string()
    .trim()
    .uppercase()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Coupon code cannot exceed 100 characters.",
    }),

  notes: Joi.string()
    .trim()
    .max(1000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Order notes cannot exceed 1000 characters.",
    }),
};

// ORDER ITEM FIELDS
const orderItemSchema = Joi.object({
  productId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Product ID must be a number.",
      "number.integer": "Product ID must be an integer.",
      "number.positive": "Product ID must be greater than zero.",
      "any.required": "Product ID is required.",
    }),

  productVariationId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Product variation ID must be a number.",
      "number.integer": "Product variation ID must be an integer.",
      "number.positive": "Product variation ID must be greater than zero.",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "number.base": "Quantity must be a number.",
      "number.integer": "Quantity must be a whole number.",
      "number.min": "Quantity must be at least 1.",
      "number.max": "Quantity cannot exceed 100 per item.",
      "any.required": "Quantity is required.",
    }),
})
  .required()
  .unknown(false);

// CREATE ORDER
const createOrderSchema = Joi.object({
  ...orderFields,

items: Joi.array()
  .items(orderItemSchema)
  .min(1)
  .max(100)
  .unique((a, b) =>
    a.productId === b.productId &&
    (a.productVariationId ?? null) ===
      (b.productVariationId ?? null)
  )
  .required()
  .messages({
    "array.base": "Order items must be an array.",
    "array.min": "Please add at least one item to your order.",
    "array.max": "An order cannot contain more than 100 items.",
    "array.unique": "Duplicate product and variation combinations are not allowed.",
    "any.required": "Order items are required.",
  }),

  selectedGiftProductIds: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
        .messages({
          "number.base": "Gift product ID must be a number.",
          "number.integer": "Gift product ID must be an integer.",
          "number.positive": "Gift product ID must be greater than zero.",
        })
    )
    .max(1)
    .optional()
    .default([])
    .messages({
      "array.base": "Selected gift product IDs must be an array.",
      "array.max": "Please select only one gift product.",
    }),

})
  .required()
  .unknown(false);

// ORDER ID
const orderIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Order ID must be a number.",
      "number.integer": "Order ID must be an integer.",
      "number.positive": "Order ID must be greater than zero.",
      "any.required": "Order ID is required.",
    }),
})
  .required()
  .unknown(false);

// ORDER UUID
const orderUuidSchema = Joi.object({
  uuid: Joi.string()
    .trim()
    .guid({ version: ["uuidv4", "uuidv5"] })
    .required()
    .messages({
      "string.empty": "Order UUID is required.",
      "string.guid": "Please provide a valid order UUID.",
      "any.required": "Order UUID is required.",
    }),
})
  .required()
  .unknown(false);

// ORDER NUMBER
const orderNumberSchema = Joi.object({
  orderNumber: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.empty": "Order number is required.",
      "string.min": "Order number is required.",
      "string.max": "Order number cannot exceed 50 characters.",
      "any.required": "Order number is required.",
    }),
})
  .required()
  .unknown(false);

// ORDER LIST QUERY
const getOrdersQuerySchema = Joi.object({
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

  orderStatus: Joi.string()
    .trim()
    .uppercase()
    .valid(
      "PENDING_PAYMENT",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "RETURN_REQUESTED",
      "RETURNED"
    )
    .optional()
    .messages({
      "any.only": "Please provide a valid order status.",
    }),

  paymentStatus: Joi.string()
    .trim()
    .uppercase()
    .valid(
      "PENDING",
      "PROCESSING",
      "PAID",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
      "PARTIALLY_REFUNDED"
    )
    .optional()
    .messages({
      "any.only": "Please provide a valid payment status.",
    }),
})
  .required()
  .unknown(false);

module.exports = {
  createOrderSchema,
  orderIdSchema,
  orderUuidSchema,
  orderNumberSchema,
  getOrdersQuerySchema,
};