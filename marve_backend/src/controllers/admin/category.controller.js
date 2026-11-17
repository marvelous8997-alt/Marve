"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { adminCategoryService } = require("../../services");
const { createCategorySchema, updateCategorySchema } = require("../../validations/admin/category.validation");

// CREATE CATEGORY
const createCategory = asyncHandler(async (req, res) => {
  const { error, value } = createCategorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }
  const category = await adminCategoryService.createCategory(
    value,
    req.file,
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Category created successfully.",
    category,
    201
  );
});

// GET CATEGORY LIST
const getCategories = asyncHandler(async (req, res) => {
  const result = await adminCategoryService.getCategories({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
    status: req.query.status,
    sortBy: req.query.sortBy || "sort_order",
    sortOrder: req.query.sortOrder || "ASC",
  });
  return ResponseHelper.success(
    res,
    "Categories fetched successfully.",
    result
  );
});

// GET CATEGORY DETAILS
const getCategory = asyncHandler(async (req, res) => {
  const category = await adminCategoryService.getCategory(req.params.uuid);
  return ResponseHelper.success(
    res,
    "Category fetched successfully.",
    category
  );
});

// UPDATE CATEGORY
const updateCategory = asyncHandler(async (req, res) => {
  const { error, value } = updateCategorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }
  const category = await adminCategoryService.updateCategory(
    req.params.uuid,
    value,
    req.file,
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Category updated successfully.",
    category
  );
});

// UPDATE CATEGORY STATUS
const updateCategoryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    return ResponseHelper.error(
      res,
      "Invalid status value.",
      null,
      422
    );
  }
  const category = await adminCategoryService.updateCategoryStatus(
    req.params.uuid,
    status,
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Category status updated successfully.",
    category
  );
});

// DELETE CATEGORY
const deleteCategory = asyncHandler(async (req, res) => {
  await adminCategoryService.deleteCategory(req.params.uuid);
  return ResponseHelper.success(
    res,
    "Category deleted successfully."
  );
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};
