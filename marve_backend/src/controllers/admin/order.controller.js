
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminOrderService } = require("../../services");

const {
  getOrdersSchema,
  getOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} = require("../../validations/admin/order.validation");

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
   GET ORDER LIST
========================================================= */

const getOrders = asyncHandler(async (req, res) => {
  const query = validateRequest(
    res,
    getOrdersSchema,
    req.query
  );

  if (!query) return;

  const result = await adminOrderService.getOrders({
    page: query.page,
    limit: query.limit,
    search: query.search,
    orderNumber: query.orderNumber,
    customer: query.customer,
    phone: query.phone,
    product: query.product,
    orderStatus: query.orderStatus,
    paymentStatus: query.paymentStatus,
    paymentMethod: query.paymentMethod,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return ResponseHelper.success(
    res,
    "Orders fetched successfully.",
    result
  );
});

/* =========================================================
   GET ORDER DETAILS
========================================================= */

const getOrder = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getOrderSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const order = await adminOrderService.getOrder(
    params.identifier
  );

  return ResponseHelper.success(
    res,
    "Order details fetched successfully.",
    order
  );
});

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

const updateOrderStatus = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getOrderSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    updateOrderStatusSchema,
    req.body
  );

  if (!body) return;

  const order = await adminOrderService.updateOrderStatus(
    params.identifier,
    body.status,
    req.user?.id
  );

  return ResponseHelper.success(
    res,
    "Order status updated successfully.",
    order
  );
});

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getOrderSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    updatePaymentStatusSchema,
    req.body
  );

  if (!body) return;

  const order = await adminOrderService.updatePaymentStatus(
    params.identifier,
    body.paymentStatus,
    req.user?.id
  );

  return ResponseHelper.success(
    res,
    "Payment status updated successfully.",
    order
  );
});

/* =========================================================
   CANCEL ORDER
========================================================= */

const cancelOrder = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getOrderSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const order = await adminOrderService.cancelOrder(
    params.identifier
  );

  return ResponseHelper.success(
    res,
    "Order cancelled successfully.",
    order
  );
});

module.exports = {
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
};
