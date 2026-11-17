"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  userNewArrivalsHeroBannerService,
} = require("../../services");

/* =========================
   GET ACTIVE NEW ARRIVALS HERO BANNER
   Used by the storefront
========================= */

const getActiveNewArrivalsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await userNewArrivalsHeroBannerService
        .getActiveNewArrivalsHeroBanner();

    return ResponseHelper.success(
      res,
      "Active New Arrivals Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  getActiveNewArrivalsHeroBanner,
};