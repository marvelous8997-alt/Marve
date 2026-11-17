"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { userProductService } = require("../../services");

/* ========================= GET ALL ACTIVE PRODUCTS ========================= */

const getProducts = asyncHandler(async (req, res) => {
  const filters = {};

  const allowedQueryParams = [
    "type",
    "categoryId",
    "subcategoryId",
    "page",
    "limit",
    "sort",
    "minPrice",
    "maxPrice",
    "search",
    "inStock",
  ];

  allowedQueryParams.forEach((key) => {
    if (req.query[key] !== undefined) {
      filters[key] = req.query[key];
    }
  });

  const result = await userProductService.getProducts(filters);

  return ResponseHelper.success(
    res,
    "Products fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

/* ========================= GET ACTIVE PRODUCT BY ID ========================= */

const getProductById = asyncHandler(async (req, res) => {
  const product = await userProductService.getProductById(req.params.id);

  return ResponseHelper.success(
    res,
    "Product fetched successfully.",
    product
  );
});

/* ========================= GET ACTIVE PRODUCT BY SLUG ========================= */

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await userProductService.getProductBySlug(req.params.slug);

  return ResponseHelper.success(
    res,
    "Product fetched successfully.",
    product
  );
});

/* ========================= GET PRODUCTS BY CATEGORY ID ========================= */

const getProductsByCategoryId = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    type: req.query.type,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    search: req.query.search,
    inStock: req.query.inStock,
  };

  const result = await userProductService.getProductsByCategoryId(
    req.params.categoryId,
    filters
  );

  return ResponseHelper.success(
    res,
    "Category products fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

/* ========================= GET PRODUCTS BY SUBCATEGORY ID ========================= */

const getProductsBySubcategoryId = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    type: req.query.type,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    search: req.query.search,
    inStock: req.query.inStock,
  };

  const result = await userProductService.getProductsBySubcategoryId(
    req.params.subcategoryId,
    filters
  );

  return ResponseHelper.success(
    res,
    "Subcategory products fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

/* ========================= PRODUCT SECTIONS ========================= */

// New Arrivals
const getNewArrivals = asyncHandler(async (req, res) => {
  const result = await userProductService.getNewArrivals(req.query);

  return ResponseHelper.success(
    res,
    "New arrivals fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

// Best Sellers
const getBestSellers = asyncHandler(async (req, res) => {
  const result = await userProductService.getBestSellers(req.query);

  return ResponseHelper.success(
    res,
    "Best sellers fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

// Featured Products
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const result = await userProductService.getFeaturedProducts(req.query);

  return ResponseHelper.success(
    res,
    "Featured products fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

// Sale Products
const getSaleProducts = asyncHandler(async (req, res) => {
  const result = await userProductService.getSaleProducts(req.query);

  return ResponseHelper.success(
    res,
    "Sale products fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

// Offer Products
const getOfferProducts = asyncHandler(async (req, res) => {
  const result = await userProductService.getOfferProducts(req.query);

  return ResponseHelper.success(
    res,
    "Offer products fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

// Gift Products
const getGiftProducts = asyncHandler(async (req, res) => {
  const result = await userProductService.getGiftProducts(req.query);

  return ResponseHelper.success(
    res,
    "Gift products fetched successfully.",
    {
      products: result.products,
      pagination: result.pagination,
    }
  );
});

/* ========================= EXPORTS ========================= */

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategoryId,
  getProductsBySubcategoryId,
  getNewArrivals,
  getBestSellers,
  getFeaturedProducts,
  getSaleProducts,
  getOfferProducts,
  getGiftProducts,
};