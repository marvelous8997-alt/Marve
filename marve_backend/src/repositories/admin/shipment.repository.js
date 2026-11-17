"use strict";

const {
  Shipment,
  ShipmentTrackingEvent,
  Order,
  sequelize,
} = require("../../database/models");
const { Op } = require("sequelize");
const ApiError = require("../../utils/ApiError");

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};
// =====================================================
// GET ALL SHIPMENTS
// =====================================================

const getAllShipments = async (options = {}) => {
  return Shipment.findAll({
    include: [
      {
        model: Order,
        as: "order",
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
// GET SHIPMENTS WITH FILTERS AND PAGINATION
// =====================================================

const getShipments = async ({
  page = 1,
  limit = 10,
  search,
  status,
  courierName,
  orderNumber,
  trackingNumber,
  dateFrom,
  dateTo,
  sortBy = "createdAt",
  sortOrder = "DESC",
} = {}) => {
  const where = {};
  const orderWhere = {};

  // Status filter
  if (status) {
    where.status = status;
  }

  // Courier filter
  if (courierName) {
    where.courierName = {
      [Op.like]: `%${courierName}%`,
    };
  }

  // Tracking number filter
  if (trackingNumber) {
    where.trackingNumber = {
      [Op.like]: `%${trackingNumber}%`,
    };
  }

  // Order number filter
  if (orderNumber) {
    orderWhere.orderNumber = {
      [Op.like]: `%${orderNumber}%`,
    };
  }

  // Date filters
  if (dateFrom || dateTo) {
    where.createdAt = {};

    if (dateFrom) {
      where.createdAt[Op.gte] = new Date(dateFrom);
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);

      where.createdAt[Op.lte] = endDate;
    }
  }

  // General search
  if (search) {
    where[Op.or] = [
      { trackingNumber: { [Op.like]: `%${search}%` } },
      { awbNumber: { [Op.like]: `%${search}%` } },
      { courierName: { [Op.like]: `%${search}%` } },
      { shiprocketOrderId: { [Op.like]: `%${search}%` } },
      { shiprocketShipmentId: { [Op.like]: `%${search}%` } },
      { "$order.orderNumber$": { [Op.like]: `%${search}%` } },
    ];
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "shippedAt",
    "estimatedDeliveryAt",
    "deliveredAt",
    "status",
    "courierName",
    "trackingNumber",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (Number(page) - 1) * Number(limit);

  return Shipment.findAndCountAll({
    where,

    include: [
      {
        model: Order,
        as: "order",
        required: Boolean(orderWhere.orderNumber) || Boolean(search),
        where: {
          ...orderWhere,
        },
      },
    ],

    distinct: true,
    subQuery: false,

    order: [
      [safeSortBy, safeSortOrder],
      ["id", "DESC"],
    ],

    limit: Number(limit),
    offset,
  });
};

// =====================================================
// GET SHIPMENT BY ID
// =====================================================

const getShipmentById = async (shipmentId, options = {}) => {
  return Shipment.findByPk(shipmentId, options);
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
// GET SHIPMENT BY ORDER ID
// =====================================================

const getShipmentByOrderId = async (orderId, options = {}) => {
  return Shipment.findOne({
    where: { orderId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// =====================================================
// GET ALL SHIPMENTS BY ORDER ID
// =====================================================

const getShipmentsByOrderId = async (orderId, options = {}) => {
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

const getShipmentByAwbNumber = async (awbNumber, options = {}) => {
  return Shipment.findOne({
    where: { awbNumber },
    ...options,
  });
};

// =====================================================
// GET SHIPMENTS FOR AUTOMATIC TRACKING SYNC
// =====================================================

const getShipmentsForTrackingSync = async ({
  limit = 50,
  transaction,
} = {}) => {
  return Shipment.findAll({
    where: {
      awbNumber: {
        [Op.ne]: null,
      },
      status: {
        [Op.notIn]: [
          "DELIVERED",
          "CANCELLED",
          "RETURN_TO_ORIGIN",
          "FAILED",
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
// GET SHIPMENT WITH ORDER AND TRACKING HISTORY
// =====================================================

const getShipmentDetails = async (shipmentId, options = {}) => {
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
// GET SHIPMENT BY ORDER ID WITH LOCK
// =====================================================

const getShipmentByOrderIdForUpdate = async (
  orderId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "A transaction is required to lock shipment records."
    );
  }

  return Shipment.findOne({
    where: { orderId },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};

// =====================================================
// CREATE SHIPMENT
// =====================================================

const createShipment = async (shipmentData, options = {}) => {
  return Shipment.create(shipmentData, options);
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

const deleteShipment = async (shipment, options = {}) => {
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

const getTrackingEventById = async (eventId, options = {}) => {
  return ShipmentTrackingEvent.findByPk(eventId, options);
};

// =====================================================
// GET TRACKING EVENT BY PROVIDER EVENT ID
// =====================================================

const getTrackingEventByProviderEventId = async (
  shipmentId,
  providerEventId,
  options = {}
) => {
  if (!providerEventId) {
    return null;
  }

  return ShipmentTrackingEvent.findOne({
    where: {
      shipmentId,
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
    shipmentId,
    status,
    eventAt,
    location,
    description,
  },
  options = {}
) => {
  return ShipmentTrackingEvent.findOne({
    where: {
      shipmentId,
      status,
      eventAt,
      location: location || null,
      description: description || null,
    },
    ...options,
  });
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

const getLatestTrackingEvent = async (shipmentId, options = {}) => {
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

const createTrackingEvent = async (eventData, options = {}) => {
  return ShipmentTrackingEvent.create(eventData, options);
};

// =====================================================
// CREATE MULTIPLE TRACKING EVENTS
// =====================================================

const createTrackingEvents = async (eventsData, options = {}) => {
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

    if (
      eventData.status === "PICKED_UP" &&
      !shipment.shippedAt
    ) {
      shipmentData.shippedAt = eventData.eventAt || new Date();
    }

    if (eventData.status === "DELIVERED") {
      shipmentData.deliveredAt = eventData.eventAt || new Date();
    }

    await shipment.update(shipmentData, { transaction });

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
// DELETE TRACKING EVENTS BY SHIPMENT ID
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

const calculateOrderWeight = (items = []) => {
  if (!items.length) {
    throw new ApiError(400, "Order does not contain any items.");
  }

  const totalWeight = items.reduce((total, item) => {
    const quantity = toNumber(item.quantity);
    const productWeight = toNumber(item.product?.weight);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      productWeight <= 0
    ) {
      throw new ApiError(
        400,
        "Valid product weight and quantity are required for shipment."
      );
    }

    return total + productWeight * quantity;
  }, 0);

  if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
    throw new ApiError(400, "Invalid order shipment weight.");
  }

  return Number(totalWeight.toFixed(3));
};
// =====================================================
// EXPORT REPOSITORY METHODS
// =====================================================

module.exports = {
  // Shipment
  getShipments,
  getAllShipments,
  getShipmentById,
  getShipmentByUuid,
  getShipmentByOrderId,
  getShipmentsByOrderId,
  getShipmentByTrackingNumber,
  getShipmentByAwbNumber,
  getShipmentDetails,
  getShipmentByOrderIdForUpdate,
  createShipment,
  createShipmentWithTrackingEvent,
  updateShipment,
  updateShipmentStatus,
  deleteShipment,
  getShipmentsForTrackingSync,
updateLastTrackedAt,

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
  calculateOrderWeight,
  getTrackingEventByProviderEventId,
getDuplicateTrackingEvent,
};