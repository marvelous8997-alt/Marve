
"use strict";

const express = require("express");
const router = express.Router();

const { adminDiscountCouponController } = require("../../../../controllers/index");
const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

// Create Discount Coupon
router.post(
  "/create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminDiscountCouponController.createDiscountCoupon
);

// Get Discount Coupon List
router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminDiscountCouponController.getDiscountCoupons
);

// Get Discount Coupon Details
router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminDiscountCouponController.getDiscountCoupon
);

// Update Discount Coupon
router.patch(
  "/update/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminDiscountCouponController.updateDiscountCoupon
);

// Update Discount Coupon Status
router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminDiscountCouponController.updateDiscountCouponStatus
);

// Delete Discount Coupon Permanently
router.delete(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminDiscountCouponController.deleteDiscountCoupon
);

module.exports = router;
