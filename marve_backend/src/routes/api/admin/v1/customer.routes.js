
"use strict";

const express = require("express");
const router = express.Router();

const { adminCustomerController } = require("../../../../controllers");

const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");
/* =========================================================
   GET CUSTOMER LIST
   GET /list?page=1&limit=8&search=&status=ALL
========================================================= */

router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCustomerController.getCustomers
);

/* =========================================================
   GET CUSTOMER STATUS COUNTS
========================================================= */

router.get(
  "/status-counts",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCustomerController.getCustomerStatusCounts
);

/* =========================================================
   GET CUSTOMER DETAILS
========================================================= */

router.get(
  "/list/:id",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCustomerController.getCustomer
);

/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

router.patch(
  "/status/:id",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminCustomerController.updateCustomerStatus
);

module.exports = router;
