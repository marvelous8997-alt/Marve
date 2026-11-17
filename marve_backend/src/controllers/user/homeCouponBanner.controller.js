
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  userHomeCouponBannerService,
} = require("../../services");

/* =========================
   GET ACTIVE HOME COUPON BANNER
   Used by the storefront
========================= */

const getActiveHomeCouponBanner = asyncHandler(async (req, res) => {
  const banner =
    await userHomeCouponBannerService.getActiveHomeCouponBanner();

  return ResponseHelper.success(
    res,
    "Active Home Coupon Banner fetched successfully.",
    banner
  );
});

module.exports = {
  getActiveHomeCouponBanner,
};
