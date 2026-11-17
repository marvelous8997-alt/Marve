"use strict";

const express = require("express");
const router = express.Router();

const {
  userCheckoutAddressController,
} = require("../../../../../src/controllers/index");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= CHECKOUT ADDRESS ROUTES ========================= */

// GET ALL CHECKOUT ADDRESSES
// GET /api/user/checkout-addresses
router.get(
  "/",
  authenticate,
  userCheckoutAddressController.getCheckoutAddresses
);

// CREATE CHECKOUT ADDRESS
// POST /api/user/checkout-addresses
router.post(
  "/",
  authenticate,
  userCheckoutAddressController.createCheckoutAddress
);

// GET CHECKOUT ADDRESS BY ID
// GET /api/user/checkout-addresses/:id
router.get(
  "/:id",
  authenticate,
  userCheckoutAddressController.getCheckoutAddressById
);

// UPDATE CHECKOUT ADDRESS
// PATCH /api/user/checkout-addresses/:id
router.patch(
  "/:id",
  authenticate,
  userCheckoutAddressController.updateCheckoutAddress
);

// DELETE CHECKOUT ADDRESS
// DELETE /api/user/checkout-addresses/:id
router.delete(
  "/:id",
  authenticate,
  userCheckoutAddressController.deleteCheckoutAddress
);

// SET DEFAULT CHECKOUT ADDRESS
// PATCH /api/user/checkout-addresses/:id/default
router.patch(
  "/:id/default",
  authenticate,
  userCheckoutAddressController.setDefaultCheckoutAddress
);

/* ========================= EXPORTS ========================= */

module.exports = router;