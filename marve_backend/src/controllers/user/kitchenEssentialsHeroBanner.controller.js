
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  userKitchenEssentialsHeroBannerService,
} = require("../../services");

/* =========================
   GET ACTIVE KITCHEN ESSENTIALS HERO BANNER
   Used by the storefront
========================= */

const getActiveKitchenEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await userKitchenEssentialsHeroBannerService
        .getActiveKitchenEssentialsHeroBanner();

    return ResponseHelper.success(
      res,
      "Active Kitchen Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  getActiveKitchenEssentialsHeroBanner,
};
