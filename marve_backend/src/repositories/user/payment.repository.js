"use strict";

const {
  Order,
  Payment,
  PaymentWebhookEvent,
  sequelize,
} = require("../../database/models");

// GET ORDER BY ID FOR A USER
const getOrderByIdForUser = async (
  orderId,
  userId,
  options = {}
) => {
  return await Order.findOne({
    where: {
      id: orderId,
      userId,
    },
    ...options,
  });
};

// GET ORDER BY ID
const getOrderById = async (orderId, options = {}) => {
  return await Order.findByPk(orderId, options);
};

// GET ORDER BY ID WITH LOCK
const getOrderByIdForUpdate = async (
  orderId,
  userId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "A transaction is required to lock an order."
    );
  }

  return await Order.findOne({
    where: {
      id: orderId,
      userId,
    },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};

// GET PAYMENT BY ID FOR A USER'S ORDER
const getPaymentByIdForUser = async (
  paymentId,
  userId,
  options = {}
) => {
  return await Payment.findOne({
    where: {
      id: paymentId,
    },
    include: [
      {
        model: Order,
        as: "order",
        where: {
          userId,
        },
        attributes: ["id", "uuid", "orderNumber", "userId"],
      },
    ],
    ...options,
  });
};

// GET PAYMENT BY ID
const getPaymentById = async (paymentId, options = {}) => {
  return await Payment.findByPk(paymentId, options);
};

// GET PAYMENT BY PAYMENT NUMBER
const getPaymentByNumber = async (
  paymentNumber,
  options = {}
) => {
  return await Payment.findOne({
    where: {
      paymentNumber,
    },
    ...options,
  });
};

// GET PAYMENT BY RAZORPAY ORDER ID
const getPaymentByRazorpayOrderId = async (
  razorpayOrderId,
  options = {}
) => {
  return await Payment.findOne({
    where: {
      razorpayOrderId,
    },
    ...options,
  });
};

// GET PAYMENT BY RAZORPAY PAYMENT ID
const getPaymentByRazorpayPaymentId = async (
  razorpayPaymentId,
  options = {}
) => {
  return await Payment.findOne({
    where: {
      razorpayPaymentId,
    },
    ...options,
  });
};

// GET PAYMENTS FOR AN ORDER
const getPaymentsByOrderId = async (
  orderId,
  options = {}
) => {
  return await Payment.findAll({
    where: {
      orderId,
    },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// CREATE PAYMENT
const createPayment = async (paymentData, options = {}) => {
  return await Payment.create(paymentData, options);
};

// UPDATE PAYMENT
const updatePayment = async (
  payment,
  paymentData,
  options = {}
) => {
  return await payment.update(paymentData, options);
};

// UPDATE PAYMENT STATUS
const updatePaymentStatus = async (
  payment,
  status,
  options = {}
) => {
  return await payment.update(
    { status },
    options
  );
};

// GET WEBHOOK EVENT BY EVENT ID
const getWebhookEventByEventId = async (
  eventId,
  options = {}
) => {
  return await PaymentWebhookEvent.findOne({
    where: {
      eventId,
    },
    ...options,
  });
};

// CREATE WEBHOOK EVENT
const createWebhookEvent = async (
  eventData,
  options = {}
) => {
  return await PaymentWebhookEvent.create(
    eventData,
    options
  );
};

// UPDATE WEBHOOK EVENT
const updateWebhookEvent = async (
  webhookEvent,
  eventData,
  options = {}
) => {
  return await webhookEvent.update(
    eventData,
    options
  );
};

// GET WEBHOOK EVENTS FOR A PAYMENT
const getWebhookEventsByPaymentId = async (
  paymentId,
  options = {}
) => {
  return await PaymentWebhookEvent.findAll({
    where: {
      paymentId,
    },
    order: [
      ["createdAt", "DESC"],
    ],
    ...options,
  });
};

// CREATE PAYMENT AND UPDATE ORDER IN ONE TRANSACTION
const createPaymentForOrder = async (
  order,
  paymentData,
  options = {}
) => {
  const executeCreation = async (transaction) => {
    const payment = await Payment.create(paymentData, {
      transaction,
    });

    // Keep the order pending until payment is verified.
    await order.update(
      {
        paymentStatus: "PENDING",
      },
      { transaction }
    );

    return payment;
  };

  if (options.transaction) {
    return await executeCreation(options.transaction);
  }

  return await sequelize.transaction(async (transaction) => {
    return await executeCreation(transaction);
  });
};

// GET PAYMENT BY ID WITH ROW LOCK
const getPaymentByIdForUpdate = async (
  paymentId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "A transaction is required to lock a payment."
    );
  }

  return Payment.findByPk(paymentId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};

module.exports = {
  getOrderByIdForUser,
  getOrderById,
  getOrderByIdForUpdate,
  getPaymentByIdForUser,
  getPaymentById,
  getPaymentByNumber,
  getPaymentByRazorpayOrderId,
  getPaymentByRazorpayPaymentId,
  getPaymentsByOrderId,
  createPayment,
  updatePayment,
  updatePaymentStatus,
  getWebhookEventByEventId,
  createWebhookEvent,
  updateWebhookEvent,
  getWebhookEventsByPaymentId,
  createPaymentForOrder,
  getPaymentByIdForUpdate
};