
"use strict";

const express = require("express");
const router = express.Router();

const {
  userShipmentController,
} = require("../../../../../src/controllers/index");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= SHIPMENT ROUTES ========================= */

// GET SHIPMENT TRACKING HISTORY
// GET /api/user/shipments/:id/tracking
router.get(
  "/:id/tracking",
  authenticate,
  userShipmentController.getShipmentTrackingHistory
);

// GET LATEST SHIPMENT TRACKING
// GET /api/user/shipments/:id/tracking/latest
router.get(
  "/:id/tracking/latest",
  authenticate,
  userShipmentController.getLatestShipmentTracking
);

// GET SHIPMENTS BY ORDER ID
// GET /api/user/shipments/order/:orderId
router.get(
  "/order/:orderId",
  authenticate,
  userShipmentController.getShipmentsByOrderId
);

// GET SHIPMENT BY UUID
// GET /api/user/shipments/uuid/:uuid
router.get(
  "/uuid/:uuid",
  authenticate,
  userShipmentController.getShipmentByUuid
);

// GET SHIPMENT BY TRACKING NUMBER
// GET /api/user/shipments/tracking/:trackingNumber
router.get(
  "/tracking/:trackingNumber",
  authenticate,
  userShipmentController.getShipmentByTrackingNumber
);

// GET SHIPMENT BY ID
// GET /api/user/shipments/:id
router.get(
  "/:id",
  authenticate,
  userShipmentController.getShipmentById
);

/* ========================= EXPORTS ========================= */

module.exports = router;
