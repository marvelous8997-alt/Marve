
"use strict";

const express = require("express");
const router = express.Router();

const {
  userReturnRequestController,
} = require("../../../../controllers");
const uploadReturnImages = require(
  "../../../../middleware/uploadReturnImages.middleware"
);
const uploadFolder = require("../../../../middleware/uploadFolder");
const authenticate = require("../../../../middleware/authenticate");

/* ========================= USER RETURN REQUEST ROUTES ========================= */

// CREATE RETURN REQUEST
// POST /api/user/return-requests/create
router.post(
  "/create",
  authenticate,
  uploadFolder("returns"),
  uploadReturnImages,
  userReturnRequestController.createReturnRequest
);

// GET ALL USER RETURN REQUESTS
// GET /api/user/return-requests/list
router.get(
  "/list",
  authenticate,
  userReturnRequestController.getReturnRequests
);

// GET RETURN REQUEST BY UUID
// GET /api/user/return-requests/list/:uuid
router.get(
  "/list/:uuid",
  authenticate,
  userReturnRequestController.getReturnRequestByUuid
);

// GET RETURN REQUEST BY ORDER UUID
// GET /api/user/return-requests/order/:orderUuid
router.get(
  "/order/:orderUuid",
  authenticate,
  userReturnRequestController.getReturnRequestByOrder
);

// CANCEL RETURN REQUEST
// PATCH /api/user/return-requests/cancel/:uuid
router.patch(
  "/cancel/:uuid",
  authenticate,
  userReturnRequestController.cancelReturnRequest
);

/* ========================= EXPORTS ========================= */

module.exports = router;
