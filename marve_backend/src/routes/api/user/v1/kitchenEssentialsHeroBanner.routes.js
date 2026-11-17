
"use strict";

const express = require("express");
const router = express.Router();

const {
  userKitchenEssentialsHeroBannerController,
} = require("../../../../controllers/index");

// GET ACTIVE KITCHEN ESSENTIALS HERO BANNER
router.get(
  "/",
  userKitchenEssentialsHeroBannerController
    .getActiveKitchenEssentialsHeroBanner
);

module.exports = router;
