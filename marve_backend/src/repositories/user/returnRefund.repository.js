
"use strict";

const {
  ReturnRefund,
  ReturnRequest,
  Payment,
  sequelize,
} = require("../../database/models");

/* =========================================================
   GET ALL RETURN REFUNDS
========================================================= */

const getAllReturnRefunds = async (options = {}) => {
  return await ReturnRefund.findAll({
    order: [["createdAt", "DESC"]],
    ...options,
  });
};

/* =========================================================
   GET RETURN REFUND BY ID
========================================================= */

const getReturnRefundById = async (
  id,
  options = {}
) => {
  return await ReturnRefund.findByPk(id, {
    ...options,
  });
};

/* =========================================================
   GET RETURN REFUND BY UUID
========================================================= */

const getReturnRefundByUuid = async (
  uuid,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { uuid },
    ...options,
  });
};

/* =========================================================
   GET RETURN REFUND BY REFUND NUMBER
========================================================= */

const getReturnRefundByNumber = async (
  refundNumber,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { refundNumber },
    ...options,
  });
};

/* =========================================================
   GET REFUNDS BY RETURN REQUEST ID
========================================================= */

const getReturnRefundsByRequestId = async (
  returnRequestId,
  options = {}
) => {
  return await ReturnRefund.findAll({
    where: { returnRequestId },
    order: [["createdAt", "DESC"]],
    ...options,
  });
};

/* =========================================================
   GET LATEST REFUND BY RETURN REQUEST ID
========================================================= */

const getLatestReturnRefundByRequestId = async (
  returnRequestId,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { returnRequestId },
    order: [["createdAt", "DESC"]],
    ...options,
  });
};

/* =========================================================
   GET REFUND BY PAYMENT ID
========================================================= */

const getReturnRefundsByPaymentId = async (
  paymentId,
  options = {}
) => {
  return await ReturnRefund.findAll({
    where: { paymentId },
    order: [["createdAt", "DESC"]],
    ...options,
  });
};

/* =========================================================
   GET REFUND BY GATEWAY REFUND ID
========================================================= */

const getReturnRefundByGatewayRefundId = async (
  gatewayRefundId,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { gatewayRefundId },
    ...options,
  });
};

/* =========================================================
   GET REFUNDS BY STATUS
========================================================= */

const getReturnRefundsByStatus = async (
  status,
  options = {}
) => {
  return await ReturnRefund.findAll({
    where: { status },
    order: [["createdAt", "DESC"]],
    ...options,
  });
};

/* =========================================================
   GET REFUNDS BY PAYMENT METHOD
========================================================= */

const getReturnRefundsByPaymentMethod = async (
  paymentMethod,
  options = {}
) => {
  return await ReturnRefund.findAll({
    where: { paymentMethod },
    order: [["createdAt", "DESC"]],
    ...options,
  });
};

/* =========================================================
   GET USER REFUND BY ID
   USER OWNERSHIP CHECK
========================================================= */

const getUserReturnRefundById = async (
  id,
  userId,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { id },
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        where: { userId },
        attributes: [
          "id",
          "uuid",
          "returnNumber",
          "orderId",
          "userId",
          "status",
        ],
        required: true,
      },
    ],
    ...options,
  });
};

/* =========================================================
   GET USER REFUND BY UUID
   USER OWNERSHIP CHECK
========================================================= */

const getUserReturnRefundByUuid = async (
  uuid,
  userId,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { uuid },
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        where: { userId },
        attributes: [
          "id",
          "uuid",
          "returnNumber",
          "orderId",
          "userId",
          "status",
        ],
        required: true,
      },
    ],
    ...options,
  });
};

/* =========================================================
   GET USER REFUNDS BY RETURN REQUEST ID
   USER OWNERSHIP CHECK
========================================================= */

const getUserReturnRefundsByRequestId = async (
  returnRequestId,
  userId,
  options = {}
) => {
  return await ReturnRefund.findAll({
    where: { returnRequestId },
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        where: { userId },
        attributes: [
          "id",
          "uuid",
          "returnNumber",
          "orderId",
          "userId",
          "status",
        ],
        required: true,
      },
    ],
    order: [["createdAt", "DESC"]],
    ...options,
  });
};

/* =========================================================
   GET USER REFUND DETAILS
   INCLUDING PAYMENT DETAILS
========================================================= */

const getUserReturnRefundDetails = async (
  id,
  userId,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { id },
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        where: { userId },
        attributes: [
          "id",
          "uuid",
          "returnNumber",
          "orderId",
          "userId",
          "status",
          "refundAmount",
          "currency",
        ],
        required: true,
      },
      {
        model: Payment,
        as: "payment",
        required: false,
      },
    ],
    ...options,
  });
};

