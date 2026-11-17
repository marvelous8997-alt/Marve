"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminPaymentService } = require("../../services");

const {
  getPaymentsSchema,
  getPaymentSchema,
  refundPaymentSchema,
} = require("../../validations/admin/payment.validation");

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
   GET PAYMENT LIST
========================================================= */

const getPayments = asyncHandler(async (req, res) => {
  const query = validateRequest(
    res,
    getPaymentsSchema,
    req.query
  );

  if (!query) return;

  const result = await adminPaymentService.getPayments({
    page: query.page,
    limit: query.limit,
    search: query.search,
    status: query.status,
    method: query.method,
    provider: query.provider,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return ResponseHelper.success(
    res,
    "Payments fetched successfully.",
    result
  );
});

/* =========================================================
   GET PAYMENT DETAILS
========================================================= */

const getPayment = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getPaymentSchema,
    {
      identifier:
        req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const payment = await adminPaymentService.getPayment(
    params.identifier
  );

  return ResponseHelper.success(
    res,
    "Payment details fetched successfully.",
    payment
  );
});

/* =========================================================
   GET PAYMENT SUMMARY
========================================================= */

const getPaymentSummary = asyncHandler(async (req, res) => {
  const summary =
    await adminPaymentService.getPaymentSummary();

  return ResponseHelper.success(
    res,
    "Payment summary fetched successfully.",
    summary
  );
});

/* =========================================================
   GET PAYMENT STATUS COUNTS
========================================================= */

const getPaymentStatusCounts = asyncHandler(
  async (req, res) => {
    const counts =
      await adminPaymentService.getPaymentStatusCounts();

    return ResponseHelper.success(
      res,
      "Payment status counts fetched successfully.",
      counts
    );
  }
);

/* =========================================================
   REFUND PAYMENT
========================================================= */

const refundPayment = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getPaymentSchema,
    {
      identifier:
        req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    refundPaymentSchema,
    req.body
  );

  if (!body) return;

  const result = await adminPaymentService.refundPayment(
    params.identifier,
    {
      amount: body.amount,
      reason: body.reason,
      adminId: req.user?.id,
    }
  );

  return ResponseHelper.success(
    res,
    "Payment refund processed successfully.",
    result
  );
});

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getPayments,
  getPayment,
  getPaymentSummary,
  getPaymentStatusCounts,
  refundPayment,
};
