"use strict";

const express = require("express");
const router = express.Router();

const {
  userCartController,
} = require("../../../../../src/controllers/index");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= CUSTOMER CART ========================= */

// GET CUSTOMER CART
// GET /api/user/cart
router.get(
  "/",
  authenticate,
  userCartController.getCart
);

// ADD PRODUCT TO CART
// POST /api/user/cart/items
// Body: { "productId": 1, "quantity": 1, "productVariationId": 2 }
router.post(
  "/items",
  authenticate,
  userCartController.addToCart
);

// UPDATE CART ITEM QUANTITY
// PATCH /api/user/cart/items/:itemId
// Body: { "quantity": 2 }
router.patch(
  "/items/:itemId",
  authenticate,
  userCartController.updateCartItemQuantity
);

// REMOVE ONE CART ITEM
// DELETE /api/user/cart/items/:itemId
router.delete(
  "/items/:itemId",
  authenticate,
  userCartController.removeCartItem
);

// CLEAR ALL CART ITEMS
// DELETE /api/user/cart/items
router.delete(
  "/items",
  authenticate,
  userCartController.clearCart
);

/* ========================= COUPON ROUTES ========================= */

// APPLY DISCOUNT OR BOGO COUPON
// POST /api/user/cart/coupon
// Body: { "code": "SAVE10" }
router.post(
  "/coupon",
  authenticate,
  userCartController.applyCoupon
);

// SELECT ONE BOGO FREE GIFT
// POST /api/user/cart/coupon/bogo-gift
// Body: { "productId": 10, "productVariationId": 3 }
// productVariationId is optional.
router.post(
  "/coupon/bogo-gift",
  authenticate,
  userCartController.selectBogoGift
);

// REMOVE APPLIED COUPON
// DELETE /api/user/cart/coupon
router.delete(
  "/coupon",
  authenticate,
  userCartController.removeCoupon
);

/* ========================= EXPORTS ========================= */

module.exports = router;