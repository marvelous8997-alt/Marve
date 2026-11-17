
"use strict";

const { sequelize } = require("../../database/models");
const {
  adminOrderRepository,
} = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* =========================================================
   CONSTANTS
========================================================= */

const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
];

const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

const PAYMENT_METHODS = ["ONLINE", "COD"];

/* =========================================================
   HELPERS
========================================================= */

const normalizeIdentifier = (value) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new ApiError(400, "Order identifier is required.");
  }

  return String(value).trim();
};

const serializeOrder = (order) => {
  if (!order) return null;

  const data = typeof order.toJSON === "function"
    ? order.toJSON()
    : order;

  const items = Array.isArray(data.items) ? data.items : [];

  return {
    ...data,

    // Keep original database fields and expose consistent UI fields.
    id: data.id,
    uuid: data.uuid,
    orderNumber: data.orderNumber,

    customerId: data.userId ?? data.user?.id ?? null,
    customerName:
      data.deliveryFullName ||
      data.user?.name ||
      data.user?.fullName ||
      "Customer",
    customerEmail:
      data.deliveryEmail ||
      data.user?.email ||
      null,
    customerPhone:
      data.deliveryPhone ||
      data.user?.phone ||
      null,

    status: data.orderStatus,
    subtotal: Number(data.subtotal || 0),
    productDiscount: Number(data.productDiscount || 0),
    couponDiscount: Number(data.couponDiscount || 0),
    discount:
      Number(data.productDiscount || 0) +
      Number(data.couponDiscount || 0),
    tax: Number(data.taxAmount || 0),
    shipping: Number(data.shippingAmount || 0),
    codCharge: Number(data.codCharge || 0),
    total: Number(data.totalAmount || 0),

    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,

    itemCount: items.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ),

    items: items.map((item) => {
      const itemData =
        typeof item.toJSON === "function" ? item.toJSON() : item;

      const attributes = itemData.variationAttributes || {};

      return {
        ...itemData,

        productId: itemData.productId,
        productName: itemData.productName,
        productSlug: itemData.productSlug,
        sku: itemData.variationSku || itemData.productSku || null,
        productSku: itemData.productSku || null,
        variationName: itemData.variationName || null,
        variationSku: itemData.variationSku || null,
        variationAttributes: attributes,
        image: itemData.productImage || null,

        quantity: Number(itemData.quantity || 0),
        price: Number(itemData.unitPrice || 0),
        unitDiscount: Number(itemData.unitDiscount || 0),
        taxRate: Number(itemData.taxRate || 0),
        taxAmount: Number(itemData.taxAmount || 0),
        total: Number(itemData.lineTotal || 0),

        isFreeGift: Boolean(itemData.isFreeGift),
      };
    }),

    shippingAddress: {
      name: data.deliveryFullName || "",
      phone: data.deliveryPhone || "",
      addressLine1: [
        data.deliveryHouseNumber,
        data.deliveryAddress,
      ].filter(Boolean).join(", "),
      addressLine2: [
        data.deliveryLocality,
        data.deliveryLandmark,
      ].filter(Boolean).join(", "),
      city: data.deliveryCity || "",
      state: data.deliveryState || "",
      postalCode: data.deliveryPincode || "",
      country: data.deliveryPincodeCountry || "IN",
    },

    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    placedAt: data.placedAt || null,
    cancelledAt: data.cancelledAt || null,
  };
};

const validateListQuery = (query = {}) => {
  const normalized = { ...query };

  if (
    normalized.orderStatus &&
    !ORDER_STATUSES.includes(normalized.orderStatus)
  ) {
    throw new ApiError(400, "Invalid order status filter.");
  }

  if (
    normalized.paymentStatus &&
    !PAYMENT_STATUSES.includes(normalized.paymentStatus)
  ) {
    throw new ApiError(400, "Invalid payment status filter.");
  }

  if (
    normalized.paymentMethod &&
    !PAYMENT_METHODS.includes(normalized.paymentMethod)
  ) {
    throw new ApiError(400, "Invalid payment method filter.");
  }

  if (normalized.dateFrom && Number.isNaN(Date.parse(normalized.dateFrom))) {
    throw new ApiError(400, "Invalid start date.");
  }

  if (normalized.dateTo && Number.isNaN(Date.parse(normalized.dateTo))) {
    throw new ApiError(400, "Invalid end date.");
  }

  if (
    normalized.dateFrom &&
    normalized.dateTo &&
    new Date(normalized.dateFrom) > new Date(normalized.dateTo)
  ) {
    throw new ApiError(400, "Start date cannot be after end date.");
  }

  return normalized;
};

/* =========================================================
   GET ORDER LIST
========================================================= */

const getOrders = async (query = {}) => {
  try {
    const filters = validateListQuery(query);

    const result = await adminOrderRepository.getOrders(filters);

    return {
      count: result.count,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      rows: result.rows.map(serializeOrder),
    };
  } catch (error) {
    logger.error("Admin get orders failed:", error);
    throw error;
  }
};

/* =========================================================
   GET ORDER DETAILS
========================================================= */

