
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userShipmentService } = require("../../services");

const {
  shipmentOrderIdSchema,
  shipmentIdSchema,
  shipmentUuidSchema,
  trackingNumberSchema,
} = require("../../validations/user/shipment.validation");

// =====================================================
// GET SHIPMENTS BY ORDER ID
// =====================================================

const getShipmentsByOrderId = asyncHandler(async (req, res) => {
  const { error, value } = shipmentOrderIdSchema.validate(
    req.params,
    {
      abortEarly: false,
      convert: true,
      stripUnknown: false,
    }
  );

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to view your shipments."
    );
  }

  const shipments =
    await userShipmentService.getShipmentsByOrderId(
      value.orderId,
      userId
    );

  return ResponseHelper.success(
    res,
    "Shipments fetched successfully.",
    shipments
  );
});

// =====================================================
// GET SHIPMENT BY ID
// =====================================================

const getShipmentById = asyncHandler(async (req, res) => {
  const { error, value } = shipmentIdSchema.validate(
    req.params,
    {
      abortEarly: false,
      convert: true,
      stripUnknown: false,
    }
  );

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to view your shipment."
    );
  }

  const shipment = await userShipmentService.getShipmentById(
    value.id,
    userId
  );

  return ResponseHelper.success(
    res,
    "Shipment fetched successfully.",
    shipment
  );
});

// =====================================================
// GET SHIPMENT BY UUID
// =====================================================

const getShipmentByUuid = asyncHandler(async (req, res) => {
  const { error, value } = shipmentUuidSchema.validate(
    req.params,
    {
      abortEarly: false,
      convert: true,
      stripUnknown: false,
    }
  );

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to view your shipment."
    );
  }

  const shipment = await userShipmentService.getShipmentByUuid(
    value.uuid,
    userId
  );

  return ResponseHelper.success(
    res,
    "Shipment fetched successfully.",
    shipment
  );
});

// =====================================================
// GET SHIPMENT TRACKING HISTORY
// =====================================================

const getShipmentTrackingHistory = asyncHandler(
  async (req, res) => {
    const { error, value } = shipmentIdSchema.validate(
      req.params,
      {
        abortEarly: false,
        convert: true,
        stripUnknown: false,
      }
    );

    if (error) {
      throw new ApiError(
        400,
        error.details.map((detail) => detail.message).join(" ")
      );
    }

    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(
        401,
        "Please log in to view shipment tracking."
      );
    }

    const trackingHistory =
      await userShipmentService.getShipmentTrackingHistory(
        value.id,
        userId
      );

    return ResponseHelper.success(
      res,
      "Shipment tracking history fetched successfully.",
      trackingHistory
    );
  }
);

// =====================================================
// GET LATEST SHIPMENT TRACKING
// =====================================================

const getLatestShipmentTracking = asyncHandler(
  async (req, res) => {
    const { error, value } = shipmentIdSchema.validate(
      req.params,
      {
        abortEarly: false,
        convert: true,
        stripUnknown: false,
      }
    );

    if (error) {
      throw new ApiError(
        400,
        error.details.map((detail) => detail.message).join(" ")
      );
    }

    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(
        401,
        "Please log in to view shipment tracking."
      );
    }

    const tracking =
      await userShipmentService.getLatestShipmentTracking(
        value.id,
        userId
      );

    return ResponseHelper.success(
      res,
      "Latest shipment tracking fetched successfully.",
      tracking
    );
  }
);

// =====================================================
// GET SHIPMENT BY TRACKING NUMBER
// =====================================================

const getShipmentByTrackingNumber = asyncHandler(
  async (req, res) => {
    const { error, value } = trackingNumberSchema.validate(
      req.params,
      {
        abortEarly: false,
        convert: true,
        stripUnknown: false,
      }
    );

    if (error) {
      throw new ApiError(
        400,
        error.details.map((detail) => detail.message).join(" ")
      );
    }

    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(
        401,
        "Please log in to track your shipment."
      );
    }

    const shipment =
      await userShipmentService.getShipmentByTrackingNumber(
        value.trackingNumber,
        userId
      );

    return ResponseHelper.success(
      res,
      "Shipment fetched successfully.",
      shipment
    );
  }
);

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getShipmentsByOrderId,
  getShipmentById,
  getShipmentByUuid,
  getShipmentTrackingHistory,
  getLatestShipmentTracking,
  getShipmentByTrackingNumber,
};
