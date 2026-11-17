"use strict";

const express = require("express");
const router = express.Router();

const {
  adminNewArrivalsHeroBannerController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

/* =========================
   SAVE SINGLE NEW ARRIVALS HERO BANNER
   Create if missing, otherwise update
========================= */

router.post(
  "/save",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("new-arrivals-hero-banner"),
  upload.single("image"),
  adminNewArrivalsHeroBannerController.saveNewArrivalsHeroBanner
);

/* =========================
   GET SINGLE NEW ARRIVALS HERO BANNER
   Admin form
========================= */

router.get(
  "/",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminNewArrivalsHeroBannerController.getNewArrivalsHeroBannerByType
);

/* =========================
   GET BANNER DETAILS BY UUID
========================= */

router.get(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminNewArrivalsHeroBannerController.getNewArrivalsHeroBanner
);

/* =========================
   UPDATE BANNER STATUS
========================= */

router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminNewArrivalsHeroBannerController.updateNewArrivalsHeroBannerStatus
);

module.exports = router;