/* =========================================================
   CREATE RETURN REFUND
========================================================= */

const createReturnRefund = async (
  data,
  options = {}
) => {
  return await ReturnRefund.create(data, {
    ...options,
  });
};

/* =========================================================
   CREATE MULTIPLE RETURN REFUNDS
========================================================= */

const createReturnRefunds = async (
  data,
  options = {}
) => {
  return await ReturnRefund.bulkCreate(data, {
    ...options,
  });
};

/* =========================================================
   UPDATE RETURN REFUND
========================================================= */

const updateReturnRefund = async (
  id,
  data,
  options = {}
) => {
  const refund = await ReturnRefund.findByPk(id, {
    transaction: options.transaction,
  });

  if (!refund) {
    return null;
  }

  return await refund.update(data, {
    ...options,
  });
};

/* =========================================================
   UPDATE REFUND STATUS
========================================================= */

const updateReturnRefundStatus = async (
  id,
  status,
  options = {}
) => {
  const refund = await ReturnRefund.findByPk(id, {
    transaction: options.transaction,
  });

  if (!refund) {
    return null;
  }

  return await refund.update(
    { status },
    {
      ...options,
    }
  );
};

/* =========================================================
   UPDATE REFUND BY GATEWAY REFUND ID
========================================================= */

const updateReturnRefundByGatewayRefundId = async (
  gatewayRefundId,
  data,
  options = {}
) => {
  const [updatedCount] = await ReturnRefund.update(data, {
    where: { gatewayRefundId },
    ...options,
  });

  return updatedCount;
};

/* =========================================================
   GET TOTAL REFUNDED AMOUNT
   COMPLETED REFUNDS ONLY
========================================================= */

const getTotalCompletedRefundAmount = async (
  returnRequestId,
  options = {}
) => {
  const total = await ReturnRefund.sum("refundAmount", {
    where: {
      returnRequestId,
      status: "COMPLETED",
    },
    ...options,
  });

  return Number(total || 0);
};

/* =========================================================
   GET TOTAL REFUND AMOUNT
   ALL REFUND STATUSES
========================================================= */

const getTotalRefundAmount = async (
  returnRequestId,
  options = {}
) => {
  const total = await ReturnRefund.sum("refundAmount", {
    where: { returnRequestId },
    ...options,
  });

  return Number(total || 0);
};

/* =========================================================
   GET REFUNDS COUNT BY REQUEST ID
========================================================= */

const getReturnRefundsCountByRequestId = async (
  returnRequestId,
  options = {}
) => {
  return await ReturnRefund.count({
    where: { returnRequestId },
    ...options,
  });
};

/* =========================================================
   DELETE RETURN REFUND
   INTERNAL USE ONLY
========================================================= */

const deleteReturnRefund = async (
  id,
  options = {}
) => {
  return await ReturnRefund.destroy({
    where: { id },
    ...options,
  });
};

/* =========================================================
   DELETE REFUNDS BY RETURN REQUEST ID
   INTERNAL USE ONLY
========================================================= */

const deleteReturnRefundsByRequestId = async (
  returnRequestId,
  options = {}
) => {
  return await ReturnRefund.destroy({
    where: { returnRequestId },
    ...options,
  });
};

/* =========================================================
   TRANSACTION HELPER
========================================================= */

const withTransaction = async (
  callback,
  options = {}
) => {
  if (options.transaction) {
    return await callback(options.transaction);
  }

  return await sequelize.transaction(async (transaction) => {
    return await callback(transaction);
  });
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getAllReturnRefunds,
  getReturnRefundById,
  getReturnRefundByUuid,
  getReturnRefundByNumber,

  getReturnRefundsByRequestId,
  getLatestReturnRefundByRequestId,
  getReturnRefundsByPaymentId,
  getReturnRefundByGatewayRefundId,

  getReturnRefundsByStatus,
  getReturnRefundsByPaymentMethod,

  getUserReturnRefundById,
  getUserReturnRefundByUuid,
  getUserReturnRefundsByRequestId,
  getUserReturnRefundDetails,

  createReturnRefund,
  createReturnRefunds,

  updateReturnRefund,
  updateReturnRefundStatus,
  updateReturnRefundByGatewayRefundId,

  getTotalCompletedRefundAmount,
  getTotalRefundAmount,
  getReturnRefundsCountByRequestId,

  deleteReturnRefund,
  deleteReturnRefundsByRequestId,

  withTransaction,
};
