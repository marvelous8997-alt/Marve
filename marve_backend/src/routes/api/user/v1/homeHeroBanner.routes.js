
"use strict";

const express = require("express");
const router = express.Router();

const {
  userHomeHeroBannerController,
} = require("../../../../controllers/index");

// GET ACTIVE HOME HERO BANNER
router.get(
  "/",
  userHomeHeroBannerController.getActiveHomeHeroBanner
);

module.exports = router;
