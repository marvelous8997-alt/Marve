
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminHomeEssentialsHeroBannerController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

/* =========================
   SAVE SINGLE HOME ESSENTIALS HERO BANNER
   Create if missing, otherwise update
========================= */

router.post(
  "/save",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("home-essentials-hero-banner"),
  upload.single("image"),
  adminHomeEssentialsHeroBannerController.saveHomeEssentialsHeroBanner
);

/* =========================
   GET SINGLE HOME ESSENTIALS HERO BANNER
   Admin form
========================= */

router.get(
  "/",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeEssentialsHeroBannerController.getHomeEssentialsHeroBannerByType
);

/* =========================
   GET BANNER DETAILS BY UUID
========================= */

router.get(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeEssentialsHeroBannerController.getHomeEssentialsHeroBanner
);

/* =========================
   UPDATE BANNER STATUS
========================= */

router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeEssentialsHeroBannerController.updateHomeEssentialsHeroBannerStatus
);

module.exports = router;
