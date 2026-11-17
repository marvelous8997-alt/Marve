"use strict";

const { sequelize, Payment, Order } = require("../../database/models");
const { adminPaymentRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* =========================================================
   CONSTANTS
========================================================= */

const PAYMENT_STATUSES = [
  "CREATED",
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

const PAYMENT_METHODS = [
  "ONLINE",
  "COD",
  "UPI",
  "CARD",
  "NETBANKING",
  "WALLET",
  "EMI",
  "OTHER",
];

const PAYMENT_PROVIDERS = ["RAZORPAY", "COD"];

const REFUND_REASONS = [
  "CUSTOMER_REQUEST",
  "ORDER_CANCELLED",
  "PRODUCT_RETURNED",
  "PRODUCT_DAMAGED",
  "DUPLICATE_PAYMENT",
  "PAYMENT_ERROR",
  "OTHER",
];

/* =========================================================
   HELPERS
========================================================= */

const normalizeIdentifier = (value) => {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    throw new ApiError(400, "Payment identifier is required.");
  }

  return String(value).trim();
};

const toPlainObject = (record) => {
  if (!record) return null;

  return typeof record.toJSON === "function"
    ? record.toJSON()
    : record;
};

const serializePayment = (payment) => {
  const data = toPlainObject(payment);

  if (!data) return null;

  const order = toPlainObject(data.order);
  const user = toPlainObject(order?.user);

  const customerName =
    order?.deliveryFullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.fullName ||
    "Customer";

  const customerEmail =
    order?.deliveryEmail || user?.email || null;

  const customerPhone =
    order?.deliveryPhone || user?.phone || null;

  const statusMap = {
    CAPTURED: "PAID",
  };

  return {
    ...data,

    // Frontend-compatible identifiers.
    paymentId: data.paymentNumber,
    orderId: order?.id ?? data.orderId,
    orderNumber: order?.orderNumber || "N/A",

    customerId: order?.userId ?? user?.id ?? null,
    customerName,
    customerEmail,
    customerPhone,

    // Preserve the actual backend status separately.
    status: statusMap[data.status] || data.status,
    paymentStatus: data.status,

    amount: Number(data.amount || 0),
    refundedAmount: Number(data.refundedAmount || 0),
    refundableAmount: Math.max(
      0,
      Number(data.amount || 0) - Number(data.refundedAmount || 0)
    ),

    method: data.method,
    gateway: data.provider,

    transactionId: data.razorpayPaymentId || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,

    order: order
      ? {
          id: order.id,
          uuid: order.uuid,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          totalAmount: Number(order.totalAmount || 0),
          currency: order.currency || data.currency || "INR",
        }
      : null,
  };
};

const validateListQuery = (query = {}) => {
  const filters = { ...query };

  if (
    filters.status &&
    !PAYMENT_STATUSES.includes(String(filters.status).toUpperCase()) &&
    String(filters.status).toUpperCase() !== "PAID"
  ) {
    throw new ApiError(400, "Invalid payment status filter.");
  }

  if (
    filters.method &&
    !PAYMENT_METHODS.includes(String(filters.method).toUpperCase())
  ) {
    throw new ApiError(400, "Invalid payment method filter.");
  }

  if (
    filters.provider &&
    !PAYMENT_PROVIDERS.includes(String(filters.provider).toUpperCase())
  ) {
    throw new ApiError(400, "Invalid payment provider filter.");
  }

  if (
    filters.dateFrom &&
    Number.isNaN(Date.parse(filters.dateFrom))
  ) {
    throw new ApiError(400, "Invalid start date.");
  }

  if (
    filters.dateTo &&
    Number.isNaN(Date.parse(filters.dateTo))
  ) {
    throw new ApiError(400, "Invalid end date.");
  }

  if (
    filters.dateFrom &&
    filters.dateTo &&
    new Date(filters.dateFrom) > new Date(filters.dateTo)
  ) {
    throw new ApiError(
      400,
      "Start date cannot be after end date."
    );
  }

  // Frontend uses PAID; database stores CAPTURED.
  if (String(filters.status || "").toUpperCase() === "PAID") {
    filters.status = "CAPTURED";
  }

  if (filters.status) {
    filters.status = String(filters.status).toUpperCase();
  }

  if (filters.method) {
    filters.method = String(filters.method).toUpperCase();
  }

  if (filters.provider) {
    filters.provider = String(filters.provider).toUpperCase();
  }

  return filters;
};

/* =========================================================
   GET PAYMENT LIST
========================================================= */

const getPayments = async (query = {}) => {
  try {
    const filters = validateListQuery(query);

    const result = await adminPaymentRepository.getPayments(filters);

    return {
      count: result.count,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      rows: result.rows.map(serializePayment),
    };
  } catch (error) {
    logger.error("Admin get payments failed:", error);
    throw error;
  }
};

/* =========================================================
   GET PAYMENT DETAILS
========================================================= */

const getPayment = async (identifier) => {
  try {
    const value = normalizeIdentifier(identifier);

    const payment = /^\d+$/.test(value)
      ? await adminPaymentRepository.findById(value)
      : await adminPaymentRepository.findByUuid(value);

    if (!payment) {
      throw new ApiError(404, "Payment not found.");
    }

    return serializePayment(payment);
  } catch (error) {
    logger.error("Admin get payment details failed:", error);
    throw error;
  }
};

/* =========================================================
   GET PAYMENT SUMMARY
========================================================= */

const getPaymentSummary = async () => {
  try {
    return await adminPaymentRepository.getPaymentSummary();
  } catch (error) {
    logger.error("Admin get payment summary failed:", error);
    throw error;
  }
};

/* =========================================================
   GET PAYMENT STATUS COUNTS
========================================================= */

const getPaymentStatusCounts = async () => {
  try {
    return await adminPaymentRepository.getPaymentStatusCounts();
  } catch (error) {
    logger.error("Admin get payment status counts failed:", error);
    throw error;
  }
};

/* =========================================================
   REFUND VALIDATION
========================================================= */

// This validates refund requests only.
// Do not update refundedAmount/status until the payment gateway
// confirms the refund and the result has been persisted safely.

const validateRefundRequest = async (
  identifier,
  { amount, reason } = {}
) => {
  const value = normalizeIdentifier(identifier);

  const refundAmount = Number(amount);

  if (
    !Number.isFinite(refundAmount) ||
    refundAmount <= 0 ||
    Math.round(refundAmount * 100) !== refundAmount * 100
  ) {
    throw new ApiError(
      400,
      "Refund amount must be a positive amount with at most two decimal places."
    );
  }

  if (!REFUND_REASONS.includes(reason)) {
    throw new ApiError(400, "Invalid refund reason.");
  }

  const payment = /^\d+$/.test(value)
    ? await adminPaymentRepository.findById(value)
    : await adminPaymentRepository.findByUuid(value);

  if (!payment) {
    throw new ApiError(404, "Payment not found.");
  }

  if (payment.status !== "CAPTURED" &&
      payment.status !== "PARTIALLY_REFUNDED") {
    throw new ApiError(
      400,
      "Only captured or partially refunded payments can be refunded."
    );
  }

  if (
    payment.provider !== "RAZORPAY" ||
    !payment.razorpayPaymentId
  ) {
    throw new ApiError(
      400,
      "A valid Razorpay payment is required for an online refund."
    );
  }

  const originalAmount = Number(payment.amount || 0);
  const alreadyRefunded = Number(payment.refundedAmount || 0);
  const refundableAmount = Math.max(
    0,
    originalAmount - alreadyRefunded
  );

  if (refundAmount > refundableAmount) {
    throw new ApiError(
      400,
      `Refund amount cannot exceed the refundable balance of ${refundableAmount.toFixed(2)} ${payment.currency}.`
    );
  }

  return {
    payment: serializePayment(payment),
    refund: {
      amount: Number(refundAmount.toFixed(2)),
      reason,
      currency: payment.currency,
      refundableAmount,
    },
  };
};

/* =========================================================
   REFUND PAYMENT
========================================================= */

// Deliberately not implemented as a database-only refund.
// The controller must not expose a successful refund endpoint
// until the Razorpay gateway call, idempotency protection,
// and persisted refund record are implemented.

const refundPayment = async () => {
  throw new ApiError(
    501,
    "Refund processing is not configured yet. Integrate the Razorpay refund API and persist the gateway response before enabling refunds."
  );
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getPayments,
  getPayment,
  getPaymentSummary,
  getPaymentStatusCounts,
  validateRefundRequest,
  refundPayment,
};
