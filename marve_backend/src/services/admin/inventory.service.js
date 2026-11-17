
"use strict";

const { sequelize } = require("../../database/models");
const {
  adminInventoryRepository,
  adminInventoryStockMovementRepository,
} = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// =====================================================
// HELPERS
// =====================================================

const normalizeItemType = (value) => {
  const itemType = String(value || "").trim().toUpperCase();

  if (!["PRODUCT", "VARIATION"].includes(itemType)) {
    throw new ApiError(
      400,
      "Item type must be PRODUCT or VARIATION."
    );
  }

  return itemType;
};

const normalizePositiveId = (value, label = "Item ID") => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ApiError(400, `${label} must be a valid positive integer.`);
  }

  return id;
};

const normalizeStock = (value, label = "Stock") => {
  const stock = Number(value);

  if (
    value === "" ||
    value === null ||
    value === undefined ||
    !Number.isSafeInteger(stock) ||
    stock < 0
  ) {
    throw new ApiError(
      400,
      `${label} must be a non-negative integer.`
    );
  }

  return stock;
};

const getStockStatus = (stock, lowStockThreshold = 5) => {
  const quantity = Number(stock) || 0;
  const threshold = Number(lowStockThreshold) || 0;

  if (quantity <= 0) return "OUT_OF_STOCK";
  if (quantity <= threshold) return "LOW_STOCK";

  return "IN_STOCK";
};

const normalizePagination = (query = {}) => {
  const pageValue = Number(query.page ?? 1);
  const limitValue = Number(query.limit ?? 10);

  const page =
    Number.isSafeInteger(pageValue) && pageValue > 0
      ? pageValue
      : 1;

  const limit =
    Number.isSafeInteger(limitValue) && limitValue > 0
      ? Math.min(limitValue, 100)
      : 10;

  return { page, limit };
};

// =====================================================
// FORMAT INVENTORY ITEM
// =====================================================

const formatInventoryItem = (item) => {
  const stock = Number(item.stock) || 0;
  const lowStockThreshold = Number(item.lowStockThreshold ?? 5);

  const images = Array.isArray(item.images) ? item.images : [];

  const primaryImage =
    images.find((image) => image.is_primary) ||
    images[0] ||
    null;

  return {
    ...item,

    // Product information
    productName: item.productName || item.name || null,
    productId: item.productId ?? item.product_id ?? null,

    // Variation information
    variationName:
      item.variationName || item.variation_name || null,

    variationAttributes:
      item.variationAttributes ||
      item.attributes ||
      null,

    // Stock information
    stock,
    lowStockThreshold,
    status: getStockStatus(stock, lowStockThreshold),

    // Image and category information
    productImage: primaryImage?.image_url || null,
    categoryName: item.category?.name || null,
    subcategoryName: item.subcategory?.name || null,
  };
};

// =====================================================
// GET INVENTORY LIST
// =====================================================

