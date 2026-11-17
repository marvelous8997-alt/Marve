"use strict";

const express = require("express");
const router = express.Router();

const {
  userNewArrivalsHeroBannerController,
} = require("../../../../controllers/index");

// GET ACTIVE NEW ARRIVALS HERO BANNER
router.get(
  "/",
  userNewArrivalsHeroBannerController
    .getActiveNewArrivalsHeroBanner
);

module.exports = router;