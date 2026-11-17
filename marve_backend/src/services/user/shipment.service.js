
"use strict";

const {
  userOrderRepository,
  userShipmentRepository,
} = require("../../repositories");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// =====================================================
// VALIDATE AUTHENTICATED USER ID
// =====================================================

const validateUserId = (userId) => {
  if (
    userId === undefined ||
    userId === null ||
    !/^\d+$/.test(String(userId)) ||
    !Number.isSafeInteger(Number(userId)) ||
    Number(userId) < 1
  ) {
    throw new ApiError(401, "Authenticated user is required.");
  }

  return Number(userId);
};

// =====================================================
// VALIDATE POSITIVE DATABASE ID
// =====================================================

const validateDatabaseId = (id, fieldName = "ID") => {
  if (
    id === undefined ||
    id === null ||
    !/^\d+$/.test(String(id)) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) < 1
  ) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return Number(id);
};

// =====================================================
// GET ALL SHIPMENTS FOR AUTHENTICATED USER
// =====================================================

const getShipmentsByOrderId = async (orderId, userId) => {
  try {
    const authenticatedUserId = validateUserId(userId);
    const validOrderId = validateDatabaseId(orderId, "order ID");

    // Verify that the order belongs to the authenticated user.
    const order = await userOrderRepository.getOrderById(
      validOrderId,
      authenticatedUserId
    );

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    const shipments =
      await userShipmentRepository.getShipmentsByOrderId(
        validOrderId
      );

    return shipments.map((shipment) => shipment.toJSON());
  } catch (error) {
    logger.error("Get user order shipments failed:", error);
    throw error;
  }
};

// =====================================================
// GET SHIPMENT DETAILS FOR AUTHENTICATED USER
// =====================================================

const getShipmentById = async (shipmentId, userId) => {
  try {
    const authenticatedUserId = validateUserId(userId);
    const validShipmentId = validateDatabaseId(
      shipmentId,
      "shipment ID"
    );

const shipment =
  await userShipmentRepository.getUserShipmentDetails(
    validShipmentId,
    authenticatedUserId
  );

if (!shipment) {
  throw new ApiError(404, "Shipment not found.");
}

    return shipment.toJSON();
  } catch (error) {
    logger.error("Get shipment details failed:", error);
    throw error;
  }
};

// =====================================================
// GET SHIPMENT DETAILS BY UUID
// =====================================================

const getShipmentByUuid = async (uuid, userId) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const normalizedUuid = String(uuid || "").trim();

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        normalizedUuid
      )
    ) {
      throw new ApiError(400, "Invalid shipment UUID.");
    }

const shipment = await userShipmentRepository.getShipmentByUuid(
  normalizedUuid,
  {
    include: [
      {
        association: "order",
        where: {
          userId: authenticatedUserId,
        },
        attributes: [
          "id",
          "userId",
          "orderNumber",
          "orderStatus",
        ],
        required: true,
      },
    ],
  }
);

if (!shipment) {
  throw new ApiError(404, "Shipment not found.");
}

    // Fetch complete shipment details and tracking history.
const shipmentDetails =
  await userShipmentRepository.getUserShipmentDetails(
    shipment.id,
    authenticatedUserId
  );

if (!shipmentDetails) {
  throw new ApiError(404, "Shipment not found.");
}

    return shipmentDetails.toJSON();
  } catch (error) {
    logger.error("Get shipment by UUID failed:", error);
    throw error;
  }
};

// =====================================================
// GET TRACKING HISTORY FOR AUTHENTICATED USER
// =====================================================

const getShipmentTrackingHistory = async (
  shipmentId,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);
    const validShipmentId = validateDatabaseId(
      shipmentId,
      "shipment ID"
    );

    // Verify that the shipment belongs to the user's order.
const shipment =
  await userShipmentRepository.getUserShipmentDetails(
    validShipmentId,
    authenticatedUserId
  );

if (!shipment) {
  throw new ApiError(404, "Shipment not found.");
}

    const trackingEvents =
      await userShipmentRepository.getTrackingEventsByShipmentId(
        validShipmentId
      );

    return trackingEvents.map((event) => event.toJSON());
  } catch (error) {
    logger.error("Get shipment tracking history failed:", error);
    throw error;
  }
};

// =====================================================
// GET LATEST TRACKING STATUS
// =====================================================

const getLatestShipmentTracking = async (
  shipmentId,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);
    const validShipmentId = validateDatabaseId(
      shipmentId,
      "shipment ID"
    );

    // Verify shipment ownership.
const shipment =
  await userShipmentRepository.getUserShipmentDetails(
    validShipmentId,
    authenticatedUserId
  );

if (!shipment) {
  throw new ApiError(404, "Shipment not found.");
}

    const latestEvent =
      await userShipmentRepository.getLatestTrackingEvent(
        validShipmentId
      );

    return {
      shipment: {
        id: shipment.id,
        uuid: shipment.uuid,
        orderId: shipment.orderId,
        status: shipment.status,
        courierName: shipment.courierName,
        trackingNumber: shipment.trackingNumber,
        awbNumber: shipment.awbNumber,
        shippedAt: shipment.shippedAt,
        estimatedDeliveryAt: shipment.estimatedDeliveryAt,
        deliveredAt: shipment.deliveredAt,
      },
      latestTrackingEvent: latestEvent
        ? latestEvent.toJSON()
        : null,
    };
  } catch (error) {
    logger.error("Get latest shipment tracking failed:", error);
    throw error;
  }
};

// =====================================================
// GET SHIPMENT BY TRACKING NUMBER
// =====================================================

const getShipmentByTrackingNumber = async (
  trackingNumber,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const normalizedTrackingNumber = String(
      trackingNumber || ""
    ).trim();

    if (
      !normalizedTrackingNumber ||
      normalizedTrackingNumber.length > 150
    ) {
      throw new ApiError(400, "Invalid tracking number.");
    }

const shipment =
  await userShipmentRepository.getShipmentByTrackingNumber(
    normalizedTrackingNumber,
    {
      include: [
        {
          association: "order",
          where: {
            userId: authenticatedUserId,
          },
          attributes: [
            "id",
            "userId",
            "orderNumber",
            "orderStatus",
          ],
          required: true,
        },
      ],
    }
  );

if (!shipment) {
  throw new ApiError(404, "Shipment not found.");
}

const shipmentDetails =
  await userShipmentRepository.getUserShipmentDetails(
    shipment.id,
    authenticatedUserId
  );

if (!shipmentDetails) {
  throw new ApiError(404, "Shipment not found.");
}

    return shipmentDetails.toJSON();
  } catch (error) {
    logger.error("Get shipment by tracking number failed:", error);
    throw error;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getShipmentsByOrderId,
  getShipmentById,
  getShipmentByUuid,
  getShipmentTrackingHistory,
  getLatestShipmentTracking,
  getShipmentByTrackingNumber,
};
