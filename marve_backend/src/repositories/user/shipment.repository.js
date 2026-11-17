
"use strict";

const {
  Shipment,
  ShipmentTrackingEvent,
  Order,
  sequelize,
} = require("../../database/models");

// =====================================================
// GET ALL SHIPMENTS
// =====================================================

const getAllShipments = async (options = {}) => {
  return Shipment.findAll({
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
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET SHIPMENT BY ID
// =====================================================

const getShipmentById = async (shipmentId, options = {}) => {
  return Shipment.findByPk(shipmentId, {
    ...options,
  });
};

// =====================================================
// GET SHIPMENT BY UUID
// =====================================================

const getShipmentByUuid = async (uuid, options = {}) => {
  return Shipment.findOne({
    where: { uuid },
    ...options,
  });
};

// =====================================================
// GET SHIPMENTS BY ORDER ID
// =====================================================

const getShipmentsByOrderId = async (
  orderId,
  options = {}
) => {
  return Shipment.findAll({
    where: { orderId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET SHIPMENT BY TRACKING NUMBER
// =====================================================

const getShipmentByTrackingNumber = async (
  trackingNumber,
  options = {}
) => {
  return Shipment.findOne({
    where: { trackingNumber },
    ...options,
  });
};

// =====================================================
// GET SHIPMENT BY AWB NUMBER
// =====================================================

const getShipmentByAwbNumber = async (
  awbNumber,
  options = {}
) => {
  return Shipment.findOne({
    where: { awbNumber },
    ...options,
  });
};

// =====================================================
// GET SHIPMENT WITH ORDER AND TRACKING HISTORY
// =====================================================

const getShipmentDetails = async (
  shipmentId,
  options = {}
) => {
  return Shipment.findByPk(shipmentId, {
    include: [
      {
        model: Order,
        as: "order",
        required: false,
      },
      {
        model: ShipmentTrackingEvent,
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
// GET USER SHIPMENT DETAILS
// =====================================================

const getUserShipmentDetails = async (
  shipmentId,
  userId,
  options = {}
) => {
  return Shipment.findOne({
    where: {
      id: shipmentId,
    },
    include: [
      {
        model: Order,
        as: "order",
        where: {
          userId,
        },
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
        required: true,
      },
      {
        model: ShipmentTrackingEvent,
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
// GET ALL SHIPMENTS BY USER ID
// =====================================================

const getShipmentsByUserId = async (
  userId,
  options = {}
) => {
  return Shipment.findAll({
    include: [
      {
        model: Order,
        as: "order",
        where: {
          userId,
        },
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
        required: true,
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
// CREATE SHIPMENT
// =====================================================

const createShipment = async (
  shipmentData,
  options = {}
) => {
  return Shipment.create(shipmentData, options);
};

// =====================================================
// CREATE MULTIPLE SHIPMENTS
// =====================================================

const createShipments = async (
  shipmentsData,
  options = {}
) => {
  if (!Array.isArray(shipmentsData) || shipmentsData.length === 0) {
    throw new Error("At least one shipment is required.");
  }

  return Shipment.bulkCreate(shipmentsData, {
    validate: true,
    ...options,
  });
};

// =====================================================
// CREATE SHIPMENT WITH TRACKING EVENT
// =====================================================

const createShipmentWithTrackingEvent = async (
  shipmentData,
  trackingEventData,
  options = {}
) => {
  const executeCreation = async (transaction) => {
    const shipment = await Shipment.create(shipmentData, {
      transaction,
    });

    let trackingEvent = null;

    if (trackingEventData) {
      trackingEvent = await ShipmentTrackingEvent.create(
        {
          ...trackingEventData,
          shipmentId: shipment.id,
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
// UPDATE SHIPMENT
// =====================================================

const updateShipment = async (
  shipment,
  shipmentData,
  options = {}
) => {
  return shipment.update(shipmentData, options);
};

// =====================================================
// UPDATE SHIPMENT STATUS
// =====================================================

const updateShipmentStatus = async (
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
// DELETE SHIPMENT
// =====================================================

const deleteShipment = async (
  shipment,
  options = {}
) => {
  return shipment.destroy(options);
};

// =====================================================
// GET ALL TRACKING EVENTS
// =====================================================

const getAllTrackingEvents = async (options = {}) => {
  return ShipmentTrackingEvent.findAll({
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
  return ShipmentTrackingEvent.findByPk(eventId, options);
};

// =====================================================
// GET TRACKING EVENTS BY SHIPMENT ID
// =====================================================

const getTrackingEventsByShipmentId = async (
  shipmentId,
  options = {}
) => {
  return ShipmentTrackingEvent.findAll({
    where: { shipmentId },
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
  shipmentId,
  options = {}
) => {
  return ShipmentTrackingEvent.findOne({
    where: { shipmentId },
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
  return ShipmentTrackingEvent.create(eventData, options);
};

// =====================================================
// CREATE MULTIPLE TRACKING EVENTS
// =====================================================

const createTrackingEvents = async (
  eventsData,
  options = {}
) => {
  if (!Array.isArray(eventsData) || eventsData.length === 0) {
    throw new Error("At least one tracking event is required.");
  }

  return ShipmentTrackingEvent.bulkCreate(eventsData, {
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
// CREATE TRACKING EVENT AND UPDATE SHIPMENT STATUS
// =====================================================

const createTrackingEventAndUpdateShipment = async (
  shipment,
  eventData,
  options = {}
) => {
  const executeUpdate = async (transaction) => {
    const trackingEvent = await ShipmentTrackingEvent.create(
      {
        ...eventData,
        shipmentId: shipment.id,
      },
      { transaction }
    );

    const shipmentData = {
      status: eventData.status,
    };

    if (eventData.status === "PICKED_UP" && !shipment.shippedAt) {
      shipmentData.shippedAt = eventData.eventAt || new Date();
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
// DELETE ALL TRACKING EVENTS BY SHIPMENT ID
// =====================================================

const deleteTrackingEventsByShipmentId = async (
  shipmentId,
  options = {}
) => {
  return ShipmentTrackingEvent.destroy({
    where: { shipmentId },
    ...options,
  });
};

// =====================================================
// EXPORT REPOSITORY METHODS
// =====================================================

module.exports = {
  // Shipment
  getAllShipments,
  getShipmentById,
  getShipmentByUuid,
  getShipmentsByOrderId,
  getShipmentByTrackingNumber,
  getShipmentByAwbNumber,
  getShipmentDetails,
  createShipment,
  createShipments,
  createShipmentWithTrackingEvent,
  updateShipment,
  updateShipmentStatus,
  deleteShipment,
  getUserShipmentDetails,
getShipmentsByUserId,

  // Tracking Events
  getAllTrackingEvents,
  getTrackingEventById,
  getTrackingEventsByShipmentId,
  getLatestTrackingEvent,
  createTrackingEvent,
  createTrackingEvents,
  updateTrackingEvent,
  deleteTrackingEvent,
  createTrackingEventAndUpdateShipment,
  deleteTrackingEventsByShipmentId,
};
