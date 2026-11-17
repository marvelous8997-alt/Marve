
"use strict";

const {
  ReturnShipment,
  ReturnTrackingEvent,
  ReturnRequest,
  ReturnItem,
  Order,
  sequelize,
} = require("../../database/models");

// =====================================================
// GET ALL RETURN SHIPMENTS
// =====================================================

const getAllReturnShipments = async (options = {}) => {
  return ReturnShipment.findAll({
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        required: false,
        include: [
          {
            model: Order,
            as: "order",
            attributes: [
              "id",
              "uuid",
              "orderNumber",
              "userId",
              "paymentMethod",
              "paymentStatus",
              "orderStatus",
              "deliveryFullName",
              "deliveryPhone",
              "deliveryPincode",
              "deliveryCity",
              "deliveryState",
            ],
            required: false,
          },
        ],
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
// GET RETURN SHIPMENT BY ID
// =====================================================

const getReturnShipmentById = async (
  shipmentId,
  options = {}
) => {
  return ReturnShipment.findByPk(shipmentId, {
    ...options,
  });
};

// =====================================================
// GET RETURN SHIPMENT BY UUID
// =====================================================

const getReturnShipmentByUuid = async (
  uuid,
  options = {}
) => {
  return ReturnShipment.findOne({
    where: { uuid },
    ...options,
  });
};

// =====================================================
// GET RETURN SHIPMENTS BY RETURN REQUEST ID
// =====================================================

const getReturnShipmentsByReturnRequestId = async (
  returnRequestId,
  options = {}
) => {
  return ReturnShipment.findAll({
    where: { returnRequestId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET RETURN SHIPMENT BY TRACKING NUMBER
// =====================================================

const getReturnShipmentByTrackingNumber = async (
  trackingNumber,
  options = {}
) => {
  return ReturnShipment.findOne({
    where: { trackingNumber },
    ...options,
  });
};

// =====================================================
// GET RETURN SHIPMENT BY AWB NUMBER
// =====================================================

const getReturnShipmentByAwbNumber = async (
  awbNumber,
  options = {}
) => {
  return ReturnShipment.findOne({
    where: { awbNumber },
    ...options,
  });
};

// =====================================================
// GET RETURN SHIPMENT BY SHIPROCKET SHIPMENT ID
// =====================================================

const getReturnShipmentByShiprocketShipmentId = async (
  shiprocketShipmentId,
  options = {}
) => {
  return ReturnShipment.findOne({
    where: { shiprocketShipmentId },
    ...options,
  });
};

// =====================================================
// GET RETURN SHIPMENT WITH REQUEST AND TRACKING HISTORY
// =====================================================

const getReturnShipmentDetails = async (
  shipmentId,
  options = {}
) => {
  return ReturnShipment.findByPk(shipmentId, {
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        required: false,
        include: [
          {
            model: Order,
            as: "order",
            required: false,
          },
          {
            model: ReturnItem,
            as: "items",
            required: false,
          },
        ],
      },
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
    ...options,
  });
};

// =====================================================
// GET USER RETURN SHIPMENT DETAILS
// =====================================================

const getUserReturnShipmentDetails = async (
  shipmentId,
  userId,
  options = {}
) => {
  return ReturnShipment.findOne({
    where: {
      id: shipmentId,
    },
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        where: {
          userId,
        },
        attributes: [
          "id",
          "uuid",
          "returnNumber",
          "orderId",
          "userId",
          "reason",
          "status",
          "requestedAt",
          "approvedAt",
          "receivedAt",
          "refundAmount",
          "currency",
        ],
        required: true,
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
            required: false,
          },
        ],
      },
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
    ...options,
  });
};

// =====================================================
// GET ALL RETURN SHIPMENTS BY USER ID
// =====================================================

const getReturnShipmentsByUserId = async (
  userId,
  options = {}
) => {
  return ReturnShipment.findAll({
    include: [
      {
        model: ReturnRequest,
        as: "returnRequest",
        where: {
          userId,
        },
        attributes: [
          "id",
          "uuid",
          "returnNumber",
          "orderId",
          "userId",
          "reason",
          "status",
          "requestedAt",
          "approvedAt",
          "receivedAt",
          "refundAmount",
          "currency",
        ],
        required: true,
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
              "deliveryPincode",
              "deliveryCity",
              "deliveryState",
            ],
            required: false,
          },
        ],
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
// CREATE RETURN SHIPMENT
// =====================================================

const createReturnShipment = async (
  shipmentData,
  options = {}
) => {
  return ReturnShipment.create(shipmentData, options);
};

// =====================================================
// CREATE MULTIPLE RETURN SHIPMENTS
// =====================================================

const createReturnShipments = async (
  shipmentsData,
  options = {}
) => {
  if (!Array.isArray(shipmentsData) || shipmentsData.length === 0) {
    throw new Error("At least one return shipment is required.");
  }

  return ReturnShipment.bulkCreate(shipmentsData, {
    validate: true,
    ...options,
  });
};

// =====================================================
// CREATE RETURN SHIPMENT WITH TRACKING EVENT
// =====================================================

const createReturnShipmentWithTrackingEvent = async (
  shipmentData,
  trackingEventData,
  options = {}
) => {
  const executeCreation = async (transaction) => {
    const shipment = await ReturnShipment.create(shipmentData, {
      transaction,
    });

    let trackingEvent = null;

    if (trackingEventData) {
      trackingEvent = await ReturnTrackingEvent.create(
        {
          ...trackingEventData,
          returnShipmentId: shipment.id,
        },
        { transaction }
      );
    }

    return {
      shipment,
      trackingEvent,
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
// UPDATE RETURN SHIPMENT
// =====================================================

const updateReturnShipment = async (
  shipment,
  shipmentData,
  options = {}
) => {
  return shipment.update(shipmentData, options);
};

// =====================================================
// UPDATE RETURN SHIPMENT STATUS
// =====================================================

const updateReturnShipmentStatus = async (
  shipment,
  status,
  options = {}
) => {
  return shipment.update(
    { status },
    options
  );
};

// =====================================================
// UPDATE LAST TRACKED AT
// =====================================================

const updateLastTrackedAt = async (
  shipment,
  lastTrackedAt = new Date(),
  options = {}
) => {
  return shipment.update(
    { lastTrackedAt },
    options
  );
};

// =====================================================
// DELETE RETURN SHIPMENT
// =====================================================

const deleteReturnShipment = async (
  shipment,
  options = {}
) => {
  return shipment.destroy(options);
};

// =====================================================
// GET ALL RETURN TRACKING EVENTS
// =====================================================

const getAllTrackingEvents = async (options = {}) => {
  return ReturnTrackingEvent.findAll({
    order: [
      ["eventAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET TRACKING EVENT BY ID
// =====================================================

const getTrackingEventById = async (
  eventId,
  options = {}
) => {
  return ReturnTrackingEvent.findByPk(eventId, options);
};

// =====================================================
// GET TRACKING EVENT BY PROVIDER EVENT ID
// =====================================================

const getTrackingEventByProviderEventId = async (
  returnShipmentId,
  providerEventId,
  options = {}
) => {
  if (!providerEventId) {
    return null;
  }

  return ReturnTrackingEvent.findOne({
    where: {
      returnShipmentId,
      providerEventId,
    },
    ...options,
  });
};

// =====================================================
// CHECK DUPLICATE TRACKING EVENT
// =====================================================

const getDuplicateTrackingEvent = async (
  {
    returnShipmentId,
    status,
    eventAt,
    location,
    description,
  },
  options = {}
) => {
  return ReturnTrackingEvent.findOne({
    where: {
      returnShipmentId,
      status,
      eventAt,
      location: location || null,
      description: description || null,
    },
    ...options,
  });
};

// =====================================================
// GET TRACKING EVENTS BY RETURN SHIPMENT ID
// =====================================================

const getTrackingEventsByShipmentId = async (
  returnShipmentId,
  options = {}
) => {
  return ReturnTrackingEvent.findAll({
    where: { returnShipmentId },
    order: [
      ["eventAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET LATEST TRACKING EVENT
// =====================================================

const getLatestTrackingEvent = async (
  returnShipmentId,
  options = {}
) => {
  return ReturnTrackingEvent.findOne({
    where: { returnShipmentId },
    order: [
      ["eventAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// CREATE TRACKING EVENT
// =====================================================

const createTrackingEvent = async (
  eventData,
  options = {}
) => {
  return ReturnTrackingEvent.create(eventData, options);
};

// =====================================================
// CREATE MULTIPLE TRACKING EVENTS
// =====================================================

const createTrackingEvents = async (
  eventsData,
  options = {}
) => {
  if (!Array.isArray(eventsData) || eventsData.length === 0) {
    throw new Error("At least one return tracking event is required.");
  }

  return ReturnTrackingEvent.bulkCreate(eventsData, {
    validate: true,
    ...options,
  });
};

// =====================================================
// UPDATE TRACKING EVENT
// =====================================================

const updateTrackingEvent = async (
  trackingEvent,
  eventData,
  options = {}
) => {
  return trackingEvent.update(eventData, options);
};

// =====================================================
// DELETE TRACKING EVENT
// =====================================================

const deleteTrackingEvent = async (
  trackingEvent,
  options = {}
) => {
  return trackingEvent.destroy(options);
};

// =====================================================
// CREATE TRACKING EVENT AND UPDATE RETURN SHIPMENT STATUS
// =====================================================

const createTrackingEventAndUpdateShipment = async (
  shipment,
  eventData,
  options = {}
) => {
  const executeUpdate = async (transaction) => {
    const trackingEvent = await ReturnTrackingEvent.create(
      {
        ...eventData,
        returnShipmentId: shipment.id,
      },
      { transaction }
    );

    const shipmentData = {
      status: eventData.status,
    };

    if (
      eventData.status === "PICKED_UP" &&
      !shipment.pickedUpAt
    ) {
      shipmentData.pickedUpAt = eventData.eventAt || new Date();
    }

    if (eventData.status === "DELIVERED") {
      shipmentData.deliveredAt = eventData.eventAt || new Date();
    }

    await shipment.update(shipmentData, {
      transaction,
    });

    return {
      shipment,
      trackingEvent,
    };
  };

  if (options.transaction) {
    return executeUpdate(options.transaction);
  }

  return sequelize.transaction(async (transaction) => {
    return executeUpdate(transaction);
  });
};

// =====================================================
// DELETE ALL TRACKING EVENTS BY RETURN SHIPMENT ID
// =====================================================

const deleteTrackingEventsByShipmentId = async (
  returnShipmentId,
  options = {}
) => {
  return ReturnTrackingEvent.destroy({
    where: { returnShipmentId },
    ...options,
  });
};

// =====================================================
// GET RETURN SHIPMENTS FOR AUTOMATIC TRACKING SYNC
// =====================================================

const getReturnShipmentsForTrackingSync = async ({
  limit = 50,
  transaction,
} = {}) => {
  return ReturnShipment.findAll({
    where: {
      awbNumber: {
        [require("sequelize").Op.ne]: null,
      },
      status: {
        [require("sequelize").Op.notIn]: [
          "DELIVERED",
          "CANCELLED",
          "PICKUP_FAILED",
          "RTO",
        ],
      },
    },
    order: [
      ["lastTrackedAt", "ASC"],
      ["id", "ASC"],
    ],
    limit: Number(limit),
    transaction,
  });
};

// =====================================================
// GET RETURN SHIPMENT BY ID WITH LOCK
// =====================================================

const getReturnShipmentByIdForUpdate = async (
  shipmentId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "A transaction is required to lock return shipment records."
    );
  }

  return ReturnShipment.findByPk(shipmentId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};

// =====================================================
// EXPORT REPOSITORY METHODS
// =====================================================

module.exports = {
  // Return Shipment
  getAllReturnShipments,
  getReturnShipmentById,
  getReturnShipmentByUuid,
  getReturnShipmentsByReturnRequestId,
  getReturnShipmentByTrackingNumber,
  getReturnShipmentByAwbNumber,
  getReturnShipmentByShiprocketShipmentId,
  getReturnShipmentDetails,
  getUserReturnShipmentDetails,
  getReturnShipmentsByUserId,
  getReturnShipmentsForTrackingSync,
  getReturnShipmentByIdForUpdate,
  createReturnShipment,
  createReturnShipments,
  createReturnShipmentWithTrackingEvent,
  updateReturnShipment,
  updateReturnShipmentStatus,
  updateLastTrackedAt,
  deleteReturnShipment,

  // Return Tracking Events
  getAllTrackingEvents,
  getTrackingEventById,
  getTrackingEventByProviderEventId,
  getDuplicateTrackingEvent,
  getTrackingEventsByShipmentId,
  getLatestTrackingEvent,
  createTrackingEvent,
  createTrackingEvents,
  updateTrackingEvent,
  deleteTrackingEvent,
  createTrackingEventAndUpdateShipment,
  deleteTrackingEventsByShipmentId,
};
