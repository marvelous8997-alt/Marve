
"use strict";

const express = require("express");
const router = express.Router();

const {
  userBestSellersHeroBannerController,
} = require("../../../../controllers/index");

// GET ACTIVE BEST SELLERS HERO BANNER
router.get(
  "/",
  userBestSellersHeroBannerController
    .getActiveBestSellersHeroBanner
);

module.exports = router;
