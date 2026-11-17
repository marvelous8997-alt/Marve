
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminInventoryController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

// =====================================================
// GET INVENTORY LIST
// GET /admin/inventory/list
// =====================================================

router.get(
  "/list",
    authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInventoryController.getInventory
);

// =====================================================
// GET INVENTORY ITEM DETAILS
// GET /admin/inventory/list/:itemType/:itemId
// =====================================================

router.get(
  "/list/:itemType/:itemId",
    authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInventoryController.getInventoryItem
);

// =====================================================
// ADJUST INVENTORY STOCK
// PATCH /admin/inventory/stock/:itemType/:itemId
// =====================================================

router.patch(
  "/stock/:itemType/:itemId",
    authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInventoryController.adjustInventoryStock
);

// =====================================================
// GET STOCK MOVEMENT HISTORY
// GET /admin/inventory/movements/:itemType/:itemId
// =====================================================

router.get(
  "/movements/:itemType/:itemId",
    authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInventoryController.getInventoryItemMovements
);

module.exports = router;
