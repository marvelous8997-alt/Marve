"use strict";

const express = require("express");
const router = express.Router();

const { adminInquiryController } = require("../../../../controllers/index");
const authenticateAdmin = require("../../../../middleware/authenticateAdmin");
const authorize = require("../../../../middleware/authorize");

// GET INQUIRY LIST
router.get(
  "/list",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInquiryController.getInquiries
);

// GET INQUIRY DETAILS BY ID OR UUID
router.get(
  "/list/:identifier",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInquiryController.getInquiry
);

// UPDATE INQUIRY STATUS
router.patch(
  "/status/:identifier",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInquiryController.updateInquiryStatus
);

// DELETE INQUIRY PERMANENTLY
router.delete(
  "/:identifier",
  authenticateAdmin,
  authorize("SUPER_ADMIN", "ADMIN"),
  adminInquiryController.deleteInquiry
);

module.exports = router;