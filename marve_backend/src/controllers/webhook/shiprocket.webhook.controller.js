"use strict";

const crypto = require("crypto");

const {
  adminShipmentRepository,
} = require("../../repositories");

const shipmentService = require("../../services/admin/shipment.service");

const logger = require("../../utils/winston.util");

/* =========================================================
   HELPERS
========================================================= */

const normalizeText = (value) =>
  String(value ?? "").trim();

const getErrorMessage = (error) =>
  error?.message || "Webhook processing failed.";

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
   NORMALIZE SHIPROCKET STATUS
========================================================= */

const normalizeShipmentStatus = (value) => {
  const status = normalizeText(value)
    .toUpperCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  const statusMap = {
    "READY TO SHIP": "READY_TO_SHIP",
    "AWB ASSIGNED": "READY_TO_SHIP",
    "PICKED UP": "PICKED_UP",
    "SHIPPED": "PICKED_UP",
    "IN TRANSIT": "IN_TRANSIT",
    "REACHED AT DESTINATION HUB": "IN_TRANSIT",
    "OUT FOR DELIVERY": "OUT_FOR_DELIVERY",
    "DELIVERED": "DELIVERED",
    "CANCELLED": "CANCELLED",
    "CANCELED": "CANCELLED",
    "RTO INITIATED": "RETURN_TO_ORIGIN",
    "RTO IN TRANSIT": "RETURN_TO_ORIGIN",
    "RTO ACKNOWLEDGED": "RETURN_TO_ORIGIN",
    "RTO DELIVERED": "RETURN_TO_ORIGIN",
    "UNDELIVERED": "FAILED",
    "DELIVERY EXCEPTION": "FAILED",
    "LOST": "FAILED",
    "DAMAGED": "FAILED",
  };

  return statusMap[status] || null;
};

/* =========================================================
   PARSE WEBHOOK EVENTS
========================================================= */

const parseWebhookEvents = (payload) => {
  const scans = Array.isArray(payload.scans)
    ? payload.scans
    : [];

  const events = scans.map((scan) => ({
    status: normalizeShipmentStatus(
      scan["sr-status-label"] ||
      scan.status ||
      scan.activity
    ),
    location: normalizeText(scan.location) || null,
    description:
      normalizeText(scan.activity) ||
      normalizeText(scan.status) ||
      null,
    eventAt: scan.date ? new Date(scan.date) : null,
    rawPayload: scan,
  }));

  // Fallback when Shiprocket sends no scans.
  if (!events.length) {
    events.push({
      status: normalizeShipmentStatus(
        payload.current_status ||
        payload.shipment_status
      ),
      location: null,
      description: normalizeText(
        payload.current_status ||
        payload.shipment_status
      ) || "Shipment status updated.",
      eventAt: payload.current_timestamp
        ? new Date(payload.current_timestamp)
        : new Date(),
      rawPayload: payload,
    });
  }

  return events
    .filter((event) => (
      event.status &&
      event.eventAt &&
      !Number.isNaN(event.eventAt.getTime())
    ))
    .sort((a, b) => a.eventAt - b.eventAt);
};

/* =========================================================
   SHIPROCKET TRACKING WEBHOOK
========================================================= */

const handleTrackingWebhook = async (req, res) => {
  try {
    // STEP 1: Verify webhook security token.

    if (!verifyWebhookToken(req)) {
      logger.warn("Rejected shipment webhook: invalid security token.");

      return res.status(401).json({
        success: false,
        message: "Unauthorized webhook request.",
      });
    }

    // STEP 2: Validate payload.

    const payload = req.body || {};

    const awbNumber = normalizeText(payload.awb);

    if (!awbNumber) {
      logger.warn("Shipment webhook received without AWB number.");

      // Return 200 to avoid unnecessary repeated callbacks
      // for an unusable payload.
      return res.status(200).json({
        success: true,
        message: "Webhook received, but AWB number is missing.",
      });
    }

    // STEP 3: Find local shipment using AWB.

    const shipment =
      await adminShipmentRepository.getShipmentByAwbNumber(
        awbNumber
      );

    if (!shipment) {
      logger.warn("No local shipment found for webhook AWB.", {
        awbNumber,
      });

      return res.status(200).json({
        success: true,
        message: "No matching shipment found.",
      });
    }

    // STEP 4: Parse tracking events.

    const events = parseWebhookEvents(payload);

    if (!events.length) {
      logger.warn("No supported tracking events found in webhook.", {
        awbNumber,
        currentStatus: payload.current_status,
      });

      return res.status(200).json({
        success: true,
        message: "No supported tracking events to process.",
      });
    }

    // STEP 5: Process events.

    let processedCount = 0;
    let duplicateCount = 0;
    let skippedCount = 0;

    for (const event of events) {
      const duplicate =
        await adminShipmentRepository.getDuplicateTrackingEvent({
          shipmentId: shipment.id,
          status: event.status,
          eventAt: event.eventAt,
          location: event.location,
          description: event.description,
        });

      if (duplicate) {
        duplicateCount++;
        continue;
      }

      await shipmentService.updateShipmentStatus(
        shipment.id,
        event.status,
        {
          location: event.location,
          description: event.description,
          eventAt: event.eventAt,
          source: "COURIER",
          rawPayload: event.rawPayload,
        }
      );

      processedCount++;
    }

    // STEP 6: Update last successful tracking sync time.

    await adminShipmentRepository.updateLastTrackedAt(
      shipment,
      new Date()
    );

    logger.info("Shipment webhook processed successfully.", {
      shipmentId: shipment.id,
      awbNumber,
      processedCount,
      duplicateCount,
      skippedCount,
    });

    return res.status(200).json({
      success: true,
      message: "Tracking webhook processed successfully.",
      data: {
        shipmentId: shipment.id,
        awbNumber,
        processedCount,
        duplicateCount,
        skippedCount,
      },
    });
  } catch (error) {
    logger.error("Shipment webhook processing failed.", {
      message: getErrorMessage(error),
    });

    return res.status(500).json({
      success: false,
      message: "Unable to process shipment webhook.",
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  handleTrackingWebhook,
};