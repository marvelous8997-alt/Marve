
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  userHomeEssentialsHeroBannerService,
} = require("../../services");

/* =========================
   GET ACTIVE HOME ESSENTIALS HERO BANNER
   Used by the storefront
========================= */

const getActiveHomeEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await userHomeEssentialsHeroBannerService
        .getActiveHomeEssentialsHeroBanner();

    return ResponseHelper.success(
      res,
      "Active Home Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  getActiveHomeEssentialsHeroBanner,
};
