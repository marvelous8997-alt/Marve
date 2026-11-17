
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userInquiryService } = require("../../services");

const {
  createInquirySchema,
  inquiryIdSchema,
} = require("../../validations/user/inquiry.validation");

// CREATE INQUIRY
const createInquiry = asyncHandler(async (req, res) => {
  const { error, value } = createInquirySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const inquiry = await userInquiryService.createInquiry(value);

  return ResponseHelper.success(
    res,
    "Your inquiry has been submitted successfully.",
    inquiry,
    201
  );
});

// GET ALL INQUIRIES
// IMPORTANT: Protect this endpoint with admin authentication.
const getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await userInquiryService.getInquiries();

  return ResponseHelper.success(
    res,
    "Inquiries fetched successfully.",
    inquiries
  );
});

// GET INQUIRY BY ID
// IMPORTANT: Protect this endpoint and verify access permissions.
const getInquiryById = asyncHandler(async (req, res) => {
  const { error, value } = inquiryIdSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const inquiry = await userInquiryService.getInquiryById(value.id);

  return ResponseHelper.success(
    res,
    "Inquiry fetched successfully.",
    inquiry
  );
});

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
};
