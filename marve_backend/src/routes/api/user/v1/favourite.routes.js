"use strict";

const express = require("express");
const router = express.Router();

const {
  userFavouriteController,
} = require("../../../../../src/controllers/index");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= USER FAVOURITES ========================= */

// GET ALL FAVOURITES FOR LOGGED-IN USER
// GET /api/user/favourites
router.get(
  "/",
  authenticate,
  userFavouriteController.getFavourites
);

// ADD PRODUCT TO FAVOURITES
// POST /api/user/favourites
// Body: { "productId": 1 }
router.post(
  "/",
  authenticate,
  userFavouriteController.addFavourite
);

// CHECK WHETHER PRODUCT IS A FAVOURITE
// GET /api/user/favourites/:productId
router.get(
  "/:productId",
  authenticate,
  userFavouriteController.checkFavourite
);

// REMOVE PRODUCT FROM FAVOURITES
// DELETE /api/user/favourites/:productId
router.delete(
  "/:productId",
  authenticate,
  userFavouriteController.removeFavourite
);

/* ========================= EXPORTS ========================= */

module.exports = router;