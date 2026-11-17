
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminFavouriteController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

/* ========================= GET FAVOURITES LIST ========================= */

router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminFavouriteController.getFavourites
);

/* ========================= GET FAVOURITE DETAILS ========================= */

router.get(
  "/list/:identifier",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminFavouriteController.getFavourite
);

module.exports = router;
