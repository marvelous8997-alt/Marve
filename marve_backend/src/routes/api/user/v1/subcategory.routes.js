
"use strict";

const express = require("express");
const router = express.Router();

const {
  userSubcategoryController,
} = require("../../../../../src/controllers/index");

// GET ALL ACTIVE SUBCATEGORIES
// Optional query: ?categoryId=1
router.get(
  "/",
  userSubcategoryController.getSubcategories
);

// GET ACTIVE SUBCATEGORIES BY CATEGORY ID
router.get(
  "/category/:categoryId",
  userSubcategoryController.getSubcategoriesByCategoryId
);

// GET ACTIVE SUBCATEGORY BY ID
router.get(
  "/:id",
  userSubcategoryController.getSubcategoryById
);

module.exports = router;
