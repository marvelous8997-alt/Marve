
"use strict";

const express = require("express");
const router = express.Router();

const {
  adminProductVariationController,
} = require("../../../../controllers/index");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

// Create Single Product Variation
router.post(
  "/create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductVariationController.createProductVariation
);

// Create Multiple Product Variations
router.post(
  "/bulk-create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductVariationController.createProductVariations
);

// Get Product Variations List
router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductVariationController.getProductVariations
);

// Get Product Variation Details
router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductVariationController.getProductVariation
);

// Update Product Variation
router.patch(
  "/update/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductVariationController.updateProductVariation
);

// Update Product Variation Status
router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductVariationController.updateProductVariationStatus
);

// Delete Product Variation Permanently
router.delete(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductVariationController.deleteProductVariation
);

module.exports = router;
