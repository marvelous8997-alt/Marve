"use strict";

const {
  Order,
  OrderItem,
  CheckoutAddress,
  Shipment,
  Product,
  ProductVariation,
  ProductImage,
  DiscountCoupon,
  BogoCoupon,
  BogoCouponBuyProduct,
  BogoCouponGetProduct,
  sequelize,
} = require("../../database/models");

// =====================================================
// GET ALL ORDERS FOR A USER
// =====================================================

const getOrdersByUserId = async (userId, options = {}) => {
  return Order.findAll({
    where: { userId },
    attributes: [
      "id",
      "uuid",
      "orderNumber",
      "userId",
      "checkoutAddressId",
      "currency",
      "subtotal",
      "productDiscount",
      "couponDiscount",
      "taxAmount",
      "shippingAmount",
      "totalAmount",
      "couponId",
      "couponCode",
      "paymentMethod",
      "paymentStatus",
      "orderStatus",
      "placedAt",
      "cancelledAt",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "items",
        attributes: [
          "id",
          "uuid",
          "productId",
          "productVariationId",
          "productName",
          "productSlug",
          "productSku",
          "variationName",
          "variationSku",
          "productImage",
          "variationAttributes",
          "quantity",
          "unitPrice",
          "unitDiscount",
          "isFreeGift",
          "taxRate",
          "taxAmount",
          "lineTotal",
        ],
      },
        {
    model: Shipment,
    as: "shipments",
    attributes: [
      "id",
      "uuid",
      "orderId",
      "awbNumber",
      "trackingNumber",
      "courierName",
      "status",
      "estimatedDeliveryAt",
      "shippedAt",
      "deliveredAt",
      "lastTrackedAt",
    ],
    required: false,
  },
    ],
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET ORDER BY ID FOR A USER
// =====================================================

const getOrderById = async (orderId, userId, options = {}) => {
  return Order.findOne({
    where: {
      id: orderId,
      userId,
    },
    include: [
      {
        model: OrderItem,
        as: "items",
      },
      {
        model: CheckoutAddress,
        as: "checkoutAddress",
        required: false,
      },
    ],
    ...options,
  });
};

// =====================================================
// GET ORDER BY UUID FOR A USER
// =====================================================

const getOrderByUuid = async (uuid, userId, options = {}) => {
  return Order.findOne({
    where: {
      uuid,
      userId,
    },
    include: [
      {
        model: OrderItem,
        as: "items",
      },
    ],
    ...options,
  });
};

// =====================================================
// GET ORDER BY ORDER NUMBER
// =====================================================

const getOrderByNumber = async (orderNumber, options = {}) => {
  return Order.findOne({
    where: { orderNumber },
    ...options,
  });
};

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (orderData, options = {}) => {
  return Order.create(orderData, options);
};

// =====================================================
// CREATE MULTIPLE ORDER ITEMS
// =====================================================

const createOrderItems = async (itemsData, options = {}) => {
  if (!Array.isArray(itemsData) || itemsData.length === 0) {
    throw new Error("At least one order item is required.");
  }

  return OrderItem.bulkCreate(itemsData, {
    validate: true,
    ...options,
  });
};

// =====================================================
// CREATE ORDER AND ITEMS IN ONE TRANSACTION
// =====================================================

const createOrderWithItems = async (
  orderData,
  itemsData,
  options = {}
) => {
  const executeCreation = async (transaction) => {
    const order = await Order.create(orderData, {
      transaction,
    });

    const orderItems = await createOrderItems(
      itemsData.map((item) => ({
        ...item,
        orderId: order.id,
      })),
      { transaction }
    );

    return {
      order,
      items: orderItems,
    };
  };

  if (options.transaction) {
    return executeCreation(options.transaction);
  }

  return sequelize.transaction(async (transaction) => {
    return executeCreation(transaction);
  });
};

// =====================================================
// UPDATE ORDER
// =====================================================

const updateOrder = async (order, orderData, options = {}) => {
  return order.update(orderData, options);
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (
  order,
  orderStatus,
  options = {}
) => {
  return order.update({ orderStatus }, options);
};

// =====================================================
// UPDATE ORDER PAYMENT STATUS
// =====================================================

const updateOrderPaymentStatus = async (
  order,
  paymentStatus,
  options = {}
) => {
  return order.update({ paymentStatus }, options);
};

// =====================================================
// CANCEL ORDER
// =====================================================

const cancelOrder = async (order, options = {}) => {
  return order.update(
    {
      orderStatus: "CANCELLED",
      cancelledAt: new Date(),
    },
    options
  );
};

// =====================================================
// GET ORDER ITEMS
// =====================================================

const getOrderItems = async (orderId, options = {}) => {
  return OrderItem.findAll({
    where: { orderId },
    order: [["id", "ASC"]],
    ...options,
  });
};

// =====================================================
// GET ORDER ITEM BY ID
// =====================================================

const getOrderItemById = async (
  orderItemId,
  orderId,
  options = {}
) => {
  return OrderItem.findOne({
    where: {
      id: orderItemId,
      orderId,
    },
    ...options,
  });
};

// =====================================================
// UPDATE ORDER ITEM
// =====================================================

const updateOrderItem = async (
  orderItem,
  itemData,
  options = {}
) => {
  return orderItem.update(itemData, options);
};

// =====================================================
// DELETE ORDER ITEM
// =====================================================

const deleteOrderItem = async (orderItem, options = {}) => {
  return orderItem.destroy(options);
};

// =====================================================
// GET CHECKOUT ADDRESS FOR ORDER VALIDATION
// =====================================================

const getCheckoutAddressForUser = async (
  checkoutAddressId,
  userId,
  options = {}
) => {
  return CheckoutAddress.findOne({
    where: {
      id: checkoutAddressId,
      userId,
    },
    ...options,
  });
};

// =====================================================
// GET PRODUCT BY ID
// =====================================================

const getProductById = async (productId, options = {}) => {
  return Product.findByPk(productId, options);
};

// =====================================================
// GET PRODUCT VARIATION BY ID
// =====================================================

const getProductVariationById = async (
  productVariationId,
  options = {}
) => {
  return ProductVariation.findByPk(productVariationId, options);
};

// =====================================================
// GET ORDERABLE PRODUCT
// Used by order.service.js
// =====================================================

const getOrderableProduct = async (
  productId,
  productVariationId = null,
  options = {}
) => {
  const { transaction, lock } = options;

const queryOptions = {
  ...(options.transaction
    ? { transaction: options.transaction }
    : {}),
  ...(options.lock && options.transaction
    ? { lock: options.lock }
    : {}),
};

  const product = await Product.findByPk(productId, {
    ...queryOptions,
    include: [
      {
        association: "images",
        attributes: ["id", "image_url", "is_primary", "sort_order"],
        required: false,
      },
    ],
  });

  if (!product) {
    return null;
  }

  let variation = null;

  if (productVariationId !== null && productVariationId !== undefined) {
    variation = await ProductVariation.findOne({
      where: {
        id: productVariationId,
        product_id: product.id,
      },
      ...queryOptions,
    });

    if (!variation) {
      return {
        product,
        variation: null,
        stock: 0,
        unitPrice: null,
        unitDiscount: 0,
        taxRate: 0,
        productImage: null,
        variationAttributes: null,
      };
    }
  }

  const sellingPrice = Number(
    variation ? variation.price : product.price
  );

  if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
    throw new Error(`Invalid price for product ID ${product.id}.`);
  }

  const compareAtPrice = variation
    ? variation.compare_at_price
    : product.compare_at_price;

  const numericCompareAtPrice =
    compareAtPrice === null || compareAtPrice === undefined
      ? null
      : Number(compareAtPrice);

  // Order service expects original price and discount separately.
  const hasValidComparePrice =
    numericCompareAtPrice !== null &&
    Number.isFinite(numericCompareAtPrice) &&
    numericCompareAtPrice > sellingPrice;

  const unitPrice = hasValidComparePrice
    ? numericCompareAtPrice
    : sellingPrice;

  const unitDiscount = hasValidComparePrice
    ? numericCompareAtPrice - sellingPrice
    : 0;

  const images = product.images || [];

  const primaryImage =
    images.find((image) => image.is_primary) ||
    images
      .slice()
      .sort(
        (a, b) =>
          Number(a.sort_order || 0) - Number(b.sort_order || 0)
      )[0] ||
    null;

  return {
    product,
    variation,
    stock: Number(variation ? variation.stock : product.stock),
    unitPrice,
    unitDiscount,
    taxRate: 0,
    productImage: primaryImage?.image_url || null,
    variationAttributes: variation?.attributes || null,
  };
};

// =====================================================
// FIND COUPON BY CODE
// Runs inside the order transaction
// =====================================================

const findCouponForOrder = async (couponCode, options = {}) => {
  const normalizedCode = String(couponCode || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");

  if (!normalizedCode) {
    return null;
  }

const queryOptions = {
  ...(options.transaction
    ? { transaction: options.transaction }
    : {}),
  ...(options.lock && options.transaction
    ? { lock: options.lock }
    : {}),
};

  const discountCoupon = await DiscountCoupon.findOne({
    where: {
      code: normalizedCode,
      status: "ACTIVE",
    },
    ...queryOptions,
  });

  if (discountCoupon) {
    return {
      couponType: "DISCOUNT",
      couponId: discountCoupon.id,
      couponCode: discountCoupon.code,
      coupon: discountCoupon,
    };
  }

  const bogoCoupon = await BogoCoupon.findOne({
    where: {
      code: normalizedCode,
      status: "ACTIVE",
    },
    include: [
      {
        model: BogoCouponBuyProduct,
        as: "buyProducts",
        required: false,
      },
      {
        model: BogoCouponGetProduct,
        as: "getProducts",
        required: false,
      },
    ],
    ...queryOptions,
  });

  if (bogoCoupon) {
    return {
      couponType: "BOGO",
      couponId: bogoCoupon.id,
      couponCode: bogoCoupon.code,
      coupon: bogoCoupon,
    };
  }

  return null;
};

// =====================================================
// GET BOGO ELIGIBLE BUY PRODUCT IDS
// =====================================================

const getBogoEligibleBuyProductIds = async (
  bogoCouponId,
  options = {}
) => {
  const rows = await BogoCouponBuyProduct.findAll({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    attributes: ["product_id"],
    transaction: options.transaction,
  });

  return rows.map((row) => Number(row.product_id));
};

// =====================================================
// GET BOGO ELIGIBLE GIFT PRODUCT IDS
// =====================================================

const getBogoEligibleGiftProductIds = async (
  bogoCouponId,
  options = {}
) => {
  const rows = await BogoCouponGetProduct.findAll({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    attributes: ["product_id"],
    transaction: options.transaction,
  });

  return rows.map((row) => Number(row.product_id));
};
// =====================================================
// DECREASE STOCK SAFELY
// Must run inside the order transaction
// =====================================================

const decreaseOrderableProductStock = async (
  productId,
  productVariationId,
  quantity,
  options = {}
) => {
  const { transaction } = options;

  if (!transaction) {
    throw new Error(
      "A transaction is required to update order stock."
    );
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new Error("Invalid stock quantity.");
  }

  const { Op } = require("sequelize");

  if (productVariationId !== null && productVariationId !== undefined) {
    const [updatedRows] = await ProductVariation.update(
      {
        stock: sequelize.literal(`stock - ${quantity}`),
      },
      {
        where: {
          id: productVariationId,
          product_id: productId,
          status: "ACTIVE",
          stock: {
            [Op.gte]: quantity,
          },
        },
        transaction,
      }
    );

    return updatedRows === 1;
  }

  const [updatedRows] = await Product.update(
    {
      stock: sequelize.literal(`stock - ${quantity}`),
    },
    {
      where: {
        id: productId,
        status: "ACTIVE",
        stock: {
          [Op.gte]: quantity,
        },
      },
      transaction,
    }
  );

  return updatedRows === 1;
};

// =====================================================
// COUNT CUSTOMER ORDERS USING A COUPON
// =====================================================

const countCustomerCouponOrders = async (
  userId,
  couponCode,
  options = {}
) => {
  return Order.count({
    where: {
      userId,
      couponCode,
    },
    transaction: options.transaction,
  });
};

// =====================================================
// INCREMENT COUPON USAGE
// =====================================================


const incrementCouponUsage = async (
  couponType,
  couponId,
  options = {}
) => {
  const { transaction } = options;

  if (!transaction) {
    throw new Error(
      "A transaction is required to update coupon usage."
    );
  }

  if (
    !Number.isSafeInteger(Number(couponId)) ||
    Number(couponId) < 1
  ) {
    throw new Error("Invalid coupon ID.");
  }

  const normalizedType = String(couponType || "")
    .trim()
    .toUpperCase();

  let CouponModel;

  if (normalizedType === "DISCOUNT") {
    CouponModel = DiscountCoupon;
  } else if (normalizedType === "BOGO") {
    CouponModel = BogoCoupon;
  } else {
    throw new Error("Unsupported coupon type.");
  }

  const coupon = await CouponModel.findByPk(Number(couponId), {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!coupon) {
    throw new Error("Coupon not found while updating usage.");
  }

  const usageCount = Number(coupon.usage_count ?? 0);
  const usageLimit = coupon.usage_limit;

  if (
    usageLimit !== null &&
    usageLimit !== undefined &&
    usageCount >= Number(usageLimit)
  ) {
    throw new Error("Coupon has reached its usage limit.");
  }

  await coupon.increment("usage_count", {
    by: 1,
    transaction,
  });

  return true;
};

// =====================================================
// RESTORE ORDER ITEM STOCK
// Must run inside the order cancellation transaction
// =====================================================

const restoreOrderItemStock = async (
  productId,
  productVariationId,
  quantity,
  options = {}
) => {
  const { transaction } = options;

  if (!transaction) {
    throw new Error(
      "A transaction is required to restore order stock."
    );
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new Error("Invalid stock quantity.");
  }

  if (
    productVariationId !== null &&
    productVariationId !== undefined
  ) {
    const [updatedRows] = await ProductVariation.update(
      {
        stock: sequelize.literal(`stock + ${quantity}`),
      },
      {
        where: {
          id: productVariationId,
          product_id: productId,
        },
        transaction,
      }
    );

    if (updatedRows !== 1) {
      throw new Error(
        `Unable to restore stock for product variation ${productVariationId}.`
      );
    }

    return true;
  }

  const [updatedRows] = await Product.update(
    {
      stock: sequelize.literal(`stock + ${quantity}`),
    },
    {
      where: {
        id: productId,
      },
      transaction,
    }
  );

  if (updatedRows !== 1) {
    throw new Error(
      `Unable to restore stock for product ${productId}.`
    );
  }

  return true;
};


module.exports = {
  getOrdersByUserId,
  getOrderById,
  getOrderByUuid,
  getOrderByNumber,
  createOrder,
  createOrderItems,
  createOrderWithItems,
  updateOrder,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder,
  getOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
  getCheckoutAddressForUser,
  getProductById,
  getProductVariationById,
  getOrderableProduct,
  findCouponForOrder,
  getBogoEligibleBuyProductIds,
getBogoEligibleGiftProductIds,
  decreaseOrderableProductStock,
  countCustomerCouponOrders,
  incrementCouponUsage,
  restoreOrderItemStock,
};