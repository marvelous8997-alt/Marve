
"use strict";

const express = require("express");
const router = express.Router();

const {
  userHomeEssentialsHeroBannerController,
} = require("../../../../controllers/index");

// GET ACTIVE HOME ESSENTIALS HERO BANNER
router.get(
  "/",
  userHomeEssentialsHeroBannerController
    .getActiveHomeEssentialsHeroBanner
);

module.exports = router;
