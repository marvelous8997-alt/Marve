"use strict";

const {
  Product,
  ProductImage,
  ProductVariation,
  Category,
  Subcategory,
} = require("../../database/models");

/* ========================= Attributes ========================= */

// Product fields returned to the storefront
const PRODUCT_ATTRIBUTES = [
  "id",
  "uuid",
  "category_id",
  "subcategory_id",
  "name",
  "slug",
  "short_description",
  "description",
  "sku",
  "price",
  "compare_at_price",
  "height",
  "width",
  "length",
  "weight",
  "dimension_unit",
  "weight_unit",
  "stock",
  "video_url",
  "status",
  "featured",
  "is_new_arrival",
  "is_bestseller",
  "is_sale",
  "is_offer",
  "is_gift",
  "sort_order",
  "createdAt",
  "updatedAt",
];

// Product image fields
const PRODUCT_IMAGE_ATTRIBUTES = [
  "id",
  "uuid",
  "product_id",
  "image_url",
  "alt_text",
  "is_primary",
  "sort_order",
];

// Product variation fields
const PRODUCT_VARIATION_ATTRIBUTES = [
  "id",
  "uuid",
  "product_id",
  "name",
  "sku",
  "attributes",
  "price",
  "compare_at_price",
  "stock",
  "status",
  "sort_order",
];

// Category fields
const CATEGORY_ATTRIBUTES = [
  "id",
  "uuid",
  "name",
  "slug",
  "description",
  "image",
  "icon",
  "status",
];

// Subcategory fields
const SUBCATEGORY_ATTRIBUTES = [
  "id",
  "uuid",
  "category_id",
  "name",
  "slug",
  "description",
  "image",
  "icon",
  "status",
];

/* ========================= Includes ========================= */

// Reusable associations for storefront product queries
const PRODUCT_INCLUDES = [
  {
    model: ProductImage,
    as: "images",
    attributes: PRODUCT_IMAGE_ATTRIBUTES,
    required: false,
  },
  {
    model: ProductVariation,
    as: "variations",
    attributes: PRODUCT_VARIATION_ATTRIBUTES,
    required: false,
    where: {
      status: "ACTIVE",
    },
  },
  {
    model: Category,
    as: "category",
    attributes: CATEGORY_ATTRIBUTES,
    required: true,
    where: {
      status: "ACTIVE",
    },
  },
  {
    model: Subcategory,
    as: "subcategory",
    attributes: SUBCATEGORY_ATTRIBUTES,
    required: true,
    where: {
      status: "ACTIVE",
    },
  },
];

/* ========================= Helpers ========================= */

