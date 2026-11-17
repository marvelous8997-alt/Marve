
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminReturnRequestService } = require("../../services");

const {
  getReturnRequestsSchema,
  getReturnRequestSchema,
  approveReturnRequestSchema,
  rejectReturnRequestSchema,
  refreshReturnTrackingSchema,
} = require("../../validations/admin/returnRequest.validation");

/* =========================================================
   VALIDATION HELPER
========================================================= */

const validateRequest = (res, schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );

    return null;
  }

  return value;
};

/* =========================================================
   GET RETURN REQUEST LIST
========================================================= */

const getReturnRequests = asyncHandler(async (req, res) => {
  const query = validateRequest(
    res,
    getReturnRequestsSchema,
    req.query
  );

  if (!query) return;

  const result = await adminReturnRequestService.getReturnRequests({
    page: query.page,
    limit: query.limit,
    search: query.search,
    returnNumber: query.returnNumber,
    orderNumber: query.orderNumber,
    customer: query.customer,
    email: query.email,
    phone: query.phone,
    status: query.status,
    reason: query.reason,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return ResponseHelper.success(
    res,
    "Return requests fetched successfully.",
    result
  );
});

/* =========================================================
   GET RETURN REQUEST DETAILS
========================================================= */

const getReturnRequest = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getReturnRequestSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const returnRequest =
    await adminReturnRequestService.getReturnRequestDetails(
      params.identifier
    );

  return ResponseHelper.success(
    res,
    "Return request details fetched successfully.",
    returnRequest
  );
});

/* =========================================================
   APPROVE RETURN REQUEST
========================================================= */

const approveReturnRequest = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getReturnRequestSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    approveReturnRequestSchema,
    req.body
  );

  if (!body) return;

  const returnRequest =
    await adminReturnRequestService.approveReturnRequest(
      params.identifier,
      {
        adminNote: body.adminNote,
      },
      req.user?.id
    );

  return ResponseHelper.success(
    res,
    "Return request approved successfully.",
    returnRequest
  );
});

/* =========================================================
   REJECT RETURN REQUEST
========================================================= */

const rejectReturnRequest = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getReturnRequestSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    rejectReturnRequestSchema,
    req.body
  );

  if (!body) return;

  const returnRequest =
    await adminReturnRequestService.rejectReturnRequest(
      params.identifier,
      {
        rejectionReason: body.rejectionReason,
        adminNote: body.adminNote,
      },
      req.user?.id
    );

  return ResponseHelper.success(
    res,
    "Return request rejected successfully.",
    returnRequest
  );
});

/* =========================================================
   RETRY RETURN PICKUP
========================================================= */

const retryReturnPickup = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getReturnRequestSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const returnRequest =
    await adminReturnRequestService.retryReturnPickup(
      params.identifier,
      req.user?.id
    );

  return ResponseHelper.success(
    res,
    "Return pickup retry processed successfully.",
    returnRequest
  );
});

/* =========================================================
   REFRESH RETURN TRACKING
========================================================= */

const refreshReturnTracking = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getReturnRequestSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    refreshReturnTrackingSchema,
    req.body || {}
  );

  if (!body) return;

  const returnRequest =
    await adminReturnRequestService.refreshReturnTracking(
      params.identifier
    );

  return ResponseHelper.success(
    res,
    "Return tracking refreshed successfully.",
    returnRequest
  );
});

/* =========================================================
   GET RETURN REQUEST STATUS COUNTS
========================================================= */

const getReturnStatusCounts = asyncHandler(async (req, res) => {
  const result =
    await adminReturnRequestService.getReturnStatusCounts();

  return ResponseHelper.success(
    res,
    "Return request status counts fetched successfully.",
    result
  );
});

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getReturnRequests,
  getReturnRequest,
  approveReturnRequest,
  rejectReturnRequest,
  retryReturnPickup,
  refreshReturnTracking,
  getReturnStatusCounts,
};
