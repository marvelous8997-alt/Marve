
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminProductVariationService } = require("../../services");

const {
  createProductVariationSchema,
  bulkCreateProductVariationsSchema,
  updateProductVariationSchema,
  updateProductVariationStatusSchema,
} = require("../../validations/admin/productVariation.validation");

// =====================================================
// CREATE SINGLE PRODUCT VARIATION
// =====================================================

const createProductVariation = asyncHandler(async (req, res) => {
  const requestBody = {
    ...req.body,
    ...(req.params.productId
      ? { product_id: req.params.productId }
      : {}),
  };

  const { error, value } = createProductVariationSchema.validate(
    requestBody,
    {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    }
  );

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const variation =
    await adminProductVariationService.createProductVariation(
      value,
      req.user.id
    );

  return ResponseHelper.success(
    res,
    "Product variation created successfully.",
    variation,
    201
  );
});

// =====================================================
// CREATE MULTIPLE PRODUCT VARIATIONS
// =====================================================

const createProductVariations = asyncHandler(async (req, res) => {
  const requestBody = {
    ...req.body,
    ...(req.params.productId
      ? { product_id: req.params.productId }
      : {}),
  };

  const { error, value } = bulkCreateProductVariationsSchema.validate(
    requestBody,
    {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    }
  );

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const variations =
    await adminProductVariationService.createProductVariations(
      value,
      req.user.id
    );

  return ResponseHelper.success(
    res,
    "Product variations created successfully.",
    variations,
    201
  );
});

// =====================================================
// GET PRODUCT VARIATIONS LIST
// =====================================================

const getProductVariations = asyncHandler(async (req, res) => {
  const result =
    await adminProductVariationService.getProductVariations({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search || "",
      status: req.query.status,
      product_id:
        req.params.productId ??
        req.query.product_id ??
        req.query.productId,
      sortBy: req.query.sortBy || "sort_order",
      sortOrder: req.query.sortOrder || "ASC",
    });

  return ResponseHelper.success(
    res,
    "Product variations fetched successfully.",
    result
  );
});

// =====================================================
// GET PRODUCT VARIATION DETAILS
// =====================================================

const getProductVariation = asyncHandler(async (req, res) => {
  const variation =
    await adminProductVariationService.getProductVariation(
      req.params.uuid
    );

  return ResponseHelper.success(
    res,
    "Product variation fetched successfully.",
    variation
  );
});

// =====================================================
// UPDATE PRODUCT VARIATION
// =====================================================

const updateProductVariation = asyncHandler(async (req, res) => {
  const { error, value } = updateProductVariationSchema.validate(
    req.body,
    {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    }
  );

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const variation =
    await adminProductVariationService.updateProductVariation(
      req.params.uuid,
      value,
      req.user.id
    );

  return ResponseHelper.success(
    res,
    "Product variation updated successfully.",
    variation
  );
});

// =====================================================
// UPDATE PRODUCT VARIATION STATUS
// =====================================================

const updateProductVariationStatus = asyncHandler(
  async (req, res) => {
    const { error, value } =
      updateProductVariationStatusSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

    if (error) {
      return ResponseHelper.validationError(
        res,
        error.details.map((item) => item.message)
      );
    }

    const variation =
      await adminProductVariationService.updateProductVariationStatus(
        req.params.uuid,
        value.status,
        req.user.id
      );

    return ResponseHelper.success(
      res,
      "Product variation status updated successfully.",
      variation
    );
  }
);

// =====================================================
// DELETE PRODUCT VARIATION
// =====================================================

const deleteProductVariation = asyncHandler(async (req, res) => {
  await adminProductVariationService.deleteProductVariation(
    req.params.uuid
  );

  return ResponseHelper.success(
    res,
    "Product variation deleted successfully."
  );
});

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createProductVariation,
  createProductVariations,
  getProductVariations,
  getProductVariation,
  updateProductVariation,
  updateProductVariationStatus,
  deleteProductVariation,
};