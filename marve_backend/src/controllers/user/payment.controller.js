"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userPaymentService } = require("../../services");

const {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
  paymentIdSchema,
} = require("../../validations/user/payment.validation");

// =====================================================
// CREATE RAZORPAY ORDER
// POST /api/user/payments/create-order
// =====================================================

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { error, value } = createRazorpayOrderSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to initiate payment."
    );
  }

  const result = await userPaymentService.createPaymentOrder(
    userId,
    value
  );

  return ResponseHelper.success(
    res,
    result.message || "Payment order created successfully.",
    result,
    201
  );
});

// =====================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/user/payments/verify
// =====================================================

const verifyPayment = asyncHandler(async (req, res) => {
  const { error, value } = verifyPaymentSchema.validate(req.body, {
    abortEarly: false,
    convert: false,
    stripUnknown: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to verify payment."
    );
  }

  const result = await userPaymentService.verifyPayment(
    userId,
    value
  );

  return ResponseHelper.success(
    res,
    result.message || "Payment verification completed.",
    result
  );
});

// =====================================================
// GET PAYMENT BY ID
// GET /api/user/payments/:id
// =====================================================

const getPaymentById = asyncHandler(async (req, res) => {
  const { error, value } = paymentIdSchema.validate(req.params, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to view payment details."
    );
  }

  const payment = await userPaymentService.getPaymentById(
    value.id,
    userId
  );

  return ResponseHelper.success(
    res,
    "Payment details fetched successfully.",
    payment
  );
});

// =====================================================
// RAZORPAY WEBHOOK
// POST /api/user/payments/webhook
//
// Webhook authentication uses Razorpay's signature,
// not the logged-in user's authentication token.
// The route must supply the original raw request body.
// =====================================================

const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.get("x-razorpay-signature");
  const eventId = req.get("x-razorpay-event-id");

  if (!signature) {
    throw new ApiError(
      400,
      "Razorpay webhook signature is required."
    );
  }

  if (!Buffer.isBuffer(req.body)) {
    throw new ApiError(
      400,
      "Webhook raw body is missing. Configure the webhook route to use express.raw()."
    );
  }

  const result = await userPaymentService.handleWebhook({
    rawBody: req.body,
    signature,
    eventId,
  });

  return ResponseHelper.success(
    res,
    result.message || "Webhook received successfully.",
    result
  );
});

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentById,
  handleWebhook,
};