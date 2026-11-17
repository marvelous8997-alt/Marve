"use strict";

const express = require("express");
const router = express.Router();

const { adminPaymentController } = require("../../../../controllers");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

/* =========================================================
   GET PAYMENT LIST
========================================================= */

router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminPaymentController.getPayments
);

/* =========================================================
   GET PAYMENT SUMMARY
========================================================= */

router.get(
  "/summary",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminPaymentController.getPaymentSummary
);

/* =========================================================
   GET PAYMENT STATUS COUNTS
========================================================= */

router.get(
  "/status-counts",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminPaymentController.getPaymentStatusCounts
);

/* =========================================================
   GET PAYMENT DETAILS
========================================================= */

router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminPaymentController.getPayment
);

/* =========================================================
   REFUND PAYMENT
========================================================= */

// Keep this endpoint disabled at the router level until
// Razorpay refund processing and idempotency are implemented.

router.post(
  "/refund/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminPaymentController.refundPayment
);

module.exports = router;
