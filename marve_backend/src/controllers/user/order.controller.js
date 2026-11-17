"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userOrderService } = require("../../services");

const {
  createOrderSchema,
  orderIdSchema,
  getOrdersQuerySchema,
} = require("../../validations/user/order.validation");

// CREATE ORDER
const createOrder = asyncHandler(async (req, res) => {
const { error, value } = createOrderSchema.validate(req.body, {
  abortEarly: false,
  convert: true,
  stripUnknown: false,
});

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  // Logged-in user's ID comes from authentication middleware.
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Please log in to place your order.");
  }

  const result = await userOrderService.createOrder(userId, value);

  return ResponseHelper.success(
    res,
    result.message || "Order created successfully.",
    result.order,
    201
  );
});

// GET ALL ORDERS FOR LOGGED-IN USER
const getOrders = asyncHandler(async (req, res) => {
  const { error, value } = getOrdersQuerySchema.validate(req.query, {
    abortEarly: false,
    convert: true,
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
    throw new ApiError(401, "Please log in to view your orders.");
  }

  const orders = await userOrderService.getOrdersByUserId(userId, value);

  return ResponseHelper.success(
    res,
    "Orders fetched successfully.",
    orders
  );
});

// GET ORDER BY ID
const getOrderById = asyncHandler(async (req, res) => {
  const { error, value } = orderIdSchema.validate(req.params, {
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
    throw new ApiError(401, "Please log in to view your order.");
  }

  const order = await userOrderService.getOrderById(value.id, userId);

  return ResponseHelper.success(
    res,
    "Order fetched successfully.",
    order
  );
});

// CANCEL ORDER
const cancelOrder = asyncHandler(async (req, res) => {
  const { error, value } = orderIdSchema.validate(req.params, {
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
    throw new ApiError(401, "Please log in to cancel your order.");
  }

  const result = await userOrderService.cancelOrder(
    value.id,
    userId
  );

  return ResponseHelper.success(
    res,
    result.message || "Order cancelled successfully.",
    result.order
  );
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
};