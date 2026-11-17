
"use strict";

const {
  ReturnItem,
  ReturnRequest,
  OrderItem,
  sequelize,
} = require("../../database/models");
const { Op } = require("sequelize");

const ACTIVE_RETURN_STATUSES = [
  "REQUESTED",
  "APPROVED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "RECEIVED",
  "INSPECTING",
  "REFUND_APPROVED",
  "REFUND_INITIATED",
  "REFUNDED",
];

// =====================================================
// GET ALL RETURN ITEMS
// =====================================================

const getAllReturnItems = async (options = {}) => {
  return ReturnItem.findAll({
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN ITEM BY ID
// =====================================================

const getReturnItemById = async (
  returnItemId,
  options = {}
) => {
  return ReturnItem.findByPk(returnItemId, options);
};

// =====================================================
// GET RETURN ITEM BY UUID
// =====================================================

const getReturnItemByUuid = async (
  uuid,
  options = {}
) => {
  return ReturnItem.findOne({
    where: { uuid },
    ...options,
  });
};

// =====================================================
// GET RETURN ITEMS BY RETURN REQUEST ID
// =====================================================

const getReturnItemsByRequestId = async (
  returnRequestId,
  options = {}
) => {
  return ReturnItem.findAll({
    where: { returnRequestId },
    order: [
      ["createdAt", "ASC"],
      ["id", "ASC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN ITEMS BY ORDER ITEM ID
// =====================================================

const getReturnItemsByOrderItemId = async (
  orderItemId,
  options = {}
) => {
  return ReturnItem.findAll({
    where: { orderItemId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN ITEM BY REQUEST ID AND ORDER ITEM ID
// =====================================================

const getReturnItemByRequestAndOrderItem = async (
  returnRequestId,
  orderItemId,
  options = {}
) => {
  return ReturnItem.findOne({
    where: {
      returnRequestId,
      orderItemId,
    },
    ...options,
  });
};

// =====================================================
// GET RETURN ITEM WITH ORDER ITEM DETAILS
// =====================================================

const getReturnItemDetails = async (
  returnItemId,
  options = {}
) => {
  return ReturnItem.findByPk(returnItemId, {
    include: [
      {
        model: OrderItem,
        as: "orderItem",
        required: false,
      },
      {
        model: ReturnRequest,
        as: "returnRequest",
        required: false,
      },
    ],
    ...options,
  });
};

// =====================================================
// GET USER RETURN ITEM DETAILS
// =====================================================

const getUserReturnItemDetails = async (
  returnItemId,
  userId,
  options = {}
) => {
  return ReturnItem.findOne({
    where: {
      id: returnItemId,
    },
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        attributes: ["id", "uuid", "returnNumber", "userId", "status"],
        where: { userId },
        required: true,
      },
      {
        model: OrderItem,
        as: "orderItem",
        required: false,
      },
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN ITEMS WITH ORDER ITEM DETAILS BY REQUEST ID
// =====================================================

const getReturnItemsWithOrderDetails = async (
  returnRequestId,
  options = {}
) => {
  return ReturnItem.findAll({
    where: { returnRequestId },
    include: [
      {
        model: OrderItem,
        as: "orderItem",
        required: false,
      },
    ],
    order: [
      ["createdAt", "ASC"],
      ["id", "ASC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN ITEMS BY INSPECTION CONDITION
// =====================================================

const getReturnItemsByCondition = async (
  itemCondition,
  options = {}
) => {
  return ReturnItem.findAll({
    where: { itemCondition },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// CREATE RETURN ITEM
// =====================================================

const createReturnItem = async (
  returnItemData,
  options = {}
) => {
  return ReturnItem.create(returnItemData, options);
};

// =====================================================
// CREATE MULTIPLE RETURN ITEMS
// =====================================================

const createReturnItems = async (
  returnItemsData,
  options = {}
) => {
  if (!Array.isArray(returnItemsData) || returnItemsData.length === 0) {
    throw new Error("At least one return item is required.");
  }

  return ReturnItem.bulkCreate(returnItemsData, {
    validate: true,
    ...options,
  });
};

// =====================================================
// CREATE RETURN ITEMS WITH TRANSACTION
// =====================================================

const createReturnItemsWithTransaction = async (
  returnRequestId,
  returnItemsData,
  options = {}
) => {
  if (!Array.isArray(returnItemsData) || returnItemsData.length === 0) {
    throw new Error("At least one return item is required.");
  }

  const executeCreation = async (transaction) => {
    return ReturnItem.bulkCreate(
      returnItemsData.map((item) => ({
        ...item,
        returnRequestId,
      })),
      {
        validate: true,
        transaction,
      }
    );
  };

  if (options.transaction) {
    return executeCreation(options.transaction);
  }

  return sequelize.transaction(async (transaction) => {
    return executeCreation(transaction);
  });
};
// =====================================================
// UPDATE RETURN ITEM
// =====================================================

const updateReturnItem = async (
  returnItem,
  returnItemData,
  options = {}
) => {
  return returnItem.update(returnItemData, options);
};

// =====================================================
// UPDATE RETURN ITEM CONDITION
// =====================================================

const updateReturnItemCondition = async (
  returnItem,
  itemCondition,
  inspectionNote = null,
  options = {}
) => {
  return returnItem.update(
    {
      itemCondition,
      inspectionNote,
    },
    options
  );
};

// =====================================================
// UPDATE RETURN ITEM REFUND AMOUNT
// =====================================================

const updateReturnItemRefundAmount = async (
  returnItem,
  refundAmount,
  options = {}
) => {
  return returnItem.update(
    { refundAmount },
    options
  );
};

// =====================================================
// UPDATE MULTIPLE RETURN ITEMS
// =====================================================

const updateReturnItems = async (
  returnRequestId,
  updateData,
  options = {}
) => {
  return ReturnItem.update(updateData, {
    where: { returnRequestId },
    ...options,
  });
};

// =====================================================
// DELETE RETURN ITEM
// =====================================================

const deleteReturnItem = async (
  returnItem,
  options = {}
) => {
  return returnItem.destroy(options);
};

// =====================================================
// DELETE RETURN ITEMS BY REQUEST ID
// =====================================================

const deleteReturnItemsByRequestId = async (
  returnRequestId,
  options = {}
) => {
  return ReturnItem.destroy({
    where: { returnRequestId },
    ...options,
  });
};

// =====================================================
// GET TOTAL RETURNED QUANTITY BY ORDER ITEM ID
// =====================================================

const getTotalReturnedQuantityByOrderItemId = async (
  orderItemId,
  options = {}
) => {
return (
  (await ReturnItem.sum("quantity", {
    where: { orderItemId },
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        attributes: [],
        where: {
          status: {
            [Op.in]: ACTIVE_RETURN_STATUSES,
          },
        },
        required: true,
      },
    ],
    ...options,
  })) || 0
);
};

// =====================================================
// GET RETURN ITEMS COUNT BY REQUEST ID
// =====================================================

const getReturnItemsCountByRequestId = async (
  returnRequestId,
  options = {}
) => {
  return ReturnItem.count({
    where: { returnRequestId },
    ...options,
  });
};

// =====================================================
// EXPORT REPOSITORY METHODS
// =====================================================

module.exports = {
  // Return Items
  getAllReturnItems,
  getReturnItemById,
  getReturnItemByUuid,
  getReturnItemsByRequestId,
  getReturnItemsByOrderItemId,
  getReturnItemByRequestAndOrderItem,
  getReturnItemDetails,
  getUserReturnItemDetails,
  getReturnItemsWithOrderDetails,
  getReturnItemsByCondition,
  createReturnItem,
  createReturnItems,
  createReturnItemsWithTransaction,
  updateReturnItem,
  updateReturnItemCondition,
  updateReturnItemRefundAmount,
  updateReturnItems,
  deleteReturnItem,
  deleteReturnItemsByRequestId,
  getTotalReturnedQuantityByOrderItemId,
  getReturnItemsCountByRequestId,
};
