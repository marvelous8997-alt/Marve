
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { userSubcategoryService } = require("../../services");

// GET ALL ACTIVE SUBCATEGORIES
const getSubcategories = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.categoryId) {
    filters.categoryId = req.query.categoryId;
  }

  const subcategories =
    await userSubcategoryService.getSubcategories(filters);

  return ResponseHelper.success(
    res,
    "Subcategories fetched successfully.",
    subcategories
  );
});

// GET ACTIVE SUBCATEGORY DETAILS BY ID
const getSubcategoryById = asyncHandler(async (req, res) => {
  const subcategory =
    await userSubcategoryService.getSubcategoryById(req.params.id);

  return ResponseHelper.success(
    res,
    "Subcategory fetched successfully.",
    subcategory
  );
});

// GET ACTIVE SUBCATEGORIES BY CATEGORY ID
const getSubcategoriesByCategoryId = asyncHandler(async (req, res) => {
  const subcategories =
    await userSubcategoryService.getSubcategoriesByCategoryId(
      req.params.categoryId
    );

  return ResponseHelper.success(
    res,
    "Subcategories fetched successfully.",
    subcategories
  );
});

module.exports = {
  getSubcategories,
  getSubcategoryById,
  getSubcategoriesByCategoryId,
};
