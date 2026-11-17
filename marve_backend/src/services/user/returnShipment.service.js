
"use strict";

const {
  userOrderRepository,
  userReturnRequestRepository,
  userReturnShipmentRepository,
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
// VALIDATE UUID
// =====================================================

const validateUuid = (uuid, fieldName = "UUID") => {
  const normalizedUuid = String(uuid || "").trim();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalizedUuid
    )
  ) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return normalizedUuid;
};

// =====================================================
// CUSTOMER-SAFE TRACKING EVENT SERIALIZER
// =====================================================

const serializeCustomerTrackingEvent = (event) => {
  if (!event) return null;

  const data =
    typeof event.toJSON === "function"
      ? event.toJSON()
      : event;

  return {
    id: data.id,
    uuid: data.uuid,
    status: data.status,
    location: data.location ?? null,
    description: data.description ?? null,
    eventAt: data.eventAt,
    createdAt: data.createdAt,
  };
};

// =====================================================
// CUSTOMER-SAFE RETURN SHIPMENT SERIALIZER
// =====================================================

const serializeCustomerReturnShipment = (shipment) => {
  if (!shipment) return null;

  const data =
    typeof shipment.toJSON === "function"
      ? shipment.toJSON()
      : shipment;

  return {
    id: data.id,
    uuid: data.uuid,
    returnRequestId: data.returnRequestId,

    courierName: data.courierName ?? null,
    courierCode: data.courierCode ?? null,

    trackingNumber: data.trackingNumber ?? null,
    awbNumber: data.awbNumber ?? null,

    status: data.status,

    pickupScheduledAt: data.pickupScheduledAt ?? null,
    pickedUpAt: data.pickedUpAt ?? null,
    deliveredAt: data.deliveredAt ?? null,
    lastTrackedAt: data.lastTrackedAt ?? null,

    trackingEvents: Array.isArray(data.trackingEvents)
      ? data.trackingEvents.map(
          serializeCustomerTrackingEvent
        )
      : undefined,

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// =====================================================
// GET RETURN SHIPMENTS BY ORDER UUID
// =====================================================

const getReturnShipmentsByOrderUuid = async (
  orderUuid,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);
    const normalizedOrderUuid = validateUuid(
      orderUuid,
      "order UUID"
    );

    const order = await userOrderRepository.getOrderByUuid(
      normalizedOrderUuid,
      authenticatedUserId
    );

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    const returnRequests =
      await userReturnRequestRepository.getUserReturnRequestsByOrderId(
        order.id,
        authenticatedUserId
      );

    if (!returnRequests.length) {
      return [];
    }

    const results = [];

    for (const returnRequest of returnRequests) {
      const shipments =
        await userReturnShipmentRepository.getReturnShipmentsByReturnRequestId(
          returnRequest.id
        );

results.push(
  ...shipments.map(serializeCustomerReturnShipment)
);
    }

    return results;
  } catch (error) {
    logger.error(
      "Get user order return shipments failed:",
      error
    );

    throw error;
  }
};

// =====================================================
// GET RETURN SHIPMENT DETAILS FOR AUTHENTICATED USER
// =====================================================

const getReturnShipmentById = async (
  shipmentId,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const validShipmentId = validateDatabaseId(
      shipmentId,
      "return shipment ID"
    );

    const shipment =
      await userReturnShipmentRepository.getUserReturnShipmentDetails(
        validShipmentId,
        authenticatedUserId
      );

    if (!shipment) {
      throw new ApiError(404, "Return shipment not found.");
    }

    return serializeCustomerReturnShipment(shipment);
  } catch (error) {
    logger.error(
      "Get return shipment details failed:",
      error
    );

    throw error;
  }
};

// =====================================================
// GET RETURN SHIPMENT DETAILS BY UUID
// =====================================================

