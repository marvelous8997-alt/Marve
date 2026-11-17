"use strict";

const { Op } = require("sequelize");

const {
  ProductVariation,
  Product,
  Admin,
} = require("../../database/models");

// =====================================================
// INCLUDE HELPERS
// =====================================================

const productInclude = {
  model: Product,
  as: "product",
  attributes: [
    "id",
    "uuid",
    "name",
    "slug",
    "sku",
    "category_id",
    "subcategory_id",
  ],
  required: false,
};

const adminIncludes = [
  {
    model: Admin,
    as: "createdBy",
    attributes: ["id"],
    required: false,
  },
  {
    model: Admin,
    as: "updatedBy",
    attributes: ["id"],
    required: false,
  },
];

// =====================================================
// CREATE SINGLE PRODUCT VARIATION
// =====================================================

const createProductVariation = async (payload, transaction) => {
  return ProductVariation.create(payload, {
    transaction,
  });
};

// =====================================================
// CREATE MULTIPLE PRODUCT VARIATIONS
// =====================================================

const bulkCreateProductVariations = async (
  payloads,
  transaction
) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new Error(
      "At least one product variation is required."
    );
  }

  return ProductVariation.bulkCreate(payloads, {
    transaction,
    validate: true,
    individualHooks: true,
  });
};

// =====================================================
// FIND VARIATION BY ID
// =====================================================

const findById = async (id, transaction) => {
  return ProductVariation.findByPk(id, {
    include: [productInclude, ...adminIncludes],
    transaction,
  });
};

// =====================================================
// FIND VARIATION BY UUID
// =====================================================

const findByUuid = async (uuid, transaction) => {
  return ProductVariation.findOne({
    where: { uuid },
    include: [productInclude, ...adminIncludes],
    transaction,
  });
};

// =====================================================
// FIND VARIATION BY SKU
// =====================================================

const findBySku = async (
  sku,
  excludeId = null,
  transaction
) => {
  if (!sku) {
    return null;
  }

  const where = { sku };

  if (excludeId !== null && excludeId !== undefined) {
    where.id = {
      [Op.ne]: excludeId,
    };
  }

  return ProductVariation.findOne({
    where,
    transaction,
  });
};

// =====================================================
// FIND VARIATION BY PRODUCT AND NAME
// =====================================================

const findByName = async (
  name,
  productId,
  excludeId = null,
  transaction
) => {
  if (
    !name ||
    productId === undefined ||
    productId === null
  ) {
    return null;
  }

  const where = {
    name,
    product_id: productId,
  };

  if (excludeId !== null && excludeId !== undefined) {
    where.id = {
      [Op.ne]: excludeId,
    };
  }

  return ProductVariation.findOne({
    where,
    transaction,
  });
};

// =====================================================
// UPDATE PRODUCT VARIATION
// =====================================================

const updateProductVariation = async (
  variation,
  payload,
  transaction
) => {
  return variation.update(payload, {
    transaction,
  });
};

// =====================================================
// UPDATE VARIATION STATUS
// =====================================================

const updateProductVariationStatus = async (
  uuid,
  status,
  userId,
  transaction
) => {
  const variation = await ProductVariation.findOne({
    where: { uuid },
    transaction,
  });

  if (!variation) {
    return null;
  }

  return variation.update(
    {
      status,
      updated_by: userId,
    },
    { transaction }
  );
};

// =====================================================
// DELETE PRODUCT VARIATION
// =====================================================

const deleteProductVariation = async (
  variation,
  transaction
) => {
  return variation.destroy({
    transaction,
  });
};

// =====================================================
// GET ALL VARIATIONS FOR A PRODUCT
// =====================================================

const findByProductId = async (
  productId,
  transaction
) => {
  return ProductVariation.findAll({
    where: {
      product_id: productId,
    },
    include: [productInclude],
    order: [
      ["sort_order", "ASC"],
      ["id", "DESC"],
    ],
    transaction,
  });
};

// =====================================================
// GET PRODUCT VARIATIONS WITH SEARCH AND PAGINATION
// =====================================================

const getProductVariations = async (
  {
    productId,
    page = 1,
    limit = 8,
    search = "",
    status,
    sortBy = "sort_order",
    sortOrder = "ASC",
  } = {},
  transaction
) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.min(
    100,
    Math.max(1, Number(limit) || 8)
  );

  const offset = (page - 1) * limit;
  const where = {};

  if (
    productId !== undefined &&
    productId !== null &&
    productId !== ""
  ) {
    where.product_id = productId;
  }

  const searchTerm = String(search || "").trim();

  if (searchTerm) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        sku: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    ];
  }

  if (
    status !== undefined &&
    status !== null &&
    status !== "" &&
    status !== "ALL"
  ) {
    where.status = status;
  }

  const allowedSortFields = [
    "name",
    "sku",
    "price",
    "compare_at_price",
    "stock",
    "status",
    "sort_order",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "sort_order";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "DESC"
      ? "DESC"
      : "ASC";

  const result = await ProductVariation.findAndCountAll({
    where,
    include: [productInclude],
    distinct: true,
    col: "id",
    offset,
    limit,
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
    transaction,
  });

  return {
    count: result.count,
    rows: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  };
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createProductVariation,
  bulkCreateProductVariations,
  findById,
  findByUuid,
  findBySku,
  findByName,
  updateProductVariation,
  updateProductVariationStatus,
  deleteProductVariation,
  findByProductId,
  getProductVariations,
};