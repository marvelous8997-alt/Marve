"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { adminInquiryService } = require("../../services");

// GET INQUIRY LIST
const getInquiries = asyncHandler(async (req, res) => {
  const result = await adminInquiryService.getInquiries({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
    status: req.query.status || undefined,
    subject: req.query.subject || undefined,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "DESC",
  });

  return ResponseHelper.success(
    res,
    "Inquiries fetched successfully.",
    result
  );
});

// GET INQUIRY DETAILS
const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await adminInquiryService.getInquiry(
    req.params.identifier
  );

  return ResponseHelper.success(
    res,
    "Inquiry fetched successfully.",
    inquiry
  );
});

// UPDATE INQUIRY STATUS
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["NEW", "READ", "RESOLVED"].includes(status)) {
    return ResponseHelper.error(
      res,
      "Invalid inquiry status.",
      null,
      422
    );
  }

  const inquiry = await adminInquiryService.updateInquiryStatus(
    req.params.identifier,
    status
  );

  return ResponseHelper.success(
    res,
    "Inquiry status updated successfully.",
    inquiry
  );
});

// DELETE INQUIRY
const deleteInquiry = asyncHandler(async (req, res) => {
  await adminInquiryService.deleteInquiry(req.params.identifier);

  return ResponseHelper.success(
    res,
    "Inquiry deleted successfully."
  );
});

module.exports = {
  getInquiries,
  getInquiry,
  updateInquiryStatus,
  deleteInquiry,
};