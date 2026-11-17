
"use strict";

const express = require("express");
const router = express.Router();

const {
  userOfferController,
} = require("../../../../../src/controllers/index");

/* ========================= USER OFFERS ========================= */

// GET ALL ACTIVE DISCOUNT AND BOGO OFFERS
// GET /api/user/offers
router.get(
  "/",
  userOfferController.getOffers
);

// GET ACTIVE OFFER DETAILS BY TYPE AND UUID
// GET /api/user/offers/:type/:uuid
router.get(
  "/:type/:uuid",
  userOfferController.getOfferDetails
);

module.exports = router;
