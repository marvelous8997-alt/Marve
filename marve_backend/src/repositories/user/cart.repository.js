"use strict";

const { Op } = require("sequelize");

const {
  Cart,
  CartItem,
  Product,
  ProductImage,
  ProductVariation,
  Category,
  Subcategory,
  DiscountCoupon,
  BogoCoupon,
  BogoCouponBuyProduct,
  BogoCouponGetProduct,
} = require("../../database/models");

/* ========================= Attributes ========================= */

const PRODUCT_ATTRIBUTES = [
  "id",
  "uuid",
  "category_id",
  "subcategory_id",
  "name",
  "slug",
  "short_description",
  "sku",
  "price",
  "compare_at_price",
  "stock",
  "status",
];

const PRODUCT_IMAGE_ATTRIBUTES = [
  "id",
  "uuid",
  "product_id",
  "image_url",
  "alt_text",
  "is_primary",
  "sort_order",
];

const CATEGORY_ATTRIBUTES = [
  "id",
  "uuid",
  "name",
  "slug",
  "image",
  "icon",
  "status",
];

const SUBCATEGORY_ATTRIBUTES = [
  "id",
  "uuid",
  "category_id",
  "name",
  "slug",
  "image",
  "icon",
  "status",
];

const VARIATION_ATTRIBUTES = [
  "id",
  "uuid",
  "product_id",
  "name",
  "sku",
  "attributes",
  "price",
  "compare_at_price",
  "stock",
  "status",
  "sort_order",
];

const CART_ITEM_ATTRIBUTES = [
  "id",
  "cart_id",
  "product_id",
  "product_variation_id",
  "quantity",
  "is_free_gift",
  "createdAt",
  "updatedAt",
];

const CART_ATTRIBUTES = [
  "id",
  "user_id",
  "status",
  "applied_coupon_type",
  "applied_coupon_id",
  "applied_coupon_code",
  "selected_bogo_product_id",
  "createdAt",
  "updatedAt",
];

const DISCOUNT_COUPON_ATTRIBUTES = [
  "id",
  "uuid",
  "code",
  "name",
  "description",
  "discount_type",
  "discount_value",
  "maximum_discount",
  "minimum_order_value",
  "usage_limit",
  "usage_count",
  "per_customer_limit",
  "start_date",
  "end_date",
  "status",
];

const BOGO_COUPON_ATTRIBUTES = [
  "id",
  "uuid",
  "code",
  "name",
  "description",
  "buy_quantity",
  "get_quantity",
  "minimum_order_value",
  "usage_limit",
  "per_customer_limit",
  "start_date",
  "end_date",
  "status",
];

/* ========================= Includes ========================= */

const CART_PRODUCT_INCLUDES = [
  {
    model: ProductImage,
    as: "images",
    attributes: PRODUCT_IMAGE_ATTRIBUTES,
    required: false,
  },
  {
    model: Category,
    as: "category",
    attributes: CATEGORY_ATTRIBUTES,
    required: true,
    where: { status: "ACTIVE" },
  },
  {
    model: Subcategory,
    as: "subcategory",
    attributes: SUBCATEGORY_ATTRIBUTES,
    required: true,
    where: { status: "ACTIVE" },
  },
];

const BOGO_PRODUCT_INCLUDES = [
  {
    model: Product,
    as: "product",
    attributes: PRODUCT_ATTRIBUTES,
    required: true,
    where: { status: "ACTIVE" },
    include: CART_PRODUCT_INCLUDES,
  },
];

/* ========================= Cart ========================= */

// Find customer's active cart
const findActiveCartByUserId = async (userId, options = {}) => {
  return Cart.findOne({
    where: {
      user_id: userId,
      status: "ACTIVE",
    },
    attributes: CART_ATTRIBUTES,
    ...options,
  });
};

// Find cart by primary key
const findCartById = async (cartId, options = {}) => {
  return Cart.findByPk(cartId, {
    attributes: CART_ATTRIBUTES,
    ...options,
  });
};

// Create cart
const createCart = async (data, options = {}) => {
  return Cart.create(data, options);
};

// Update cart, including applied coupon information
const updateCart = async (cart, data, options = {}) => {
  return cart.update(data, options);
};

// Clear the applied coupon and selected gift
const clearCartCoupon = async (cart, options = {}) => {
  return cart.update(
    {
      applied_coupon_type: null,
      applied_coupon_id: null,
      applied_coupon_code: null,
      selected_bogo_product_id: null,
    },
    options
  );
};

/* ========================= Cart Items ========================= */

// Find item by product, variation and gift status
const findCartItem = async (cartId, productId, options = {}) => {
  const {
    productVariationId = null,
    isFreeGift = false,
    ...queryOptions
  } = options;

  return CartItem.findOne({
    where: {
      cart_id: cartId,
      product_id: productId,
      product_variation_id: productVariationId,
      is_free_gift: isFreeGift,
    },
    ...queryOptions,
  });
};

// Find item by ID inside a cart
const findCartItemById = async (cartId, itemId, options = {}) => {
  return CartItem.findOne({
    where: {
      id: itemId,
      cart_id: cartId,
    },
    ...options,
  });
};

// Create item
const createCartItem = async (data, options = {}) => {
  return CartItem.create(data, options);
};

