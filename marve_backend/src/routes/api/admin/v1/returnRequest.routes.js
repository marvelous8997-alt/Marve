"use strict";

const express = require("express");
const router = express.Router();

const { adminReturnRequestController } = require("../../../../controllers");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

/* =========================================================
   GET RETURN REQUEST LIST
========================================================= */

router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminReturnRequestController.getReturnRequests
);

/* =========================================================
   GET RETURN REQUEST DETAILS
========================================================= */

router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminReturnRequestController.getReturnRequest
);

/* =========================================================
   APPROVE RETURN REQUEST
========================================================= */

router.patch(
  "/approve/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminReturnRequestController.approveReturnRequest
);

/* =========================================================
   REJECT RETURN REQUEST
========================================================= */

router.patch(
  "/reject/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminReturnRequestController.rejectReturnRequest
);

/* =========================================================
   GET RETURN REQUEST STATUS COUNTS
========================================================= */

router.get(
  "/status-counts",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminReturnRequestController.getReturnStatusCounts
);

/* =========================================================
   RETRY RETURN PICKUP
========================================================= */

router.post(
  "/retry-pickup/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminReturnRequestController.retryReturnPickup
);

/* =========================================================
   REFRESH RETURN TRACKING
========================================================= */

router.post(
  "/refresh-tracking/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminReturnRequestController.refreshReturnTracking
);

module.exports = router;