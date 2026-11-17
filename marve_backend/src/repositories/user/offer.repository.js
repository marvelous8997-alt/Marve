
"use strict";

const {
  DiscountCoupon,
  BogoCoupon,
  BogoCouponBuyProduct,
  BogoCouponGetProduct,
  Product,
} = require("../../database/models");

/* ========================= Attributes ========================= */

// Discount coupon fields
const DISCOUNT_COUPON_ATTRIBUTES = [
  "id",
  "uuid",
  "code",
  "name",
  "description",
  "discount_type",
  "discount_value",
  "minimum_order_value",
  "maximum_discount",
  "usage_limit",
  "usage_count",
  "per_customer_limit",
  "start_date",
  "end_date",
  "status",
  "sort_order",
];

// BOGO coupon fields
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
  "sort_order",
];

// Product fields needed for offer cards
const PRODUCT_ATTRIBUTES = [
  "id",
  "uuid",
  "name",
  "slug",
  "sku",
  "price",
  "compare_at_price",
  "status",
];

// Fields for product mapping records
const BOGO_PRODUCT_MAPPING_ATTRIBUTES = [
  "id",
  "bogo_coupon_id",
  "product_id",
];

/* ========================= Includes ========================= */

// Buy products and their product details
const BOGO_BUY_PRODUCT_INCLUDES = [
  {
    model: BogoCouponBuyProduct,
    as: "buyProducts",
    attributes: BOGO_PRODUCT_MAPPING_ATTRIBUTES,
    required: false,
    include: [
      {
        model: Product,
        as: "product",
        attributes: PRODUCT_ATTRIBUTES,
        required: false,
        where: {
          status: "ACTIVE",
        },
      },
    ],
  },
];

// Get products and their product details
const BOGO_GET_PRODUCT_INCLUDES = [
  {
    model: BogoCouponGetProduct,
    as: "getProducts",
    attributes: BOGO_PRODUCT_MAPPING_ATTRIBUTES,
    required: false,
    include: [
      {
        model: Product,
        as: "product",
        attributes: PRODUCT_ATTRIBUTES,
        required: false,
        where: {
          status: "ACTIVE",
        },
      },
    ],
  },
];

/* ========================= Discount Coupons ========================= */

// Get currently valid discount coupons for the user panel
// Get all administratively active discount offers.
// Date-based status will be calculated in the service.
const getActiveDiscountOffers = async (options = {}) => {
  return DiscountCoupon.findAll({
    where: {
      status: "ACTIVE",
    },
    attributes: DISCOUNT_COUPON_ATTRIBUTES,
    order: [
      ["sort_order", "ASC"],
      ["name", "ASC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

/* ========================= BOGO Coupons ========================= */

// Get currently valid BOGO coupons with Buy/Get product details
// Get all administratively active BOGO offers.
// Date-based status will be calculated in the service.
const getActiveBogoOffers = async (options = {}) => {
  return BogoCoupon.findAll({
    where: {
      status: "ACTIVE",
    },
    attributes: BOGO_COUPON_ATTRIBUTES,
    include: [
      ...BOGO_BUY_PRODUCT_INCLUDES,
      ...BOGO_GET_PRODUCT_INCLUDES,
    ],
    order: [
      ["sort_order", "ASC"],
      ["name", "ASC"],
      ["id", "DESC"],
    ],
    distinct: true,
    ...options,
  });
};

/* ========================= Exports ========================= */

module.exports = {
  getActiveDiscountOffers,
  getActiveBogoOffers,
};
