
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { adminInventoryService } = require("../../services");

// =====================================================
// GET INVENTORY LIST
// =====================================================

const getInventory = asyncHandler(async (req, res) => {
  const result = await adminInventoryService.getInventory({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
    categoryId: req.query.category_id ?? req.query.categoryId,
    subcategoryId:
      req.query.subcategory_id ?? req.query.subcategoryId,
    stockStatus:
      req.query.stock_status ?? req.query.stockStatus,
    sortBy: req.query.sort_by || req.query.sortBy || "updatedAt",
    sortOrder:
      req.query.sort_order || req.query.sortOrder || "DESC",
  });

  return ResponseHelper.success(
    res,
    "Inventory fetched successfully.",
    result
  );
});

// =====================================================
// GET INVENTORY ITEM DETAILS
// =====================================================

const getInventoryItem = asyncHandler(async (req, res) => {
  const item = await adminInventoryService.getInventoryItem(
    req.params.itemType,
    req.params.itemId
  );

  return ResponseHelper.success(
    res,
    "Inventory item fetched successfully.",
    item
  );
});

// =====================================================
// ADJUST INVENTORY STOCK
// =====================================================

const adjustInventoryStock = asyncHandler(async (req, res) => {
  const result = await adminInventoryService.adjustInventoryStock(
    req.params.itemType,
    req.params.itemId,
    {
      adjustmentQuantity:
        req.body.adjustmentQuantity ??
        req.body.adjustment_quantity,
      reason: req.body.reason,
      notes: req.body.notes,
    },
    req.user?.id
  );

  return ResponseHelper.success(
    res,
    "Inventory stock adjusted successfully.",
    result
  );
});

// =====================================================
// GET INVENTORY STOCK MOVEMENT HISTORY
// =====================================================

const getInventoryItemMovements = asyncHandler(async (req, res) => {
  const result = await adminInventoryService.getInventoryItemMovements(
    req.params.itemType,
    req.params.itemId,
    {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    }
  );

  return ResponseHelper.success(
    res,
    "Inventory stock history fetched successfully.",
    result
  );
});

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getInventory,
  getInventoryItem,
  adjustInventoryStock,
  getInventoryItemMovements,
};
