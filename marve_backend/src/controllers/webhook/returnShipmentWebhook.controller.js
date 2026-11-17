
"use strict";

const crypto = require("crypto");

const {
  adminReturnRequestRepository,
} = require("../../repositories");

const {
  sequelize,
  ReturnRequest,
  ReturnShipment,
} = require("../../database/models");

const logger = require("../../utils/winston.util");

/* =========================================================
   HELPERS
========================================================= */

const normalizeText = (value) =>
  String(value ?? "").trim();

const getErrorMessage = (error) =>
  error?.message || "Return tracking webhook processing failed.";

/* =========================================================
   VERIFY SHIPROCKET WEBHOOK TOKEN
========================================================= */

const verifyWebhookToken = (req) => {
  const configuredToken = normalizeText(
    process.env.SHIPROCKET_WEBHOOK_SECRET
  );

  const receivedToken = normalizeText(
    req.headers["x-api-key"]
  );

  if (!configuredToken || !receivedToken) {
    return false;
  }

  const expected = Buffer.from(configuredToken);
  const received = Buffer.from(receivedToken);

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
};

/* =========================================================
   NORMALIZE RETURN SHIPMENT STATUS
========================================================= */

const normalizeReturnShipmentStatus = (value) => {
  const status = normalizeText(value)
    .toUpperCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  const statusMap = {
    "AWB ASSIGNED": "PICKUP_REQUESTED",
    "PICKUP GENERATED": "PICKUP_REQUESTED",
    "PICKUP REQUESTED": "PICKUP_REQUESTED",

    "PICKUP SCHEDULED": "PICKUP_SCHEDULED",
    "PICKUP RESCHEDULED": "PICKUP_SCHEDULED",

    "PICKUP DONE": "PICKED_UP",
    "PICKED UP": "PICKED_UP",
    "SHIPPED": "PICKED_UP",

    "IN TRANSIT": "IN_TRANSIT",
    "REACHED AT ORIGIN HUB": "IN_TRANSIT",
    "REACHED AT DESTINATION HUB": "IN_TRANSIT",
    "REACHED AT HUB": "IN_TRANSIT",

    "OUT FOR DELIVERY": "OUT_FOR_DELIVERY",

    "DELIVERED": "DELIVERED",

    "PICKUP FAILED": "PICKUP_FAILED",
    "PICKUP EXCEPTION": "PICKUP_FAILED",

    "CANCELLED": "CANCELLED",
    "CANCELED": "CANCELLED",

    "RTO": "RTO",
    "RTO INITIATED": "RTO",
    "RTO IN TRANSIT": "RTO",
    "RTO ACKNOWLEDGED": "RTO",
    "RTO DELIVERED": "RTO",
    "RETURN TO ORIGIN": "RTO",
  };

  return statusMap[status] || null;
};

/* =========================================================
   PARSE EVENT DATE
========================================================= */

const parseEventDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

/* =========================================================
   PARSE SHIPROCKET WEBHOOK EVENTS
========================================================= */

const parseReturnWebhookEvents = (payload) => {
  const scans = Array.isArray(payload.scans)
    ? payload.scans
    : [];

  const events = scans.map((scan) => {
    const rawStatus =
      scan["sr-status-label"] ||
      scan.current_status ||
      scan.status ||
      scan.activity;

    const status =
      normalizeReturnShipmentStatus(rawStatus);

    return {
      providerEventId:
        scan.event_id ||
        scan.eventId ||
        scan.id ||
        null,

      status,

      location:
        normalizeText(scan.location) || null,

      description:
        normalizeText(scan.activity) ||
        normalizeText(scan["sr-status-label"]) ||
        normalizeText(scan.status) ||
        null,

      eventAt:
        parseEventDate(
          scan.date ||
          scan.event_time ||
          scan.timestamp
        ) || new Date(),

      source: "COURIER",

      rawPayload: scan,
    };
  });

  // Fallback when Shiprocket sends no scan history.

  if (!events.length) {
    const rawStatus =
      payload.current_status ||
      payload.shipment_status;

    const status =
      normalizeReturnShipmentStatus(rawStatus);

    if (status) {
      events.push({
        providerEventId:
          payload.event_id ||
          payload.eventId ||
          null,

        status,

        location:
          normalizeText(payload.location) || null,

        description:
          normalizeText(rawStatus) ||
          "Return shipment status updated.",

        eventAt:
          parseEventDate(
            payload.current_timestamp ||
            payload.event_time
          ) || new Date(),

        source: "COURIER",

        rawPayload: payload,
      });
    }
  }

  return events.sort(
    (a, b) => a.eventAt - b.eventAt
  );
};

