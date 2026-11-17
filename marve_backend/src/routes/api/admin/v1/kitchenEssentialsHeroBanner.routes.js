
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminKitchenEssentialsHeroBannerController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

/* =========================
   SAVE SINGLE KITCHEN ESSENTIALS HERO BANNER
   Create if missing, otherwise update
========================= */

router.post(
  "/save",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("kitchen-essentials-hero-banner"),
  upload.single("image"),
  adminKitchenEssentialsHeroBannerController
    .saveKitchenEssentialsHeroBanner
);

/* =========================
   GET SINGLE KITCHEN ESSENTIALS HERO BANNER
   Admin form
========================= */

router.get(
  "/",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminKitchenEssentialsHeroBannerController
    .getKitchenEssentialsHeroBannerByType
);

/* =========================
   GET BANNER DETAILS BY UUID
========================= */

router.get(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminKitchenEssentialsHeroBannerController
    .getKitchenEssentialsHeroBanner
);

/* =========================
   UPDATE BANNER STATUS
========================= */

router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminKitchenEssentialsHeroBannerController
    .updateKitchenEssentialsHeroBannerStatus
);

module.exports = router;
