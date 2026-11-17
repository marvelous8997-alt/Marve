"use strict";

const express = require("express");
const router = express.Router();

const {
  userPaymentController,
} = require("../../../../../src/controllers/index");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= PAYMENT ROUTES ========================= */

// CREATE RAZORPAY ORDER
// POST /api/user/payments/create-order
router.post(
  "/create-order",
  authenticate,
  userPaymentController.createPaymentOrder
);

// VERIFY RAZORPAY PAYMENT
// POST /api/user/payments/verify
router.post(
  "/verify",
  authenticate,
  userPaymentController.verifyPayment
);

// GET PAYMENT BY ID
// GET /api/user/payments/:id
router.get(
  "/:id",
  authenticate,
  userPaymentController.getPaymentById
);

// RAZORPAY WEBHOOK
// POST /api/user/payments/webhook
// IMPORTANT:
// - No user authentication middleware on this route.
// - Verify the Razorpay webhook signature using the original raw body.
// - The raw-body middleware must be configured before express.json()
//   for this route, in the main Express app setup.
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   userPaymentController.handleWebhook
// );

/* ========================= EXPORTS ========================= */

module.exports = router;