
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const {
  adminFavouriteService,
} = require("../../services");

/* ========================= GET FAVOURITES LIST ========================= */

const getFavourites = asyncHandler(async (req, res) => {
  const result = await adminFavouriteService.getFavourites({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 8,
    search: req.query.search || "",
    category: req.query.category || undefined,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "DESC",
  });

  return ResponseHelper.success(
    res,
    "Favourites fetched successfully.",
    result
  );
});

/* ========================= GET FAVOURITE DETAILS ========================= */

const getFavourite = asyncHandler(async (req, res) => {
  const favourite =
    await adminFavouriteService.getFavourite(
      req.params.identifier
    );

  return ResponseHelper.success(
    res,
    "Favourite fetched successfully.",
    favourite
  );
});

/* ========================= EXPORTS ========================= */

module.exports = {
  getFavourites,
  getFavourite,
};
