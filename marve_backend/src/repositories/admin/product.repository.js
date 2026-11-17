"use strict";

const { Op } = require("sequelize");

const {
  Product,
  Category,
  Subcategory,
  ProductImage,
  Admin,
} = require("../../database/models");

// Create Product
const createProduct = async (payload, transaction) => {
  return await Product.create(payload, {
    transaction,
  });
};

// Find Product By ID
const findById = async (id) => {
  return await Product.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "uuid", "name", "slug", "status"],
      },
      {
        model: Subcategory,
        as: "subcategory",
        attributes: ["id", "uuid", "name", "slug", "status"],
      },
      {
        model: ProductImage,
        as: "images",
        attributes: [
          "id",
          "uuid",
          "product_id",
          "image_url",
          "alt_text",
          "is_primary",
          "sort_order",
        ],
        separate: true,
        order: [
          ["sort_order", "ASC"],
          ["id", "ASC"],
        ],
      },
    ],
  });
};

// Find Product By UUID
const findByUuid = async (uuid) => {
  return await Product.findOne({
    where: { uuid },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "uuid", "name", "slug", "status"],
      },
      {
        model: Subcategory,
        as: "subcategory",
        attributes: ["id", "uuid", "name", "slug", "status"],
      },
      {
        model: ProductImage,
        as: "images",
        attributes: [
          "id",
          "uuid",
          "product_id",
          "image_url",
          "alt_text",
          "is_primary",
          "sort_order",
        ],
        separate: true,
        order: [
          ["sort_order", "ASC"],
          ["id", "ASC"],
        ],
      },
    ],
  });
};

// Find Product By Name
const findByName = async (name, categoryId = null) => {
  const where = { name };

  if (categoryId !== null) {
    where.category_id = categoryId;
  }

  return await Product.findOne({
    where,
  });
};

// Find Product By Slug
const findBySlug = async (slug) => {
  return await Product.findOne({
    where: { slug },
  });
};

// Find Product By SKU
const findBySku = async (sku) => {
  if (!sku) {
    return null;
  }

  return await Product.findOne({
    where: { sku },
  });
};

// Update Product
const updateProduct = async (product, payload, transaction) => {
  return await product.update(payload, {
    transaction,
  });
};

// Update Product Status
const updateProductStatus = async (uuid, status, userId) => {
  const product = await Product.findOne({
    where: { uuid },
  });

  if (!product) {
    return null;
  }

  return await product.update({
    status,
    updated_by: userId,
  });
};

// Delete Product
const deleteProduct = async (product, transaction) => {
  return await product.destroy({
    transaction,
  });
};

// Get Products
const getProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  categoryId,
  subcategoryId,
  featured,
  isNewArrival,
  isBestseller,
  isSale,
  isOffer,
  isGift,
  sortBy = "sort_order",
  sortOrder = "ASC",
}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;
  const where = {};

  // Search by product name, slug, SKU, or UUID
  const searchTerm = String(search || "").trim();

  if (searchTerm) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        slug: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        sku: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        uuid: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    ];
  }

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Filter by category
  if (
    categoryId !== undefined &&
    categoryId !== null &&
    categoryId !== ""
  ) {
    where.category_id = categoryId;
  }

  // Filter by subcategory
  if (
    subcategoryId !== undefined &&
    subcategoryId !== null &&
    subcategoryId !== ""
  ) {
    where.subcategory_id = subcategoryId;
  }

  // Filter by boolean flags
  const booleanFilters = {
    featured,
    is_new_arrival: isNewArrival,
    is_bestseller: isBestseller,
    is_sale: isSale,
    is_offer: isOffer,
    is_gift: isGift,
  };

  for (const [field, value] of Object.entries(booleanFilters)) {
    if (value !== undefined && value !== null && value !== "") {
      where[field] =
        value === true ||
        value === "true" ||
        value === 1 ||
        value === "1";
    }
  }

  // Allow only approved sorting fields
  const allowedSortFields = [
    "name",
    "price",
    "stock",
    "height",
    "width",
    "length",
    "weight",
    "status",
    "sort_order",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "sort_order";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

  const result = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "uuid", "name", "slug"],
        required: false,
      },
      {
        model: Subcategory,
        as: "subcategory",
        attributes: ["id", "uuid", "name", "slug"],
        required: false,
      },
      {
        model: ProductImage,
        as: "images",
        attributes: [
          "id",
          "uuid",
          "image_url",
          "alt_text",
          "is_primary",
          "sort_order",
        ],
        required: false,
      },
    ],
    distinct: true,
    col: "id",
    offset,
    limit,
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
  });

  return {
    count: result.count,
    rows: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  };
};

module.exports = {
  createProduct,
  findById,
  findByUuid,
  findByName,
  findBySlug,
  findBySku,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getProducts,
};