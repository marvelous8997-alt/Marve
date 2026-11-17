
"use strict";

const express = require("express");
const router = express.Router();

const {
  userReturnShipmentController,
} = require("../../../../../src/controllers/index");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= RETURN SHIPMENT ROUTES ========================= */

// GET RETURN SHIPMENT TRACKING HISTORY
// GET /api/user/return-shipments/:id/tracking
router.get(
  "/:id/tracking",
  authenticate,
  userReturnShipmentController.getReturnShipmentTrackingHistory
);

// GET LATEST RETURN SHIPMENT TRACKING
// GET /api/user/return-shipments/:id/tracking/latest
router.get(
  "/:id/tracking/latest",
  authenticate,
  userReturnShipmentController.getLatestReturnShipmentTracking
);

// GET RETURN SHIPMENTS BY ORDER UUID
// GET /api/user/return-shipments/order/:orderUuid
router.get(
  "/order/:orderUuid",
  authenticate,
  userReturnShipmentController.getReturnShipmentsByOrderUuid
);

// GET RETURN SHIPMENT BY UUID
// GET /api/user/return-shipments/uuid/:uuid
router.get(
  "/uuid/:uuid",
  authenticate,
  userReturnShipmentController.getReturnShipmentByUuid
);

// GET RETURN SHIPMENT BY TRACKING NUMBER
// GET /api/user/return-shipments/tracking/:trackingNumber
router.get(
  "/tracking/:trackingNumber",
  authenticate,
  userReturnShipmentController.getReturnShipmentByTrackingNumber
);

// GET RETURN SHIPMENT BY ID
// GET /api/user/return-shipments/:id
router.get(
  "/:id",
  authenticate,
  userReturnShipmentController.getReturnShipmentById
);

/* ========================= EXPORTS ========================= */

module.exports = router;