const getReturnShipmentByUuid = async (
  uuid,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const normalizedUuid = validateUuid(
      uuid,
      "return shipment UUID"
    );

    const shipment =
      await userReturnShipmentRepository.getReturnShipmentByUuid(
        normalizedUuid,
        {
          include: [
            {
              association: "returnRequest",
              where: {
                userId: authenticatedUserId,
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
            },
          ],
        }
      );

    if (!shipment) {
      throw new ApiError(404, "Return shipment not found.");
    }

    const shipmentDetails =
      await userReturnShipmentRepository.getUserReturnShipmentDetails(
        shipment.id,
        authenticatedUserId
      );

    if (!shipmentDetails) {
      throw new ApiError(404, "Return shipment not found.");
    }

    return serializeCustomerReturnShipment(shipmentDetails);
  } catch (error) {
    logger.error(
      "Get return shipment by UUID failed:",
      error
    );

    throw error;
  }
};

// =====================================================
// GET TRACKING HISTORY FOR AUTHENTICATED USER
// =====================================================

const getReturnShipmentTrackingHistory = async (
  shipmentId,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const validShipmentId = validateDatabaseId(
      shipmentId,
      "return shipment ID"
    );

    const shipment =
      await userReturnShipmentRepository.getUserReturnShipmentDetails(
        validShipmentId,
        authenticatedUserId
      );

    if (!shipment) {
      throw new ApiError(404, "Return shipment not found.");
    }

    const trackingEvents =
      await userReturnShipmentRepository.getTrackingEventsByShipmentId(
        validShipmentId
      );

    return trackingEvents.map(
  serializeCustomerTrackingEvent
);
  } catch (error) {
    logger.error(
      "Get return shipment tracking history failed:",
      error
    );

    throw error;
  }
};

// =====================================================
// GET LATEST RETURN SHIPMENT TRACKING STATUS
// =====================================================

const getLatestReturnShipmentTracking = async (
  shipmentId,
  userId
) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const validShipmentId = validateDatabaseId(
      shipmentId,
      "return shipment ID"
    );

    const shipment =
      await userReturnShipmentRepository.getUserReturnShipmentDetails(
        validShipmentId,
        authenticatedUserId
      );

    if (!shipment) {
      throw new ApiError(404, "Return shipment not found.");
    }

    const latestEvent =
      await userReturnShipmentRepository.getLatestTrackingEvent(
        validShipmentId
      );

return {
  shipment: serializeCustomerReturnShipment(shipment),

  latestTrackingEvent:
    serializeCustomerTrackingEvent(latestEvent),
};
  } catch (error) {
    logger.error(
      "Get latest return shipment tracking failed:",
      error
    );

    throw error;
  }
};

// =====================================================
// GET RETURN SHIPMENT BY TRACKING NUMBER
// =====================================================

const getReturnShipmentByTrackingNumber = async (
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
      await userReturnShipmentRepository.getReturnShipmentByTrackingNumber(
        normalizedTrackingNumber,
        {
          include: [
            {
              association: "returnRequest",
              where: {
                userId: authenticatedUserId,
              },
              attributes: [
                "id",
                "uuid",
                "returnNumber",
                "userId",
                "status",
              ],
              required: true,
            },
          ],
        }
      );

    if (!shipment) {
      throw new ApiError(404, "Return shipment not found.");
    }

    const shipmentDetails =
      await userReturnShipmentRepository.getUserReturnShipmentDetails(
        shipment.id,
        authenticatedUserId
      );

    if (!shipmentDetails) {
      throw new ApiError(404, "Return shipment not found.");
    }

    return serializeCustomerReturnShipment(shipmentDetails);
  } catch (error) {
    logger.error(
      "Get return shipment by tracking number failed:",
      error
    );

    throw error;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getReturnShipmentsByOrderUuid,
  getReturnShipmentById,
  getReturnShipmentByUuid,
  getReturnShipmentTrackingHistory,
  getLatestReturnShipmentTracking,
  getReturnShipmentByTrackingNumber,
};