// Build the where clause for storefront product queries
const buildProductWhere = (filters = {}) => {
  const where = {
    status: "ACTIVE",
  };

  // Filter by product type
  const typeFilters = {
    featured: "featured",
    "new-arrivals": "is_new_arrival",
    "best-sellers": "is_bestseller",
    sale: "is_sale",
    offers: "is_offer",
    gifts: "is_gift",
  };

  if (filters.type && typeFilters[filters.type]) {
    where[typeFilters[filters.type]] = true;
  }

  // Filter by category ID
  if (filters.categoryId !== undefined && filters.categoryId !== null) {
    where.category_id = filters.categoryId;
  }

  // Filter by subcategory ID
  if (
    filters.subcategoryId !== undefined &&
    filters.subcategoryId !== null
  ) {
    where.subcategory_id = filters.subcategoryId;
  }

  // Filter by minimum price
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    const { Op } = require("sequelize");
    where.price = {
      ...(where.price || {}),
      [Op.gte]: filters.minPrice,
    };
  }

  // Filter by maximum price
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    const { Op } = require("sequelize");
    where.price = {
      ...(where.price || {}),
      [Op.lte]: filters.maxPrice,
    };
  }

  // Filter products with available stock
  if (filters.inStock === true || filters.inStock === "true") {
    const { Op } = require("sequelize");
    where.stock = {
      [Op.gt]: 0,
    };
  }

  // Filter by search term
  if (filters.search && String(filters.search).trim()) {
    const { Op } = require("sequelize");
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${String(filters.search).trim()}%`,
        },
      },
      {
        short_description: {
          [Op.like]: `%${String(filters.search).trim()}%`,
        },
      },
      {
        description: {
          [Op.like]: `%${String(filters.search).trim()}%`,
        },
      },
    ];
  }

  return where;
};

// Build a safe sorting configuration
const buildProductOrder = (sort = "featured") => {
  const { literal } = require("sequelize");

  const sortOptions = {
    featured: [
      ["featured", "DESC"],
      ["sort_order", "ASC"],
      ["createdAt", "DESC"],
    ],
    newest: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    "price-low-high": [
      ["price", "ASC"],
      ["id", "DESC"],
    ],
    "price-high-low": [
      ["price", "DESC"],
      ["id", "DESC"],
    ],
    name: [
      ["name", "ASC"],
      ["id", "ASC"],
    ],
    "best-selling": [
      ["is_bestseller", "DESC"],
      ["sort_order", "ASC"],
      ["createdAt", "DESC"],
    ],
    position: [
      ["sort_order", "ASC"],
      ["id", "ASC"],
    ],
  };

  return sortOptions[sort] || sortOptions.featured;
};

/* ========================= Get Products ========================= */

// Get active products with optional filters and pagination
const getActiveProducts = async (filters = {}) => {
  const where = buildProductWhere(filters);
  const order = buildProductOrder(filters.sort);

  const page = Math.max(1, Number.parseInt(filters.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(filters.limit, 10) || 12)
  );

  const offset = (page - 1) * limit;

  return await Product.findAndCountAll({
    where,
    attributes: PRODUCT_ATTRIBUTES,
    include: PRODUCT_INCLUDES,
    distinct: true,
    limit,
    offset,
    order,
  });
};

// Get all active products without pagination
const getAllActiveProducts = async (filters = {}) => {
  const where = buildProductWhere(filters);
  const order = buildProductOrder(filters.sort);

  return await Product.findAll({
    where,
    attributes: PRODUCT_ATTRIBUTES,
    include: PRODUCT_INCLUDES,
    distinct: true,
    order,
  });
};

// Get an active product by ID
const getActiveProductById = async (id) => {
  return await Product.findOne({
    where: {
      id,
      status: "ACTIVE",
    },
    attributes: PRODUCT_ATTRIBUTES,
    include: PRODUCT_INCLUDES,
  });
};

// Get an active product by slug
const getActiveProductBySlug = async (slug) => {
  return await Product.findOne({
    where: {
      slug,
      status: "ACTIVE",
    },
    attributes: PRODUCT_ATTRIBUTES,
    include: PRODUCT_INCLUDES,
  });
};

// Get active products by category ID
const getActiveProductsByCategoryId = async (categoryId, filters = {}) => {
  return await getActiveProducts({
    ...filters,
    categoryId,
  });
};

// Get active products by subcategory ID
const getActiveProductsBySubcategoryId = async (
  subcategoryId,
  filters = {}
) => {
  return await getActiveProducts({
    ...filters,
    subcategoryId,
  });
};

// Get new arrivals
const getNewArrivals = async (filters = {}) => {
  return await getActiveProducts({
    ...filters,
    type: "new-arrivals",
  });
};

// Get best sellers
const getBestSellers = async (filters = {}) => {
  return await getActiveProducts({
    ...filters,
    type: "best-sellers",
  });
};

// Get featured products
const getFeaturedProducts = async (filters = {}) => {
  return await getActiveProducts({
    ...filters,
    type: "featured",
  });
};

// Get sale products
const getSaleProducts = async (filters = {}) => {
  return await getActiveProducts({
    ...filters,
    type: "sale",
  });
};

// Get offer products
const getOfferProducts = async (filters = {}) => {
  return await getActiveProducts({
    ...filters,
    type: "offers",
  });
};

// Get gift products
const getGiftProducts = async (filters = {}) => {
  return await getActiveProducts({
    ...filters,
    type: "gifts",
  });
};

/* ========================= Exports ========================= */

module.exports = {
  getActiveProducts,
  getAllActiveProducts,
  getActiveProductById,
  getActiveProductBySlug,
  getActiveProductsByCategoryId,
  getActiveProductsBySubcategoryId,
  getNewArrivals,
  getBestSellers,
  getFeaturedProducts,
  getSaleProducts,
  getOfferProducts,
  getGiftProducts,
};