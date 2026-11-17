
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminCustomerService } = require("../../services");

const {
  getCustomersSchema,
  getCustomerSchema,
  updateCustomerStatusSchema,
} = require("../../validations/admin/customer.validation");

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
   GET CUSTOMER LIST
========================================================= */

const getCustomers = asyncHandler(async (req, res) => {
  const query = validateRequest(
    res,
    getCustomersSchema,
    req.query
  );

  if (!query) return;

  const result = await adminCustomerService.getCustomers({
    page: query.page,
    limit: query.limit,
    search: query.search,
    status: query.status,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return ResponseHelper.success(
    res,
    "Customers fetched successfully.",
    result
  );
});

/* =========================================================
   GET CUSTOMER DETAILS
========================================================= */

const getCustomer = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getCustomerSchema,
    {
      identifier: req.params.id || req.params.identifier,
    }
  );

  if (!params) return;

  const customer = await adminCustomerService.getCustomer(
    params.identifier
  );

  return ResponseHelper.success(
    res,
    "Customer details fetched successfully.",
    customer
  );
});

/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

const updateCustomerStatus = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getCustomerSchema,
    {
      identifier: req.params.id || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    updateCustomerStatusSchema,
    req.body
  );

  if (!body) return;

  const customer =
    await adminCustomerService.updateCustomerStatus(
      params.identifier,
      body.status
    );

  return ResponseHelper.success(
    res,
    "Customer status updated successfully.",
    customer
  );
});

/* =========================================================
   GET CUSTOMER STATUS COUNTS
========================================================= */

const getCustomerStatusCounts = asyncHandler(async (req, res) => {
  const result =
    await adminCustomerService.getCustomerStatusCounts();

  return ResponseHelper.success(
    res,
    "Customer status counts fetched successfully.",
    result
  );
});

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomerStatus,
  getCustomerStatusCounts,
};