/* =========================================================
   PREVENT RETURN SHIPMENT STATUS REGRESSION
========================================================= */

const RETURN_SHIPMENT_STATUS_RANK = {
  PENDING: 0,
  PICKUP_REQUESTED: 1,
  PICKUP_FAILED: 1,
  PICKUP_SCHEDULED: 2,
  PICKED_UP: 3,
  IN_TRANSIT: 4,
  OUT_FOR_DELIVERY: 5,
  DELIVERED: 6,
};

const shouldUpdateReturnShipmentStatus = (
  currentStatus,
  nextStatus
) => {
  if (!nextStatus || currentStatus === nextStatus) {
    return false;
  }

  // Terminal statuses must not be overwritten by old scans.

  if (
    currentStatus === "DELIVERED" ||
    currentStatus === "CANCELLED" ||
    currentStatus === "RTO"
  ) {
    return false;
  }

  // Explicit terminal event, unless already delivered.

  if (
    nextStatus === "CANCELLED" ||
    nextStatus === "RTO"
  ) {
    return true;
  }

  // Pickup failure can be followed by a successful retry.

  if (
    currentStatus === "PICKUP_FAILED" &&
    nextStatus === "PICKUP_SCHEDULED"
  ) {
    return true;
  }

  const currentRank =
    RETURN_SHIPMENT_STATUS_RANK[currentStatus] ?? -1;

  const nextRank =
    RETURN_SHIPMENT_STATUS_RANK[nextStatus] ?? -1;

  return nextRank > currentRank;
};

/* =========================================================
   MAP RETURN SHIPMENT STATUS TO RETURN REQUEST STATUS
========================================================= */

const getReturnRequestStatusUpdate = (
  shipmentStatus,
  currentRequestStatus
) => {
  const allowedCurrentStatuses = [
    "APPROVED",
    "PICKUP_SCHEDULED",
    "PICKED_UP",
  ];

  if (
    !allowedCurrentStatuses.includes(currentRequestStatus)
  ) {
    return null;
  }

  if (shipmentStatus === "DELIVERED") {
    return {
      status: "RECEIVED",
      payload: {
        receivedAt: new Date(),
      },
    };
  }

  if (
    [
      "PICKED_UP",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
    ].includes(shipmentStatus)
  ) {
    if (currentRequestStatus === "APPROVED" ||
        currentRequestStatus === "PICKUP_SCHEDULED") {
      return {
        status: "PICKED_UP",
        payload: {},
      };
    }
  }

  if (
    shipmentStatus === "PICKUP_SCHEDULED" &&
    currentRequestStatus === "APPROVED"
  ) {
    return {
      status: "PICKUP_SCHEDULED",
      payload: {},
    };
  }

  return null;
};

/* =========================================================
   SHIPROCKET RETURN TRACKING WEBHOOK
========================================================= */