const getInventory = async (query = {}) => {
  try {
    const { page, limit } = normalizePagination(query);

    const result = await adminInventoryRepository.getInventoryItems({
      search: query.search || "",
      categoryId: query.categoryId || query.category_id,
      subcategoryId: query.subcategoryId || query.subcategory_id,
      stockStatus: query.stockStatus || query.stock_status,
      sortBy: query.sortBy || query.sort_by || "updatedAt",
      sortOrder: query.sortOrder || query.sort_order || "DESC",
    });

    const items = result.map(formatInventoryItem);

    // Apply LOW_STOCK after calculating each item's threshold.
    const requestedStatus =
      query.stockStatus || query.stock_status;

    const filteredItems =
      requestedStatus === "LOW_STOCK"
        ? items.filter((item) => item.status === "LOW_STOCK")
        : items;

    const total = filteredItems.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const rows = filteredItems.slice(offset, offset + limit);

    const summary = {
      totalItems: total,
      inStock: filteredItems.filter(
        (item) => item.status === "IN_STOCK"
      ).length,
      lowStock: filteredItems.filter(
        (item) => item.status === "LOW_STOCK"
      ).length,
      outOfStock: filteredItems.filter(
        (item) => item.status === "OUT_OF_STOCK"
      ).length,
    };

    return {
      rows,
      count: total,
      page,
      limit,
      totalPages,
      summary,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// =====================================================
// GET SINGLE INVENTORY ITEM
// =====================================================

const getInventoryItem = async (itemTypeValue, itemIdValue) => {
  try {
    const itemType = normalizeItemType(itemTypeValue);
    const itemId = normalizePositiveId(itemIdValue);

    let item;

    if (itemType === "PRODUCT") {
      item = await adminInventoryRepository.findProductInventoryItem(itemId);
    } else {
      item = await adminInventoryRepository.findVariationInventoryItem(itemId);
    }

    if (!item) {
      throw new ApiError(404, "Inventory item not found.");
    }

    // A product with variations is not itself a sellable inventory row.
    if (
      itemType === "PRODUCT" &&
      Array.isArray(item.variations) &&
      item.variations.length > 0
    ) {
      throw new ApiError(
        400,
        "This product has variations. Manage stock through its individual variations."
      );
    }

    const raw = item.toJSON();

    if (itemType === "PRODUCT") {
      return formatInventoryItem({
        itemType: "PRODUCT",
        itemId: raw.id,
        uuid: raw.uuid,
        productId: raw.id,
        variationId: null,
        name: raw.name,
        sku: raw.sku,
        price: raw.price,
        stock: raw.stock,
        images: raw.images || [],
        category: raw.category || null,
        subcategory: raw.subcategory || null,
        updatedAt: raw.updatedAt,
      });
    }

    const product = raw.product || {};

    return formatInventoryItem({
      itemType: "VARIATION",
      itemId: raw.id,
      uuid: raw.uuid,
      productId: product.id,
      variationId: raw.id,
      name: product.name,
      variationName: raw.name,
      attributes: raw.attributes || {},
      sku: raw.sku,
      price: raw.price,
      stock: raw.stock,
      images: product.images || [],
      category: product.category || null,
      subcategory: product.subcategory || null,
      updatedAt: raw.updatedAt,
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// =====================================================
// ADJUST INVENTORY STOCK
// =====================================================

const adjustInventoryStock = async (
  itemTypeValue,
  itemIdValue,
  payload = {},
  userId
) => {
  const transaction = await sequelize.transaction();

  try {
    const itemType = normalizeItemType(itemTypeValue);
    const itemId = normalizePositiveId(itemIdValue);

    const adjustmentQuantity = Number(payload.adjustmentQuantity);

    if (
      payload.adjustmentQuantity === "" ||
      payload.adjustmentQuantity === null ||
      payload.adjustmentQuantity === undefined ||
      !Number.isSafeInteger(adjustmentQuantity) ||
      adjustmentQuantity === 0
    ) {
      throw new ApiError(
        400,
        "Adjustment quantity must be a non-zero integer."
      );
    }

    const reason = String(payload.reason || "").trim();

    if (!reason) {
      throw new ApiError(400, "Stock adjustment reason is required.");
    }

    if (reason.length > 100) {
      throw new ApiError(
        400,
        "Stock adjustment reason cannot exceed 100 characters."
      );
    }

    const notes =
      payload.notes === undefined || payload.notes === null
        ? null
        : String(payload.notes).trim() || null;

    let item;

    if (itemType === "PRODUCT") {
      item = await adminInventoryRepository.findProductInventoryItem(
        itemId,
        transaction
      );
    } else {
      item = await adminInventoryRepository.findVariationInventoryItem(
        itemId,
        transaction
      );
    }

    if (!item) {
      throw new ApiError(404, "Inventory item not found.");
    }

    if (
      itemType === "PRODUCT" &&
      Array.isArray(item.variations) &&
      item.variations.length > 0
    ) {
      throw new ApiError(
        400,
        "This product has variations. Adjust stock on an individual variation."
      );
    }

    const previousStock = normalizeStock(item.stock);
    const newStock = previousStock + adjustmentQuantity;

    if (!Number.isSafeInteger(newStock) || newStock < 0) {
      throw new ApiError(
        400,
        "Stock adjustment cannot result in negative stock."
      );
    }

    if (newStock > 4294967295) {
      throw new ApiError(
        400,
        "Stock exceeds the maximum supported quantity."
      );
    }

    if (userId === undefined || userId === null) {
      throw new ApiError(401, "Authenticated admin is required.");
    }

    // Update the current stock.
    if (itemType === "PRODUCT") {
      await adminInventoryRepository.updateProductStock(
        item,
        newStock,
        userId,
        transaction
      );
    } else {
      await adminInventoryRepository.updateVariationStock(
        item,
        newStock,
        userId,
        transaction
      );
    }

    // Save the audit history in the same transaction.
    await adminInventoryStockMovementRepository.createInventoryStockMovement(
      {
        item_type: itemType,
        item_id: itemId,
        previous_stock: previousStock,
        adjustment_quantity: adjustmentQuantity,
        new_stock: newStock,
        reason,
        notes,
        created_by: userId,
      },
      transaction
    );

    await transaction.commit();

    return {
      itemType,
      itemId,
      previousStock,
      adjustmentQuantity,
      newStock,
      status: getStockStatus(newStock),
      reason,
      notes,
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// =====================================================
// GET STOCK MOVEMENT HISTORY FOR AN ITEM
// =====================================================

const getInventoryItemMovements = async (
  itemTypeValue,
  itemIdValue,
  query = {}
) => {
  try {
    const itemType = normalizeItemType(itemTypeValue);
    const itemId = normalizePositiveId(itemIdValue);
    const { page, limit } = normalizePagination(query);

    const result =
      await adminInventoryStockMovementRepository.getMovementsByItem({
        itemType,
        itemId,
        page,
        limit,
      });

    return {
      ...result,
      rows: result.rows.map((movement) => movement.toJSON()),
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getInventory,
  getInventoryItem,
  adjustInventoryStock,
  getInventoryItemMovements,
};
