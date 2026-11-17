"use strict";

const express = require("express");
const router = express.Router();
const { adminAuthController } = require("../../../../../src/controllers/index");
const authenticateAdmin = require("../../../../middleware/authenticateAdmin");

// Admin Login
router.post(
  "/login",
  adminAuthController.login
);

// Refresh Admin Token
router.post(
  "/refresh-token",
  adminAuthController.refreshToken
);

// Admin Logout
router.post(
  "/logout",
  adminAuthController.logout
);

// Get Current Admin Profile
router.get(
  "/me",
  authenticateAdmin,
  adminAuthController.getMe
);

module.exports = router;
