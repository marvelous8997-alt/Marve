
"use strict";

const express = require("express");
const router = express.Router();

const {
  userHomeCouponBannerController,
} = require("../../../../controllers/index");

// GET ACTIVE HOME COUPON BANNER
router.get(
  "/",
  userHomeCouponBannerController.getActiveHomeCouponBanner
);

module.exports = router;
