
"use strict";

const { Op } = require("sequelize");

const {
  Product,
  ProductVariation,
  Category,
  Subcategory,
  ProductImage,
} = require("../../database/models");

// =====================================================
// GET INVENTORY PRODUCTS WITHOUT VARIATIONS
// =====================================================

const getProductsWithoutVariations = async ({
  search = "",
  categoryId,
  subcategoryId,
  stockStatus,
  sortBy = "updatedAt",
  sortOrder = "DESC",
}) => {
  const where = {};
  const searchTerm = String(search || "").trim();

  // Search by product name, SKU, or UUID
  if (searchTerm) {
    where[Op.or] = [
      { name: { [Op.like]: `%${searchTerm}%` } },
      { sku: { [Op.like]: `%${searchTerm}%` } },
      { uuid: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  // Category filter
  if (categoryId !== undefined && categoryId !== null && categoryId !== "") {
    where.category_id = categoryId;
  }

  // Subcategory filter
  if (
    subcategoryId !== undefined &&
    subcategoryId !== null &&
    subcategoryId !== ""
  ) {
    where.subcategory_id = subcategoryId;
  }

  // Filter by stock status
  if (stockStatus === "OUT_OF_STOCK") {
    where.stock = 0;
  } else if (stockStatus === "IN_STOCK") {
    where.stock = { [Op.gt]: 0 };
  }

  // Only products without variations
  const products = await Product.findAll({
    where,
    include: [
      {
        model: ProductVariation,
        as: "variations",
        attributes: ["id"],
        required: false,
      },
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
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
  });

  return products.filter(
    (product) => !product.variations || product.variations.length === 0
  );
};

// =====================================================
// GET INVENTORY PRODUCT VARIATIONS
// =====================================================

const getProductVariationsForInventory = async ({
  search = "",
  categoryId,
  subcategoryId,
  stockStatus,
  sortBy = "updatedAt",
  sortOrder = "DESC",
}) => {
  const where = {};
  const productWhere = {};
  const searchTerm = String(search || "").trim();

  // Search by variation name, SKU, or UUID
  if (searchTerm) {
    where[Op.or] = [
      { name: { [Op.like]: `%${searchTerm}%` } },
      { sku: { [Op.like]: `%${searchTerm}%` } },
      { uuid: { [Op.like]: `%${searchTerm}%` } },
    ];

    productWhere[Op.or] = [
      { name: { [Op.like]: `%${searchTerm}%` } },
      { sku: { [Op.like]: `%${searchTerm}%` } },
      { uuid: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  // Category filter through parent product
  if (categoryId !== undefined && categoryId !== null && categoryId !== "") {
    productWhere.category_id = categoryId;
  }

  // Subcategory filter through parent product
  if (
    subcategoryId !== undefined &&
    subcategoryId !== null &&
    subcategoryId !== ""
  ) {
    productWhere.subcategory_id = subcategoryId;
  }

  // Filter by variation stock
  if (stockStatus === "OUT_OF_STOCK") {
    where.stock = 0;
  } else if (stockStatus === "IN_STOCK") {
    where.stock = { [Op.gt]: 0 };
  }

  const variations = await ProductVariation.findAll({
    where,
    include: [
      {
        model: Product,
        as: "product",
        attributes: [
          "id",
          "uuid",
          "name",
          "sku",
          "price",
          "stock",
          "status",
          "category_id",
          "subcategory_id",
        ],
        where: productWhere,
        required: true,
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
      },
    ],
    distinct: true,
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
  });

  return variations;
};

// =====================================================
// GET ALL INVENTORY ITEMS
// =====================================================

const getInventoryItems = async ({
  search = "",
  categoryId,
  subcategoryId,
  stockStatus,
  sortBy = "updatedAt",
  sortOrder = "DESC",
}) => {
  const allowedSortFields = [
    "name",
    "price",
    "stock",
    "status",
    "sort_order",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "updatedAt";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const [products, variations] = await Promise.all([
    getProductsWithoutVariations({
      search,
      categoryId,
      subcategoryId,
      stockStatus,
      sortBy,
      sortOrder,
    }),
    getProductVariationsForInventory({
      search,
      categoryId,
      subcategoryId,
      stockStatus,
      sortBy,
      sortOrder,
    }),
  ]);

  const productItems = products.map((product) => {
    const item = product.toJSON();

    return {
      itemType: "PRODUCT",
      itemId: item.id,
      uuid: item.uuid,
      productId: item.id,
      variationId: null,
      name: item.name,
      sku: item.sku,
      price: item.price,
      stock: item.stock,
      status: item.status,
      category: item.category || null,
      subcategory: item.subcategory || null,
      images: item.images || [],
      updatedAt: item.updatedAt,
    };
  });

  const variationItems = variations.map((variation) => {
    const item = variation.toJSON();
    const product = item.product || {};

    return {
      itemType: "VARIATION",
      itemId: item.id,
      uuid: item.uuid,
      productId: product.id,
      variationId: item.id,
      name: product.name,
      variationName: item.name,
      attributes: item.attributes || {},
      sku: item.sku,
      price: item.price,
      stock: item.stock,
      status: item.status,
      category: product.category || null,
      subcategory: product.subcategory || null,
      images: product.images || [],
      updatedAt: item.updatedAt,
    };
  });

  const items = [...productItems, ...variationItems];

  // Apply combined sorting
  items.sort((a, b) => {
    let valueA;
    let valueB;

    if (sortBy === "name") {
      valueA = `${a.name || ""} ${a.variationName || ""}`.toLowerCase();
      valueB = `${b.name || ""} ${b.variationName || ""}`.toLowerCase();
    } else if (sortBy === "price" || sortBy === "stock") {
      valueA = Number(a[sortBy] || 0);
      valueB = Number(b[sortBy] || 0);
    } else {
      valueA = new Date(a[sortBy] || 0).getTime();
      valueB = new Date(b[sortBy] || 0).getTime();
    }

    if (valueA < valueB) return sortOrder === "ASC" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "ASC" ? 1 : -1;

    return Number(b.itemId) - Number(a.itemId);
  });

  return items;
};

// =====================================================
// FIND PRODUCT INVENTORY ITEM
// =====================================================

const findProductInventoryItem = async (productId, transaction) => {
  return await Product.findByPk(productId, {
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
    include: [
      {
        model: ProductVariation,
        as: "variations",
        attributes: ["id", "uuid", "name", "sku", "stock", "status"],
        required: false,
      },
    ],
  });
};

// =====================================================
// FIND VARIATION INVENTORY ITEM
// =====================================================

const findVariationInventoryItem = async (variationId, transaction) => {
  return await ProductVariation.findByPk(variationId, {
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
    include: [
      {
        model: Product,
        as: "product",
        attributes: [
          "id",
          "uuid",
          "name",
          "sku",
          "category_id",
          "subcategory_id",
        ],
        required: true,
      },
    ],
  });
};

// =====================================================
// UPDATE PRODUCT STOCK
// =====================================================

const updateProductStock = async (product, stock, userId, transaction) => {
  return await product.update(
    {
      stock,
      updated_by: userId,
    },
    { transaction }
  );
};

// =====================================================
// UPDATE VARIATION STOCK
// =====================================================

const updateVariationStock = async (
  variation,
  stock,
  userId,
  transaction
) => {
  return await variation.update(
    {
      stock,
      updated_by: userId,
    },
    { transaction }
  );
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getProductsWithoutVariations,
  getProductVariationsForInventory,
  getInventoryItems,
  findProductInventoryItem,
  findVariationInventoryItem,
  updateProductStock,
  updateVariationStock,
};
