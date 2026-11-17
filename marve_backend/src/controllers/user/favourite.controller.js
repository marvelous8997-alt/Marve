"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { userFavouriteService } = require("../../services");

// GET ALL FAVOURITES FOR LOGGED-IN USER
const getFavourites = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const favourites =
    await userFavouriteService.getFavourites(userId);

  return ResponseHelper.success(
    res,
    "Favourites fetched successfully.",
    favourites
  );
});

// ADD PRODUCT TO FAVOURITES
const addFavourite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const favourite = await userFavouriteService.addFavourite(
    userId,
    productId
  );

  return ResponseHelper.success(
    res,
    "Product added to favourites successfully.",
    favourite,
    201
  );
});

// REMOVE PRODUCT FROM FAVOURITES
const removeFavourite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const result = await userFavouriteService.removeFavourite(
    userId,
    productId
  );

  return ResponseHelper.success(
    res,
    "Product removed from favourites successfully.",
    result
  );
});

// CHECK WHETHER PRODUCT IS A FAVOURITE
const checkFavourite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const result = await userFavouriteService.checkFavourite(
    userId,
    productId
  );

  return ResponseHelper.success(
    res,
    "Favourite status fetched successfully.",
    result
  );
});

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
  checkFavourite,
};