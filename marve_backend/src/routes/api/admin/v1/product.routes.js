"use strict";

const express = require("express");
const router = express.Router();
const { adminProductController } = require("../../../../controllers/index");
const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const uploadFolder = require("../../../../middleware/uploadFolder");
const uploadProductMedia = require("../../../../middleware/uploadProductMedia.middleware");

// Create Product
router.post(
  "/create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("products"),
  uploadProductMedia,
  adminProductController.createProduct
);

// Get Product List
router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductController.getProducts
);

// Get Product Details
router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductController.getProduct
);

// Update Product
router.patch(
  "/update/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("products"),
  uploadProductMedia,
  adminProductController.updateProduct
);

// Update Product Status
router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductController.updateProductStatus
);

// Update Product Status
router.delete(
  "/video/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductController.removeProductVideo
);

// Delete Product Permanently
router.delete(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminProductController.deleteProduct
);

module.exports = router;