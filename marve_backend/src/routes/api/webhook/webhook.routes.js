"use strict";

const express = require("express");
const router = express.Router();

/* =========================================================
   WEBHOOK CONTROLLERS
========================================================= */

const {
  handleTrackingWebhook,
} = require("../../../../src/controllers/webhook/shiprocket.webhook.controller");

const {
  handleReturnTrackingWebhook,
} = require("../../../../src/controllers/webhook/returnShipmentWebhook.controller");

/* =========================================================
   FORWARD SHIPMENT TRACKING WEBHOOK
========================================================= */

router.post(
  "/shiprocket/tracking",
  handleTrackingWebhook
);

/* =========================================================
   RETURN SHIPMENT TRACKING WEBHOOK
========================================================= */

router.post(
  "/shiprocket/return-tracking",
  handleReturnTrackingWebhook
);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = router;