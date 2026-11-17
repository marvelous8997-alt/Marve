
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminHomeCouponBannerController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

/* =========================
   SAVE SINGLE HOME COUPON BANNER
   Create if missing, otherwise update
========================= */

router.post(
  "/save",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("home-coupon-banner"),
  upload.single("image"),
  adminHomeCouponBannerController.saveHomeCouponBanner
);

/* =========================
   GET SINGLE HOME COUPON BANNER
   Admin form
========================= */

router.get(
  "/",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeCouponBannerController.getHomeCouponBannerByType
);

/* =========================
   GET BANNER DETAILS BY UUID
========================= */

router.get(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeCouponBannerController.getHomeCouponBanner
);

/* =========================
   UPDATE BANNER STATUS
========================= */

router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminHomeCouponBannerController.updateHomeCouponBannerStatus
);

module.exports = router;
