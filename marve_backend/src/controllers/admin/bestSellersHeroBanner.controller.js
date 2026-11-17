
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  adminBestSellersHeroBannerService,
} = require("../../services");

const {
  saveBestSellersHeroBannerSchema,
  updateBestSellersHeroBannerStatusSchema,
} = require("../../validations/admin/bestSellersHeroBanner.validation");

/* =========================
   SAVE SINGLE BEST SELLERS HERO BANNER
========================= */

// Creates the initial record if missing;
// otherwise updates the existing record.
const saveBestSellersHeroBanner = asyncHandler(
  async (req, res) => {
    const { error, value } =
      saveBestSellersHeroBannerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      return ResponseHelper.validationError(
        res,
        error.details.map((item) => item.message)
      );
    }

    const banner =
      await adminBestSellersHeroBannerService.saveBestSellersHeroBanner(
        value,
        req.file
      );

    return ResponseHelper.success(
      res,
      "Best Sellers Hero Banner saved successfully.",
      banner
    );
  }
);

/* =========================
   GET SINGLE BANNER BY UUID
========================= */

const getBestSellersHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminBestSellersHeroBannerService.getBestSellersHeroBanner(
        req.params.uuid
      );

    return ResponseHelper.success(
      res,
      "Best Sellers Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   GET BANNER BY TYPE
========================= */

const getBestSellersHeroBannerByType = asyncHandler(
  async (req, res) => {
    const banner =
      await adminBestSellersHeroBannerService.getBestSellersHeroBannerByType();

    return ResponseHelper.success(
      res,
      "Best Sellers Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateBestSellersHeroBannerStatus = asyncHandler(
  async (req, res) => {
    const { error, value } =
      updateBestSellersHeroBannerStatusSchema.validate(
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
      await adminBestSellersHeroBannerService.updateBestSellersHeroBannerStatus(
        req.params.uuid,
        value.status
      );

    return ResponseHelper.success(
      res,
      "Best Sellers Hero Banner status updated successfully.",
      banner
    );
  }
);

/* =========================
   GET ACTIVE BANNER FOR STOREFRONT
========================= */

const getActiveBestSellersHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminBestSellersHeroBannerService.getActiveBestSellersHeroBanner();

    return ResponseHelper.success(
      res,
      "Active Best Sellers Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  saveBestSellersHeroBanner,
  getBestSellersHeroBanner,
  getBestSellersHeroBannerByType,
  updateBestSellersHeroBannerStatus,
  getActiveBestSellersHeroBanner,
};
