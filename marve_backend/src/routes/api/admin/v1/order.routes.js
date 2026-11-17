
"use strict";

const express = require("express");
const router = express.Router();

const { adminOrderController } = require("../../../../controllers");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

/* =========================================================
   GET ORDER LIST
========================================================= */

router.get(
  "/list",
authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminOrderController.getOrders
);

/* =========================================================
   GET ORDER DETAILS
========================================================= */

router.get(
  "/list/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminOrderController.getOrder
);

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

router.patch(
  "/status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminOrderController.updateOrderStatus
);

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

router.patch(
  "/payment-status/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminOrderController.updatePaymentStatus
);

/* =========================================================
   CANCEL ORDER
========================================================= */

router.patch(
  "/cancel/:uuid",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminOrderController.cancelOrder
);

module.exports = router;
