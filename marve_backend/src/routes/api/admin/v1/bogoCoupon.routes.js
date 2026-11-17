
"use strict";

const express = require("express");
const router = express.Router();

const { adminBogoCouponController } = require("../../../../controllers/index");
const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

// Create BOGO Coupon
router.post(
  "/create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBogoCouponController.createBogoCoupon
);

// Get BOGO Coupon List
router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBogoCouponController.getBogoCoupons
);

// Get BOGO Coupon Details
router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBogoCouponController.getBogoCoupon
);

// Update BOGO Coupon
router.patch(
  "/update/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBogoCouponController.updateBogoCoupon
);

// Update BOGO Coupon Status
router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBogoCouponController.updateBogoCouponStatus
);

// Get Active BOGO Coupons for Dropdown
router.get(
  "/active",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBogoCouponController.getActiveBogoCouponsForDropdown
);

// Delete BOGO Coupon Permanently
router.delete(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBogoCouponController.deleteBogoCoupon
);

module.exports = router;
