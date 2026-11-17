"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { adminSubcategoryService } = require("../../services");
const {
  createSubcategorySchema,
  updateSubcategorySchema,
} = require("../../validations/admin/subcategory.validation");

// CREATE SUBCATEGORY
const createSubcategory = asyncHandler(async (req, res) => {
  const { error, value } = createSubcategorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }
  const subcategory = await adminSubcategoryService.createSubcategory(
    value,
    req.file,
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Subcategory created successfully.",
    subcategory,
    201
  );
});

// GET SUBCATEGORY LIST
const getSubcategories = asyncHandler(async (req, res) => {
  const result = await adminSubcategoryService.getSubcategories({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
    status: req.query.status,
    categoryId: req.query.category_id ?? req.query.categoryId,
    sortBy: req.query.sortBy || "sort_order",
    sortOrder: req.query.sortOrder || "ASC",
  });
  return ResponseHelper.success(
    res,
    "Subcategories fetched successfully.",
    result
  );
});

// GET SUBCATEGORY DETAILS
const getSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await adminSubcategoryService.getSubcategory(
    req.params.uuid
  );
  return ResponseHelper.success(
    res,
    "Subcategory fetched successfully.",
    subcategory
  );
});

// UPDATE SUBCATEGORY
const updateSubcategory = asyncHandler(async (req, res) => {
  const { error, value } = updateSubcategorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }
  const subcategory = await adminSubcategoryService.updateSubcategory(
    req.params.uuid,
    value,
    req.file,
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Subcategory updated successfully.",
    subcategory
  );
});

// UPDATE SUBCATEGORY STATUS
const updateSubcategoryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    return ResponseHelper.error(
      res,
      "Invalid status value.",
      null,
      422
    );
  }
  const subcategory =
    await adminSubcategoryService.updateSubcategoryStatus(
      req.params.uuid,
      status,
      req.user.id
    );
  return ResponseHelper.success(
    res,
    "Subcategory status updated successfully.",
    subcategory
  );
});

// DELETE SUBCATEGORY
const deleteSubcategory = asyncHandler(async (req, res) => {
  await adminSubcategoryService.deleteSubcategory(req.params.uuid);
  return ResponseHelper.success(
    res,
    "Subcategory deleted successfully."
  );
});

const getActiveCategoriesForDropdown = async (req, res, next) => {
  try {
    const categories =
      await adminSubcategoryService.getActiveCategoriesForDropdown();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  updateSubcategoryStatus,
  deleteSubcategory,
  getActiveCategoriesForDropdown
};