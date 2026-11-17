"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { userCartService } = require("../../services");

/* ========================= GET CUSTOMER CART ========================= */

// GET /api/user/cart
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await userCartService.getCart(userId);

  return ResponseHelper.success(
    res,
    "Basket fetched successfully.",
    result
  );
});

/* ========================= ADD PRODUCT TO CART ========================= */

// POST /api/user/cart/items
// Body: { "productId": 1, "quantity": 1, "productVariationId": 2 }
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    productId,
    quantity = 1,
    productVariationId = null,
  } = req.body;

  const result = await userCartService.addToCart(
    userId,
    productId,
    quantity,
    productVariationId
  );

  return ResponseHelper.success(
    res,
    result.message,
    {
      cartId: result.cartId,
      productId: result.productId,
      productVariationId: result.productVariationId,
      quantity: result.quantity,
      unitPrice: result.unitPrice,
    }
  );
});

/* ========================= UPDATE CART ITEM QUANTITY ========================= */

// PATCH /api/user/cart/items/:itemId
// Body: { "quantity": 2 }
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const result = await userCartService.updateCartItemQuantity(
    userId,
    itemId,
    quantity
  );

  return ResponseHelper.success(
    res,
    result.message,
    {
      itemId: result.itemId,
      productId: result.productId,
      productVariationId: result.productVariationId,
      quantity: result.quantity,
    }
  );
});

/* ========================= REMOVE CART ITEM ========================= */

// DELETE /api/user/cart/items/:itemId
const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  const result = await userCartService.removeCartItem(
    userId,
    itemId
  );

  return ResponseHelper.success(
    res,
    result.message,
    null
  );
});

/* ========================= CLEAR CART ========================= */

// DELETE /api/user/cart/items
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await userCartService.clearCart(userId);

  return ResponseHelper.success(
    res,
    result.message,
    null
  );
});

/* ========================= APPLY COUPON ========================= */

// POST /api/user/cart/coupon
// Body: { "code": "SAVE10" }
const applyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;

  const result = await userCartService.applyCoupon(userId, code);

  return ResponseHelper.success(
    res,
    result.message,
    result
  );
});

/* ========================= SELECT BOGO GIFT ========================= */

// POST /api/user/cart/coupon/bogo-gift
// Body: { "productId": 10, "productVariationId": 3 }
// productVariationId is optional.
const selectBogoGift = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    productId,
    productVariationId = null,
  } = req.body;

  const result = await userCartService.selectBogoGift(
    userId,
    productId,
    productVariationId
  );

  return ResponseHelper.success(
    res,
    result.message,
    result.gift
  );
});

/* ========================= REMOVE COUPON ========================= */

// DELETE /api/user/cart/coupon
const removeCoupon = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await userCartService.removeCoupon(userId);

  return ResponseHelper.success(
    res,
    result.message,
    null
  );
});

/* ========================= EXPORTS ========================= */

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
  selectBogoGift,
  removeCoupon,
};