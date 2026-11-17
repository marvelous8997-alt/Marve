
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userReturnRequestService } = require("../../services");

const {
  createReturnRequestSchema,
  returnRequestUuidSchema,
  returnRequestOrderUuidSchema,
  getReturnRequestsQuerySchema,
} = require("../../validations/user/returnRequest.validation");

// CREATE RETURN REQUEST
const createReturnRequest = asyncHandler(async (req, res) => {
  // Check authenticated user
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please login to submit a return request."
    );
  }

  // Prepare multipart form-data body
  const requestBody = { ...req.body };

  // Parse items JSON string into array
  if (typeof requestBody.items === "string") {
    try {
      requestBody.items = JSON.parse(requestBody.items);
    } catch {
      throw new ApiError(
        400,
        "Invalid return items format."
      );
    }
  }

  // Validate request body
  const { error, value } = createReturnRequestSchema.validate(
    requestBody,
    {
      abortEarly: false,
      stripUnknown: false,
    }
  );

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  // Create return request with uploaded image files
  const returnRequest =
    await userReturnRequestService.createReturnRequest(
      value,
      req.files,
      userId
    );

  return ResponseHelper.success(
    res,
    "Your return request has been submitted successfully.",
    returnRequest,
    201
  );
});

// GET ALL USER RETURN REQUESTS
const getReturnRequests = asyncHandler(async (req, res) => {
  const { error, value } = getReturnRequestsQuerySchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Please login to view your return requests.");
  }

const returnRequests =
  await userReturnRequestService.getReturnRequests(userId);

  return ResponseHelper.success(
    res,
    "Return requests fetched successfully.",
    returnRequests
  );
});

// GET RETURN REQUEST BY UUID
const getReturnRequestByUuid = asyncHandler(async (req, res) => {
  const { error, value } = returnRequestUuidSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Please login to view this return request.");
  }

  const returnRequest = await userReturnRequestService.getReturnRequest(
    value.uuid,
    userId
  );

  return ResponseHelper.success(
    res,
    "Return request fetched successfully.",
    returnRequest
  );
});

// GET RETURN REQUEST BY ORDER UUID
const getReturnRequestByOrder = asyncHandler(async (req, res) => {
  const { error, value } = returnRequestOrderUuidSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Please login to view this return request.");
  }

  const returnRequest =
    await userReturnRequestService.getReturnRequestByOrder(
      value.orderUuid,
      userId
    );

  return ResponseHelper.success(
    res,
    "Order return request fetched successfully.",
    returnRequest
  );
});

// CANCEL RETURN REQUEST
const cancelReturnRequest = asyncHandler(async (req, res) => {
  const { error, value } = returnRequestUuidSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Please login to cancel this return request.");
  }

  const returnRequest = await userReturnRequestService.cancelReturnRequest(
    value.uuid,
    userId
  );

  return ResponseHelper.success(
    res,
    "Return request cancelled successfully.",
    returnRequest
  );
});

module.exports = {
  createReturnRequest,
  getReturnRequests,
  getReturnRequestByUuid,
  getReturnRequestByOrder,
  cancelReturnRequest,
};
