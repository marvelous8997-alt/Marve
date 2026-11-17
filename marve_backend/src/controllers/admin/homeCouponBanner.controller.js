
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  adminHomeCouponBannerService,
} = require("../../services");

const {
  saveHomeCouponBannerSchema,
  updateHomeCouponBannerStatusSchema,
} = require("../../validations/admin/homeCouponBanner.validation");

/* =========================
   SAVE SINGLE HOME COUPON BANNER
========================= */

// Creates the initial record if missing;
// otherwise updates the existing record.
const saveHomeCouponBanner = asyncHandler(async (req, res) => {
  const { error, value } = saveHomeCouponBannerSchema.validate(
    req.body,
    {
      abortEarly: false,
      stripUnknown: true,
    }
  );

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const banner =
    await adminHomeCouponBannerService.saveHomeCouponBanner(
      value,
      req.file
    );

  return ResponseHelper.success(
    res,
    "Home Coupon Banner saved successfully.",
    banner
  );
});

/* =========================
   GET SINGLE BANNER BY UUID
========================= */

const getHomeCouponBanner = asyncHandler(async (req, res) => {
  const banner =
    await adminHomeCouponBannerService.getHomeCouponBanner(
      req.params.uuid
    );

  return ResponseHelper.success(
    res,
    "Home Coupon Banner fetched successfully.",
    banner
  );
});

/* =========================
   GET BANNER BY TYPE
========================= */

const getHomeCouponBannerByType = asyncHandler(
  async (req, res) => {
    const banner =
      await adminHomeCouponBannerService.getHomeCouponBannerByType();

    return ResponseHelper.success(
      res,
      "Home Coupon Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateHomeCouponBannerStatus = asyncHandler(
  async (req, res) => {
    const { error, value } =
      updateHomeCouponBannerStatusSchema.validate(
        req.body,
        {
          abortEarly: false,
          stripUnknown: true,
        }
      );

    if (error) {
      return ResponseHelper.validationError(
        res,
        error.details.map((item) => item.message)
      );
    }

    const banner =
      await adminHomeCouponBannerService.updateHomeCouponBannerStatus(
        req.params.uuid,
        value.status
      );

    return ResponseHelper.success(
      res,
      "Home Coupon Banner status updated successfully.",
      banner
    );
  }
);

/* =========================
   GET ACTIVE BANNER FOR STOREFRONT
========================= */

const getActiveHomeCouponBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminHomeCouponBannerService.getActiveHomeCouponBanner();

    return ResponseHelper.success(
      res,
      "Active Home Coupon Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  saveHomeCouponBanner,
  getHomeCouponBanner,
  getHomeCouponBannerByType,
  updateHomeCouponBannerStatus,
  getActiveHomeCouponBanner,
};
