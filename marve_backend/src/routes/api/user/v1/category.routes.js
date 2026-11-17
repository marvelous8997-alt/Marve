"use strict";

const express = require("express");
const router = express.Router();

const {
  userCategoryController,
} = require("../../../../../src/controllers/index");

// GET ALL ACTIVE CATEGORIES
router.get(
  "/",
  userCategoryController.getCategories
);

// GET ACTIVE CATEGORY BY ID
router.get(
  "/:id",
  userCategoryController.getCategoryById
);

module.exports = router;
