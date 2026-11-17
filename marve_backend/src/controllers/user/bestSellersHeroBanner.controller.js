
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  userBestSellersHeroBannerService,
} = require("../../services");

/* =========================
   GET ACTIVE BEST SELLERS HERO BANNER
   Used by the storefront
========================= */

const getActiveBestSellersHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await userBestSellersHeroBannerService
        .getActiveBestSellersHeroBanner();

    return ResponseHelper.success(
      res,
      "Active Best Sellers Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  getActiveBestSellersHeroBanner,
};
