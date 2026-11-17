
"use strict";

const express = require("express");
const router = express.Router();

const {
  userProfileController,
} = require("../../../../controllers");

const authenticate = require("../../../../middleware/authenticate");

/* ========================= USER PROFILE ROUTES ========================= */

// GET USER PROFILE
// GET /api/user/profile
router.get(
  "/",
  authenticate,
  userProfileController.getUserProfile
);

// UPDATE USER PROFILE
// PUT /api/user/profile
router.put(
  "/",
  authenticate,
  userProfileController.updateUserProfile
);

/* ========================= EXPORTS ========================= */

module.exports = router;
