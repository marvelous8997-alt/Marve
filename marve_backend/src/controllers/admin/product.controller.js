"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { adminProductService } = require("../../services");
const {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
} = require("../../validations/admin/product.validation");

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const { error, value } = createProductSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }
  const product = await adminProductService.createProduct(
    value,
    req.files || {},
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Product created successfully.",
    product,
    201
  );
});

// GET PRODUCT LIST
const getProducts = asyncHandler(async (req, res) => {
  const result = await adminProductService.getProducts({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
    status: req.query.status,
    categoryId: req.query.category_id ?? req.query.categoryId,
    subcategoryId: req.query.subcategory_id ?? req.query.subcategoryId,
    featured: req.query.featured,
    isNewArrival: req.query.is_new_arrival ?? req.query.isNewArrival,
    isBestseller: req.query.is_bestseller ?? req.query.isBestseller,
    isSale: req.query.is_sale ?? req.query.isSale,
    isOffer: req.query.is_offer ?? req.query.isOffer,
    isGift: req.query.is_gift ?? req.query.isGift,
    sortBy: req.query.sortBy || "sort_order",
    sortOrder: req.query.sortOrder || "ASC",
  });
  return ResponseHelper.success(
    res,
    "Products fetched successfully.",
    result
  );
});

// GET PRODUCT DETAILS
const getProduct = asyncHandler(async (req, res) => {
  const product = await adminProductService.getProduct(
    req.params.uuid
  );
  return ResponseHelper.success(
    res,
    "Product fetched successfully.",
    product
  );
});

// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  const { error, value } = updateProductSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }
  const product = await adminProductService.updateProduct(
    req.params.uuid,
    value,
    req.files || {},
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Product updated successfully.",
    product
  );
});

// UPDATE PRODUCT STATUS
const updateProductStatus = asyncHandler(async (req, res) => {
  const { error, value } = updateProductStatusSchema.validate(
    req.body,
    {
      abortEarly: false,
      stripUnknown: true,
    }
  );
  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }
  const product = await adminProductService.updateProductStatus(
    req.params.uuid,
    value.status,
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Product status updated successfully.",
    product
  );
});

// REMOVE PRODUCT VIDEO
const removeProductVideo = asyncHandler(async (req, res) => {
  const product = await adminProductService.removeProductVideo(
    req.params.uuid,
    req.user.id
  );
  return ResponseHelper.success(
    res,
    "Product video removed successfully.",
    product
  );
});

// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  await adminProductService.deleteProduct(req.params.uuid);
  return ResponseHelper.success(
    res,
    "Product deleted successfully."
  );
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateProductStatus,
  removeProductVideo,
  deleteProduct,
};