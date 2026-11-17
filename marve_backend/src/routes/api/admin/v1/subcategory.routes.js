"use strict";

const express = require("express");
const router = express.Router();
const { adminSubcategoryController } = require("../../../../controllers/index");
const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
const upload = require("../../../../middleware/uploadImage.middleware");
const uploadFolder = require("../../../../middleware/uploadFolder");

// Create Subcategory
router.post(
  "/create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("subcategories"),
  upload.single("image"),
  adminSubcategoryController.createSubcategory
);

// Get Subcategory List
router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminSubcategoryController.getSubcategories
);

// Get Subcategory Details
router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminSubcategoryController.getSubcategory
);

// Update Subcategory
router.patch(
  "/update/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  uploadFolder("subcategories"),
  upload.single("image"),
  adminSubcategoryController.updateSubcategory
);

// Update Subcategory Status
router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminSubcategoryController.updateSubcategoryStatus
);

// Delete Subcategory Permanently
router.delete(
  "/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminSubcategoryController.deleteSubcategory
);

router.get(
  "/active-category-options",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminSubcategoryController.getActiveCategoriesForDropdown
);

module.exports = router;