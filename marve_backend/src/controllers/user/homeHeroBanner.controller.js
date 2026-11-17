
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { userHomeHeroBannerService } = require("../../services");

/* =========================
   GET ACTIVE HOME HERO BANNER
   Used by the storefront
========================= */

const getActiveHomeHeroBanner = asyncHandler(async (req, res) => {
  const banner =
    await userHomeHeroBannerService.getActiveHomeHeroBanner();

  return ResponseHelper.success(
    res,
    "Active Home Hero Banner fetched successfully.",
    banner
  );
});

module.exports = {
  getActiveHomeHeroBanner,
};
