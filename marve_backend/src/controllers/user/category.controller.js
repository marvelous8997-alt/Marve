"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { userCategoryService } = require("../../services");

// GET ALL ACTIVE CATEGORIES
const getCategories = asyncHandler(async (req, res) => {
  const categories = await userCategoryService.getCategories();

  return ResponseHelper.success(
    res,
    "Categories fetched successfully.",
    categories
  );
});

// GET ACTIVE CATEGORY DETAILS BY ID
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await userCategoryService.getCategoryById(
    req.params.id
  );

  return ResponseHelper.success(
    res,
    "Category fetched successfully.",
    category
  );
});

module.exports = {
  getCategories,
  getCategoryById,
};