const handleReturnTrackingWebhook = async (req, res) => {
  try {
    // STEP 1: Verify webhook security token.

    if (!verifyWebhookToken(req)) {
      logger.warn(
        "Rejected return shipment webhook: invalid security token."
      );

      return res.status(401).json({
        success: false,
        message: "Unauthorized webhook request.",
      });
    }

    // STEP 2: Validate webhook payload.

    const payload = req.body || {};

    const awbNumber = normalizeText(
      payload.awb ||
      payload.awb_number ||
      payload.awbNumber
    );

    if (!awbNumber) {
      logger.warn(
        "Return shipment webhook received without AWB number."
      );

      return res.status(200).json({
        success: true,
        message: "Webhook received, but AWB number is missing.",
      });
    }

    // STEP 3: Find return shipment using AWB.

    const existingShipment =
      await adminReturnRequestRepository
        .getReturnShipmentByAwbNumber(awbNumber);

    if (!existingShipment) {
      logger.warn(
        "No return shipment found for webhook AWB.",
        { awbNumber }
      );

      return res.status(200).json({
        success: true,
        message: "No matching return shipment found.",
      });
    }

    // STEP 4: Parse tracking events.

    const events = parseReturnWebhookEvents(payload);

    if (!events.length) {
      logger.warn(
        "No supported return tracking events found.",
        {
          awbNumber,
          currentStatus: payload.current_status,
        }
      );

      return res.status(200).json({
        success: true,
        message: "No supported return tracking events found.",
      });
    }

    // STEP 5: Process events inside a transaction.

    const result = await sequelize.transaction(
      async (transaction) => {
        const shipment =
          await ReturnShipment.findByPk(
            existingShipment.id,
            {
              transaction,
              lock: transaction.LOCK.UPDATE,
            }
          );

        if (!shipment) {
          return {
            notFound: true,
          };
        }

        const returnRequest =
          await ReturnRequest.findByPk(
            shipment.returnRequestId,
            {
              transaction,
              lock: transaction.LOCK.UPDATE,
            }
          );

        if (!returnRequest) {
          return {
            requestNotFound: true,
          };
        }

        let processedCount = 0;
        let duplicateCount = 0;
        let skippedCount = 0;

        let shipmentUpdate = {};
        let currentShipmentStatus = shipment.status;

        for (const event of events) {
          // Check duplicate using provider event ID first.

          let duplicate = null;

          if (event.providerEventId) {
            duplicate =
              await adminReturnRequestRepository
                .getReturnTrackingEventByProviderEventId(
                  shipment.id,
                  String(event.providerEventId),
                  { transaction }
                );
          }

          // Fallback duplicate check.

          if (!duplicate) {
            duplicate =
              await adminReturnRequestRepository
                .getDuplicateReturnTrackingEvent(
                  {
                    returnShipmentId: shipment.id,
                    status: event.status,
                    eventAt: event.eventAt,
                    location: event.location,
                    description: event.description,
                  },
                  { transaction }
                );
          }

          if (duplicate) {
            duplicateCount++;
            continue;
          }

          // Save tracking event.

          await adminReturnRequestRepository
            .createReturnTrackingEvent(
              {
                returnShipmentId: shipment.id,
                providerEventId: event.providerEventId
                  ? String(event.providerEventId)
                  : null,
                status: event.status,
                location: event.location,
                description: event.description,
                eventAt: event.eventAt,
                source: "COURIER",
                rawPayload: event.rawPayload,
              },
              { transaction }
            );

          processedCount++;

          // Update status only when it moves forward.

          if (
            shouldUpdateReturnShipmentStatus(
              currentShipmentStatus,
              event.status
            )
          ) {
            currentShipmentStatus = event.status;

            shipmentUpdate.status = event.status;
          }

          if (
            event.status === "PICKED_UP" &&
            !shipment.pickedUpAt &&
            !shipmentUpdate.pickedUpAt
          ) {
            shipmentUpdate.pickedUpAt = event.eventAt;
          }

          if (
            event.status === "DELIVERED" &&
            !shipment.deliveredAt &&
            !shipmentUpdate.deliveredAt
          ) {
            shipmentUpdate.deliveredAt = event.eventAt;
          }
        }

        // Update shipment tracking sync information.

        shipmentUpdate.lastTrackedAt = new Date();

        shipmentUpdate.rawPayload = {
          ...(shipment.rawPayload &&
          typeof shipment.rawPayload === "object" &&
          !Array.isArray(shipment.rawPayload)
            ? shipment.rawPayload
            : {}),
          lastWebhookPayload: payload,
        };

        await adminReturnRequestRepository
          .updateReturnShipment(
            shipment,
            shipmentUpdate,
            { transaction }
          );

        // Update ReturnRequest based on the latest
        // effective shipment status.

        const requestStatusUpdate =
          getReturnRequestStatusUpdate(
            currentShipmentStatus,
            returnRequest.status
          );

        if (requestStatusUpdate) {
          await adminReturnRequestRepository
            .updateReturnRequestStatus(
              returnRequest,
              requestStatusUpdate.status,
              requestStatusUpdate.payload,
              { transaction }
            );
        }

        return {
          shipmentId: shipment.id,
          returnRequestId: returnRequest.id,
          currentShipmentStatus,
          currentRequestStatus:
            requestStatusUpdate?.status ||
            returnRequest.status,
          processedCount,
          duplicateCount,
          skippedCount,
        };
      }
    );

    if (result.notFound || result.requestNotFound) {
      logger.warn(
        "Return shipment or return request not found during webhook processing.",
        { awbNumber }
      );

      return res.status(200).json({
        success: true,
        message: "Matching return shipment or request not found.",
      });
    }

    logger.info(
      "Return shipment webhook processed successfully.",
      {
        awbNumber,
        ...result,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Return tracking webhook processed successfully.",
      data: {
        ...result,
        awbNumber,
      },
    });
  } catch (error) {
    logger.error(
      "Return shipment webhook processing failed.",
      {
        message: getErrorMessage(error),
      }
    );

    return res.status(500).json({
      success: false,
      message: "Unable to process return tracking webhook.",
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  handleReturnTrackingWebhook,
};
