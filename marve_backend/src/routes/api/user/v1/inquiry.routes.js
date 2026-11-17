
"use strict";

const express = require("express");
const router = express.Router();

const {
  userInquiryController,
} = require("../../../../controllers");

// CREATE INQUIRY FROM USER PANEL
router.post(
  "/",
  userInquiryController.createInquiry
);

// GET ALL INQUIRIES
// Admin-protected route par hi expose karein.
router.get(
  "/",
  userInquiryController.getInquiries
);

// GET INQUIRY BY ID
// Authentication aur authorization zaroori hai.
router.get(
  "/:id",
  userInquiryController.getInquiryById
);

module.exports = router;
