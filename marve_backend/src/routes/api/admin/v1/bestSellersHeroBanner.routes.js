
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminBestSellersHeroBannerController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

/* =========================
   SAVE SINGLE BEST SELLERS HERO BANNER
   Create if missing, otherwise update
========================= */

router.post(
  "/save",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("best-sellers-hero-banner"),
  upload.single("image"),
  adminBestSellersHeroBannerController.saveBestSellersHeroBanner
);

/* =========================
   GET SINGLE BEST SELLERS HERO BANNER
   Admin form
========================= */

router.get(
  "/",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBestSellersHeroBannerController.getBestSellersHeroBannerByType
);

/* =========================
   GET BANNER DETAILS BY UUID
========================= */

router.get(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBestSellersHeroBannerController.getBestSellersHeroBanner
);

/* =========================
   UPDATE BANNER STATUS
========================= */

router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminBestSellersHeroBannerController.updateBestSellersHeroBannerStatus
);

module.exports = router;
