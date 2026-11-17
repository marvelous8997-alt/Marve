
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminHomeHeroBannerController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

/* =========================
   SAVE SINGLE HOME HERO BANNER
   Create if missing, otherwise update
========================= */

router.post(
  "/save",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("home-hero-banner"),
  upload.single("image"),
  adminHomeHeroBannerController.saveHomeHeroBanner
);

/* =========================
   GET SINGLE HOME HERO BANNER
   Admin form
========================= */

router.get(
  "/",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeHeroBannerController.getHomeHeroBannerByType
);

/* =========================
   GET BANNER DETAILS BY UUID
========================= */

router.get(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeHeroBannerController.getHomeHeroBanner
);

/* =========================
   UPDATE BANNER STATUS
========================= */

router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeHeroBannerController.updateHomeHeroBannerStatus
);

module.exports = router;
