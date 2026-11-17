"use strict";

const express = require("express");
const router = express.Router();

const {
  userOrderController,
} = require("../../../../../src/controllers/index");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= ORDER ROUTES ========================= */

// GET ALL ORDERS FOR LOGGED-IN USER
// GET /api/user/orders
router.get(
  "/",
  authenticate,
  userOrderController.getOrders
);

// CREATE ORDER
// POST /api/user/orders
router.post(
  "/",
  authenticate,
  userOrderController.createOrder
);

// GET ORDER BY ID
// GET /api/user/orders/:id
router.get(
  "/:id",
  authenticate,
  userOrderController.getOrderById
);

// CANCEL ORDER
// PATCH /api/user/orders/:id/cancel
router.patch(
  "/:id/cancel",
  authenticate,
  userOrderController.cancelOrder
);

/* ========================= EXPORTS ========================= */

module.exports = router;