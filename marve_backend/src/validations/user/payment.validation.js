"use strict";

const Joi = require("joi");

// COMMON RAZORPAY PAYMENT FIELDS
const razorpayPaymentFields = {
  orderId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Order ID must be a number.",
      "number.integer": "Order ID must be an integer.",
      "number.positive": "Order ID must be greater than zero.",
      "any.required": "Order ID is required.",
    }),
};

// CREATE RAZORPAY ORDER
// POST /api/user/payments/create-order
const createRazorpayOrderSchema = Joi.object({
  ...razorpayPaymentFields,
})
  .required()
  .unknown(false);

// VERIFY RAZORPAY PAYMENT
// POST /api/user/payments/verify
const verifyPaymentSchema = Joi.object({
  razorpay_order_id: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Razorpay order ID is required.",
      "string.max": "Razorpay order ID is too long.",
      "any.required": "Razorpay order ID is required.",
    }),

  razorpay_payment_id: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Razorpay payment ID is required.",
      "string.max": "Razorpay payment ID is too long.",
      "any.required": "Razorpay payment ID is required.",
    }),

  razorpay_signature: Joi.string()
    .trim()
    .pattern(/^[a-f0-9]{64}$/i)
    .required()
    .messages({
      "string.empty": "Razorpay payment signature is required.",
      "string.pattern.base": "Please provide a valid Razorpay payment signature.",
      "any.required": "Razorpay payment signature is required.",
    }),
})
  .required()
  .unknown(false);

// PAYMENT ID
const paymentIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Payment ID must be a number.",
      "number.integer": "Payment ID must be an integer.",
      "number.positive": "Payment ID must be greater than zero.",
      "any.required": "Payment ID is required.",
    }),
})
  .required()
  .unknown(false);

module.exports = {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
  paymentIdSchema,
};