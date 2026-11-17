
"use strict";

const express = require("express");
const router = express.Router();
const { adminCategoryController } = require("../../../../controllers/index");
const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

// Create Category
router.post(
  "/create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("categories"),
  upload.single("image"),
  adminCategoryController.createCategory
);

// Get Category List
router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCategoryController.getCategories
);

// Get Category Details
router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCategoryController.getCategory
);

// Update Category
router.patch(
  "/update/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("categories"),
  upload.single("image"),
  adminCategoryController.updateCategory
);

// Update Category Status
router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCategoryController.updateCategoryStatus
);

// Delete Category Permanently
router.delete(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCategoryController.deleteCategory
);

module.exports = router;
