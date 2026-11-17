"use strict";

const express = require("express");
const router = express.Router();

const {
  handleTrackingWebhook,
} = require("../../../controllers/webhook/shiprocket.webhook.controller");

router.post(
  "/tracking-update",
  handleTrackingWebhook
);

module.exports = router;