const getOrder = async (identifier) => {
  try {
    const value = normalizeIdentifier(identifier);

    // Numeric identifiers use the primary key; other values use UUID.
    const order = /^\d+$/.test(value)
      ? await adminOrderRepository.findById(value)
      : await adminOrderRepository.findByUuid(value);

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    return serializeOrder(order);
  } catch (error) {
    logger.error("Admin get order details failed:", error);
    throw error;
  }
};

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

const updateOrderStatus = async (identifier, status) => {
  const transaction = await sequelize.transaction();

  try {
    const value = normalizeIdentifier(identifier);

    if (!ORDER_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid order status.");
    }

    const order = /^\d+$/.test(value)
      ? await adminOrderRepository.findById(value, transaction)
      : await adminOrderRepository.findByUuid(value);

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    if (order.orderStatus === status) {
      await transaction.commit();
      return serializeOrder(order);
    }

    // Prevent accidentally moving a completed/cancelled order backwards.
    const terminalStatuses = ["CANCELLED", "RETURNED"];

    if (
      terminalStatuses.includes(order.orderStatus) &&
      status !== order.orderStatus
    ) {
      throw new ApiError(
        400,
        `An order with status ${order.orderStatus} cannot be changed.`
      );
    }

    await adminOrderRepository.updateOrderStatus(
      order,
      status,
      transaction
    );

    await transaction.commit();

    const updatedOrder = /^\d+$/.test(value)
      ? await adminOrderRepository.findById(value)
      : await adminOrderRepository.findByUuid(value);

    return serializeOrder(updatedOrder);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error("Admin update order status failed:", error);
    throw error;
  }
};

/* =========================================================
   CANCEL ORDER
========================================================= */

/* =========================================================
   CANCEL ORDER
========================================================= */

const cancelOrder = async (identifier) => {
  const transaction = await sequelize.transaction();

  try {
    const value = normalizeIdentifier(identifier);

    // Find and lock order using UUID or numeric ID.
    const order = /^\d+$/.test(value)
      ? await adminOrderRepository.findByIdForUpdate(
          Number(value),
          transaction
        )
      : await adminOrderRepository.findByUuidForUpdate(
          value,
          transaction
        );

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    const currentStatus = String(
      order.orderStatus || ""
    ).trim().toUpperCase();

    // Admin can cancel only before PROCESSING.
    const cancellableStatuses = [
      "PENDING_PAYMENT",
      "CONFIRMED",
    ];

    if (!cancellableStatuses.includes(currentStatus)) {
      throw new ApiError(
        409,
        `Order with status ${currentStatus} cannot be cancelled.`
      );
    }

    // Check order payment status.
    const paymentStatus = String(
      order.paymentStatus || ""
    ).trim().toUpperCase();

    const payments = Array.isArray(order.payments)
      ? order.payments
      : [];

    const hasSuccessfulPayment = [
      "PAID",
      "CAPTURED",
      "PARTIALLY_REFUNDED",
      "REFUNDED",
    ].includes(paymentStatus) ||
      payments.some((payment) =>
        ["PAID", "CAPTURED", "PARTIALLY_REFUNDED", "REFUNDED"].includes(
          String(payment.status || "").trim().toUpperCase()
        )
      );

    if (hasSuccessfulPayment) {
      throw new ApiError(
        409,
        "This order has a successful payment. Process the payment refund before cancelling this order."
      );
    }

    if (paymentStatus === "PROCESSING") {
      throw new ApiError(
        409,
        "Payment is currently processing. Please wait before cancelling this order."
      );
    }

    // Validate order items.
    const orderItems = Array.isArray(order.items)
      ? order.items
      : [];

    if (orderItems.length === 0) {
      throw new ApiError(
        409,
        "Order items were not found. This order cannot be cancelled."
      );
    }

    // Restore stock for all order items, including free gift items.
    for (const item of orderItems) {
      await adminOrderRepository.restoreOrderItemStock(
        item.productId,
        item.productVariationId,
        Number(item.quantity),
        transaction
      );
    }

    // Update order status to CANCELLED.
    await adminOrderRepository.updateOrderStatus(
      order,
      "CANCELLED",
      transaction
    );

    await transaction.commit();

    // Fetch updated order after transaction.
    const updatedOrder = /^\d+$/.test(value)
      ? await adminOrderRepository.findById(Number(value))
      : await adminOrderRepository.findByUuid(value);

    if (!updatedOrder) {
      throw new ApiError(
        404,
        "Cancelled order could not be fetched."
      );
    }

    logger.info(
      `Admin cancelled order successfully. Order ID: ${order.id}, UUID: ${order.uuid}`
    );

    return serializeOrder(updatedOrder);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error("Admin cancel order failed:", error);
    throw error;
  }
};

/* =========================================================
   GET ORDER STATUS COUNTS
========================================================= */

const getOrderStatusCounts = async () => {
  try {
    return await adminOrderRepository.getOrderStatusCounts();
  } catch (error) {
    logger.error("Admin get order status counts failed:", error);
    throw error;
  }
};


module.exports = {
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStatusCounts,
};
