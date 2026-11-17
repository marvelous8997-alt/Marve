"use strict";

const { userProductRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= Helpers ========================= */

// Validate positive integer query parameters
const parsePositiveInteger = (value, fieldName, defaultValue) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const parsedValue = Number(value);

  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    throw new ApiError(400, `${fieldName} must be a positive integer.`);
  }

  return parsedValue;
};

// Validate non-negative price filters
const parsePrice = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw new ApiError(400, `${fieldName} must be a valid non-negative number.`);
  }

  return parsedValue;
};

// Normalize storefront filters
const normalizeProductFilters = (filters = {}) => {
  const allowedTypes = [
    "featured",
    "new-arrivals",
    "best-sellers",
    "sale",
    "offers",
    "gifts",
  ];

  const allowedSortOptions = [
    "featured",
    "newest",
    "price-low-high",
    "price-high-low",
    "name",
    "best-selling",
    "position",
  ];

  const type = filters.type || undefined;
  const sort = filters.sort || "featured";

  if (type && !allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid product type.");
  }

  if (!allowedSortOptions.includes(sort)) {
    throw new ApiError(400, "Invalid product sorting option.");
  }

  const minPrice = parsePrice(filters.minPrice, "minPrice");
  const maxPrice = parsePrice(filters.maxPrice, "maxPrice");

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice > maxPrice
  ) {
    throw new ApiError(400, "minPrice cannot be greater than maxPrice.");
  }

  const normalized = {
    type,
    sort,
    page: parsePositiveInteger(filters.page, "page", 1),
    limit: parsePositiveInteger(filters.limit, "limit", 12),
    categoryId: parsePositiveInteger(
      filters.categoryId,
      "categoryId",
      undefined
    ),
    subcategoryId: parsePositiveInteger(
      filters.subcategoryId,
      "subcategoryId",
      undefined
    ),
    minPrice,
    maxPrice,
    search:
      typeof filters.search === "string" ? filters.search.trim() : undefined,
    inStock: filters.inStock === true || filters.inStock === "true",
  };

  // Keep pagination within the repository's maximum limit.
  normalized.limit = Math.min(normalized.limit, 100);

  return normalized;
};

/* ========================= GET ALL ACTIVE PRODUCTS ========================= */

const getProducts = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters(filters);

    const result = await userProductRepository.getActiveProducts(
      normalizedFilters
    );

    const products = result.rows.map((product) => product.toJSON());

    return {
      products,
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get products service error: ${error.message}`);
    throw error;
  }
};

/* ========================= GET ALL ACTIVE PRODUCTS WITHOUT PAGINATION ========================= */

const getAllProducts = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters(filters);

    const products = await userProductRepository.getAllActiveProducts(
      normalizedFilters
    );

    return products.map((product) => product.toJSON());
  } catch (error) {
    logger.error(`Get all products service error: ${error.message}`);
    throw error;
  }
};

/* ========================= GET ACTIVE PRODUCT BY ID ========================= */

const getProductById = async (id) => {
  try {
    const productId = parsePositiveInteger(id, "Product ID");

    const product = await userProductRepository.getActiveProductById(
      productId
    );

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    return product.toJSON();
  } catch (error) {
    logger.error(`Get product by ID service error: ${error.message}`);
    throw error;
  }
};

/* ========================= GET ACTIVE PRODUCT BY SLUG ========================= */

const getProductBySlug = async (slug) => {
  try {
    if (typeof slug !== "string" || !slug.trim()) {
      throw new ApiError(400, "Product slug is required.");
    }

    const product = await userProductRepository.getActiveProductBySlug(
      slug.trim()
    );

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    return product.toJSON();
  } catch (error) {
    logger.error(`Get product by slug service error: ${error.message}`);
    throw error;
  }
};

/* ========================= GET PRODUCTS BY CATEGORY ========================= */

const getProductsByCategoryId = async (categoryId, filters = {}) => {
  try {
    const parsedCategoryId = parsePositiveInteger(
      categoryId,
      "Category ID"
    );

    const normalizedFilters = normalizeProductFilters(filters);

    const result = await userProductRepository.getActiveProductsByCategoryId(
      parsedCategoryId,
      normalizedFilters
    );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get products by category service error: ${error.message}`);
    throw error;
  }
};

/* ========================= GET PRODUCTS BY SUBCATEGORY ========================= */

const getProductsBySubcategoryId = async (
  subcategoryId,
  filters = {}
) => {
  try {
    const parsedSubcategoryId = parsePositiveInteger(
      subcategoryId,
      "Subcategory ID"
    );

    const normalizedFilters = normalizeProductFilters(filters);

    const result =
      await userProductRepository.getActiveProductsBySubcategoryId(
        parsedSubcategoryId,
        normalizedFilters
      );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(
      `Get products by subcategory service error: ${error.message}`
    );
    throw error;
  }
};

/* ========================= PRODUCT SECTIONS ========================= */

// New Arrivals
const getNewArrivals = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters({
      ...filters,
      type: "new-arrivals",
    });

    const result = await userProductRepository.getNewArrivals(
      normalizedFilters
    );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get new arrivals service error: ${error.message}`);
    throw error;
  }
};

// Best Sellers
const getBestSellers = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters({
      ...filters,
      type: "best-sellers",
    });

    const result = await userProductRepository.getBestSellers(
      normalizedFilters
    );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get best sellers service error: ${error.message}`);
    throw error;
  }
};

// Featured Products
const getFeaturedProducts = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters({
      ...filters,
      type: "featured",
    });

    const result = await userProductRepository.getFeaturedProducts(
      normalizedFilters
    );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get featured products service error: ${error.message}`);
    throw error;
  }
};

// Sale Products
const getSaleProducts = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters({
      ...filters,
      type: "sale",
    });

    const result = await userProductRepository.getSaleProducts(
      normalizedFilters
    );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get sale products service error: ${error.message}`);
    throw error;
  }
};

// Offer Products
const getOfferProducts = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters({
      ...filters,
      type: "offers",
    });

    const result = await userProductRepository.getOfferProducts(
      normalizedFilters
    );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get offer products service error: ${error.message}`);
    throw error;
  }
};

// Gift Products
const getGiftProducts = async (filters = {}) => {
  try {
    const normalizedFilters = normalizeProductFilters({
      ...filters,
      type: "gifts",
    });

    const result = await userProductRepository.getGiftProducts(
      normalizedFilters
    );

    return {
      products: result.rows.map((product) => product.toJSON()),
      pagination: {
        total: result.count,
        page: normalizedFilters.page,
        limit: normalizedFilters.limit,
        totalPages: Math.ceil(result.count / normalizedFilters.limit),
      },
    };
  } catch (error) {
    logger.error(`Get gift products service error: ${error.message}`);
    throw error;
  }
};

/* ========================= EXPORTS ========================= */

module.exports = {
  getProducts,
  getAllProducts,
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