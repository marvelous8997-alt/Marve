
"use strict";

const express = require("express");
const router = express.Router();

const { adminShipmentController } = require("../../../../controllers");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

/* =========================================================
   GET SHIPMENT LIST
========================================================= */

router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminShipmentController.getShipments
);

/* =========================================================
   GET SHIPMENT DETAILS
========================================================= */

router.get(
  "/list/:identifier",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminShipmentController.getShipment
);

/* =========================================================
   CREATE SHIPMENT
========================================================= */

router.post(
  "/create",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminShipmentController.createShipment
);

/* =========================================================
   GET SHIPMENT TRACKING HISTORY
========================================================= */

router.get(
  "/:identifier/tracking",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminShipmentController.getShipmentTrackingHistory
);

/* =========================================================
   GET LATEST SHIPMENT TRACKING
========================================================= */

router.get(
  "/:identifier/tracking/latest",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminShipmentController.getLatestShipmentTracking
);

/* =========================================================
   UPDATE SHIPMENT STATUS
========================================================= */

router.patch(
  "/status/:identifier",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminShipmentController.updateShipmentStatus
);

/* =========================================================
   SYNC SHIPMENT TRACKING
========================================================= */

router.post(
  "/:identifier/tracking/sync",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminShipmentController.syncShipmentTracking
);
/* =========================================================
   EXPORTS
========================================================= */

module.exports = router;
