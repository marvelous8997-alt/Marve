
"use strict";

const express = require("express");
const router = express.Router();

const {
  userAddressController,
} = require("../../../../controllers");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= USER ADDRESS ROUTES ========================= */

// GET ALL ADDRESSES
// GET /api/user/addresses
router.get(
  "/",
  authenticate,
  userAddressController.getCheckoutAddresses
);

// CREATE ADDRESS
// POST /api/user/addresses
router.post(
  "/",
  authenticate,
  userAddressController.createCheckoutAddress
);

// GET ADDRESS BY ID
// GET /api/user/addresses/:id
router.get(
  "/:id",
  authenticate,
  userAddressController.getCheckoutAddressById
);

// UPDATE ADDRESS
// PUT /api/user/addresses/:id
router.put(
  "/:id",
  authenticate,
  userAddressController.updateCheckoutAddress
);

// DELETE ADDRESS
// DELETE /api/user/addresses/:id
router.delete(
  "/:id",
  authenticate,
  userAddressController.deleteCheckoutAddress
);

// SET DEFAULT ADDRESS
// PATCH /api/user/addresses/:id/default
router.patch(
  "/:id/default",
  authenticate,
  userAddressController.setDefaultCheckoutAddress
);

/* ========================= EXPORTS ========================= */

module.exports = router;