// Update item
const updateCartItem = async (cartItem, data, options = {}) => {
  return cartItem.update(data, options);
};

// Delete item
const deleteCartItem = async (cartItem, options = {}) => {
  return cartItem.destroy(options);
};

// Delete all items in cart
const deleteCartItemsByCartId = async (cartId, options = {}) => {
  return CartItem.destroy({
    where: { cart_id: cartId },
    ...options,
  });
};

// Delete only free gift rows
const deleteFreeGiftItemsByCartId = async (cartId, options = {}) => {
  return CartItem.destroy({
    where: {
      cart_id: cartId,
      is_free_gift: true,
    },
    ...options,
  });
};

/* ========================= Get Cart ========================= */

// Get cart with products and variation details
const getCartWithItemsByUserId = async (userId, options = {}) => {
  return Cart.findOne({
    where: {
      user_id: userId,
      status: "ACTIVE",
    },
    attributes: CART_ATTRIBUTES,
    include: [
      {
        model: CartItem,
        as: "items",
        attributes: CART_ITEM_ATTRIBUTES,
        required: false,
        include: [
          {
            model: Product,
            as: "product",
            attributes: PRODUCT_ATTRIBUTES,
            required: false,
            include: CART_PRODUCT_INCLUDES,
          },
          {
            model: ProductVariation,
            as: "variation",
            attributes: VARIATION_ATTRIBUTES,
            required: false,
          },
        ],
      },
    ],
    ...options,
  });
};

/* ========================= Products ========================= */

// Find active product
const findActiveProductById = async (productId, options = {}) => {
  return Product.findOne({
    where: {
      id: productId,
      status: "ACTIVE",
    },
    attributes: PRODUCT_ATTRIBUTES,
    include: CART_PRODUCT_INCLUDES,
    ...options,
  });
};

// Find active variation belonging to a specific product
const findActiveProductVariationById = async (
  productId,
  variationId,
  options = {}
) => {
  return ProductVariation.findOne({
    where: {
      id: variationId,
      product_id: productId,
      status: "ACTIVE",
    },
    attributes: VARIATION_ATTRIBUTES,
    ...options,
  });
};

// Find inactive/out-of-stock products in cart
const findItemsWithInactiveProducts = async (cartId, options = {}) => {
  return CartItem.findAll({
    where: { cart_id: cartId },
    include: [
      {
        model: Product,
        as: "product",
        required: true,
        where: {
          [Op.or]: [
            { status: "INACTIVE" },
            { stock: 0 },
          ],
        },
        attributes: ["id", "name", "status", "stock"],
      },
    ],
    ...options,
  });
};

/* ========================= Discount Coupons ========================= */

// Find discount coupon by normalized code
const findDiscountCouponByCode = async (code, options = {}) => {
  return DiscountCoupon.findOne({
    where: {
      code: String(code || "").trim().toUpperCase().replace(/\s+/g, ""),
    },
    attributes: DISCOUNT_COUPON_ATTRIBUTES,
    ...options,
  });
};

// Find discount coupon by ID
const findDiscountCouponById = async (couponId, options = {}) => {
  return DiscountCoupon.findByPk(couponId, {
    attributes: DISCOUNT_COUPON_ATTRIBUTES,
    ...options,
  });
};

/* ========================= BOGO Coupons ========================= */

// Find BOGO coupon with eligible buy/get products

const findBogoCouponByCode = async (code, options = {}) => {
  return BogoCoupon.findOne({
    where: {
      code: String(code || "").trim().toUpperCase().replace(/\s+/g, ""),
    },
    attributes: BOGO_COUPON_ATTRIBUTES,
    include: [
      {
        model: BogoCouponBuyProduct,
        as: "buyProducts",
        required: false,
        include: BOGO_PRODUCT_INCLUDES,
      },
    ],
    ...options,
  });
};


// Find BOGO coupon by ID
const findBogoCouponById = async (couponId, options = {}) => {
  return BogoCoupon.findByPk(couponId, {
    attributes: BOGO_COUPON_ATTRIBUTES,
    ...options,
  });
};

// Fetch eligible gift product records for a BOGO coupon
const findEligibleBogoProducts = async (bogoCouponId, options = {}) => {
  return BogoCouponGetProduct.findAll({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    include: BOGO_PRODUCT_INCLUDES,
    ...options,
  });
};

// Fetch eligible buy products for a BOGO coupon
const findEligibleBogoBuyProducts = async (
  bogoCouponId,
  options = {}
) => {
  return BogoCouponBuyProduct.findAll({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    include: BOGO_PRODUCT_INCLUDES,
    ...options,
  });
};

/* ========================= Exports ========================= */

module.exports = {
  // Cart
  findActiveCartByUserId,
  findCartById,
  createCart,
  updateCart,
  clearCartCoupon,

  // Cart items
  findCartItem,
  findCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteCartItemsByCartId,
  deleteFreeGiftItemsByCartId,

  // Cart response
  getCartWithItemsByUserId,

  // Products and variations
  findActiveProductById,
  findActiveProductVariationById,
  findItemsWithInactiveProducts,

  // Discount coupons
  findDiscountCouponByCode,
  findDiscountCouponById,

  // BOGO coupons
  findBogoCouponByCode,
  findBogoCouponById,
  findEligibleBogoProducts,
  findEligibleBogoBuyProducts,
};