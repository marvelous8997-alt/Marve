"use strict";

const express = require("express");
const router = express.Router();

const {
  userProductController,
} = require("../../../../../src/controllers/index");

/* ========================= PRODUCT SECTIONS ========================= */

// GET NEW ARRIVALS
// Optional query: ?page=1&limit=12
router.get(
  "/new-arrivals",
  userProductController.getNewArrivals
);

// GET BEST SELLERS
router.get(
  "/best-sellers",
  userProductController.getBestSellers
);

// GET FEATURED PRODUCTS
router.get(
  "/featured",
  userProductController.getFeaturedProducts
);

// GET SALE PRODUCTS
router.get(
  "/sale",
  userProductController.getSaleProducts
);

// GET OFFER PRODUCTS
router.get(
  "/offers",
  userProductController.getOfferProducts
);

// GET GIFT PRODUCTS
router.get(
  "/gifts",
  userProductController.getGiftProducts
);

/* ========================= CATEGORY / SUBCATEGORY ========================= */

// GET PRODUCTS BY CATEGORY ID
// Example: /category/1?page=1&limit=12
router.get(
  "/category/:categoryId",
  userProductController.getProductsByCategoryId
);

// GET PRODUCTS BY SUBCATEGORY ID
// Example: /subcategory/2?page=1&limit=12
router.get(
  "/subcategory/:subcategoryId",
  userProductController.getProductsBySubcategoryId
);

/* ========================= PRODUCT LISTING ========================= */

// GET ALL ACTIVE PRODUCTS WITH OPTIONAL FILTERS
// Examples:
// /?page=1&limit=12
// /?type=new-arrivals
// /?categoryId=1&subcategoryId=2
// /?minPrice=100&maxPrice=1000
// /?sort=price-low-high
// /?search=container
// /?inStock=true
router.get(
  "/",
  userProductController.getProducts
);

/* ========================= PRODUCT DETAILS ========================= */

// GET ACTIVE PRODUCT BY SLUG
// Keep this route before /:id
router.get(
  "/slug/:slug",
  userProductController.getProductBySlug
);

// GET ACTIVE PRODUCT BY ID
router.get(
  "/:id",
  userProductController.getProductById
);

module.exports = router;