
"use strict";

const {
  ReturnRequest,
  ReturnItem,
  ReturnShipment,
  ReturnTrackingEvent,
  ReturnRefund,
  Order,
  OrderItem,
  sequelize,
} = require("../../database/models");

// =====================================================
// GET ALL RETURN REQUESTS
// =====================================================

const getAllReturnRequests = async (options = {}) => {
  return ReturnRequest.findAll({
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN REQUEST BY ID
// =====================================================

const getReturnRequestById = async (
  returnRequestId,
  options = {}
) => {
  return ReturnRequest.findByPk(returnRequestId, options);
};

// =====================================================
// GET RETURN REQUEST BY UUID
// =====================================================

const getReturnRequestByUuid = async (
  uuid,
  options = {}
) => {
  return ReturnRequest.findOne({
    where: { uuid },
    ...options,
  });
};

// =====================================================
// GET RETURN REQUEST BY RETURN NUMBER
// =====================================================

const getReturnRequestByNumber = async (
  returnNumber,
  options = {}
) => {
  return ReturnRequest.findOne({
    where: { returnNumber },
    ...options,
  });
};

// =====================================================
// GET RETURN REQUEST BY ID AND USER ID
// =====================================================

const getUserReturnRequestById = async (
  returnRequestId,
  userId,
  options = {}
) => {
  return ReturnRequest.findOne({
    where: {
      id: returnRequestId,
      userId,
    },
    ...options,
  });
};

// =====================================================
// GET RETURN REQUEST BY UUID AND USER ID
// =====================================================

const getUserReturnRequestByUuid = async (
  uuid,
  userId,
  options = {}
) => {
  return ReturnRequest.findOne({
    where: {
      uuid,
      userId,
    },
    ...options,
  });
};

// =====================================================
// GET ALL RETURN REQUESTS BY USER ID
// =====================================================

const getReturnRequestsByUserId = async (
  userId,
  options = {}
) => {
  return ReturnRequest.findAll({
    where: { userId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN REQUESTS BY ORDER ID
// =====================================================

const getReturnRequestsByOrderId = async (
  orderId,
  options = {}
) => {
  return ReturnRequest.findAll({
    where: { orderId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET USER RETURN REQUESTS BY ORDER ID
// =====================================================

const getUserReturnRequestsByOrderId = async (
  orderId,
  userId,
  options = {}
) => {
  return ReturnRequest.findAll({
    where: {
      orderId,
      userId,
    },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN REQUEST WITH ITEMS
// =====================================================

const getReturnRequestWithItems = async (
  returnRequestId,
  options = {}
) => {
  return ReturnRequest.findByPk(returnRequestId, {
    include: [
      {
        model: ReturnItem,
        as: "items",
        required: false,
        include: [
          {
            model: OrderItem,
            as: "orderItem",
            required: false,
          },
        ],
      },
    ],
    ...options,
  });
};

// =====================================================
// GET USER RETURN REQUEST DETAILS
// =====================================================

const getUserReturnRequestDetails = async (
  returnRequestId,
  userId,
  options = {}
) => {
  return ReturnRequest.findOne({
    where: {
      id: returnRequestId,
      userId,
    },
    include: [
      {
        model: Order,
        as: "order",
        attributes: [
          "id",
          "uuid",
          "orderNumber",
          "paymentMethod",
          "paymentStatus",
          "orderStatus",
          "deliveryFullName",
          "deliveryPhone",
          "deliveryPincode",
          "deliveryCity",
          "deliveryState",
        ],
        required: true,
      },
      {
        model: ReturnItem,
        as: "items",
        required: false,
        include: [
          {
            model: OrderItem,
            as: "orderItem",
            required: false,
          },
        ],
      },
      {
        model: ReturnShipment,
        as: "shipments",
        required: false,
        separate: true,
        order: [
          ["createdAt", "DESC"],
          ["id", "DESC"],
        ],
        include: [
          {
            model: ReturnTrackingEvent,
            as: "trackingEvents",
            required: false,
            separate: true,
            order: [
              ["eventAt", "DESC"],
              ["id", "DESC"],
            ],
          },
        ],
      },
      {
        model: ReturnRefund,
        as: "refunds",
        required: false,
        separate: true,
        order: [
          ["createdAt", "DESC"],
          ["id", "DESC"],
        ],
      },
    ],
    ...options,
  });
};

// =====================================================
// GET USER RETURN REQUEST DETAILS BY UUID
// =====================================================

const getUserReturnRequestDetailsByUuid = async (
  uuid,
  userId,
  options = {}
) => {
  return ReturnRequest.findOne({
    where: {
      uuid,
      userId,
    },
    include: [
      {
        model: Order,
        as: "order",
        attributes: [
          "id",
          "uuid",
          "orderNumber",
          "paymentMethod",
          "paymentStatus",
          "orderStatus",
          "deliveryFullName",
          "deliveryPhone",
          "deliveryPincode",
          "deliveryCity",
          "deliveryState",
        ],
        required: true,
      },
      {
        model: ReturnItem,
        as: "items",
        required: false,
        include: [
          {
            model: OrderItem,
            as: "orderItem",
            required: false,
          },
        ],
      },
      {
        model: ReturnShipment,
        as: "shipments",
        required: false,
        separate: true,
        order: [
          ["createdAt", "DESC"],
          ["id", "DESC"],
        ],
        include: [
          {
            model: ReturnTrackingEvent,
            as: "trackingEvents",
            required: false,
            separate: true,
            order: [
              ["eventAt", "DESC"],
              ["id", "DESC"],
            ],
          },
        ],
      },
      {
        model: ReturnRefund,
        as: "refunds",
        required: false,
        separate: true,
        order: [
          ["createdAt", "DESC"],
          ["id", "DESC"],
        ],
      },
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN REQUESTS BY STATUS
// =====================================================

const getReturnRequestsByStatus = async (
  status,
  options = {}
) => {
  return ReturnRequest.findAll({
    where: { status },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// CREATE RETURN REQUEST
// =====================================================

const createReturnRequest = async (
  returnRequestData,
  options = {}
) => {
  return ReturnRequest.create(returnRequestData, options);
};

// =====================================================
// CREATE RETURN REQUEST WITH ITEMS
// =====================================================

const createReturnRequestWithItems = async (
  returnRequestData,
  returnItemsData,
  options = {}
) => {
  if (!Array.isArray(returnItemsData) || returnItemsData.length === 0) {
    throw new Error("At least one return item is required.");
  }

  const executeCreation = async (transaction) => {
    const returnRequest = await ReturnRequest.create(
      returnRequestData,
      { transaction }
    );

    const returnItems = await ReturnItem.bulkCreate(
      returnItemsData.map((item) => ({
        ...item,
        returnRequestId: returnRequest.id,
      })),
      {
        validate: true,
        transaction,
      }
    );

    return {
      returnRequest,
      returnItems,
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
// UPDATE RETURN REQUEST
// =====================================================

const updateReturnRequest = async (
  returnRequest,
  returnRequestData,
  options = {}
) => {
  return returnRequest.update(returnRequestData, options);
};

// =====================================================
// UPDATE RETURN REQUEST STATUS
// =====================================================

const updateReturnRequestStatus = async (
  returnRequest,
  status,
  options = {}
) => {
  return returnRequest.update(
    { status },
    options
  );
};

// =====================================================
// UPDATE RETURN REQUEST STATUS WITH DATA
// =====================================================

const updateReturnRequestStatusWithData = async (
  returnRequest,
  returnRequestData,
  options = {}
) => {
  return returnRequest.update(returnRequestData, options);
};

// =====================================================
// DELETE RETURN REQUEST
// =====================================================

const deleteReturnRequest = async (
  returnRequest,
  options = {}
) => {
  return returnRequest.destroy(options);
};

// =====================================================
// EXPORT REPOSITORY METHODS
// =====================================================

module.exports = {
  // Return Requests
  getAllReturnRequests,
  getReturnRequestById,
  getReturnRequestByUuid,
  getReturnRequestByNumber,
  getUserReturnRequestById,
  getUserReturnRequestByUuid,
  getReturnRequestsByUserId,
  getReturnRequestsByOrderId,
  getUserReturnRequestsByOrderId,
  getReturnRequestWithItems,
  getUserReturnRequestDetails,
  getUserReturnRequestDetailsByUuid,
  getReturnRequestsByStatus,
  createReturnRequest,
  createReturnRequestWithItems,
  updateReturnRequest,
  updateReturnRequestStatus,
  updateReturnRequestStatusWithData,
  deleteReturnRequest,
};
