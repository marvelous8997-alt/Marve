
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userReturnShipmentService } = require("../../services");

const {
  returnShipmentOrderUuidSchema,
  returnShipmentIdSchema,
  returnShipmentUuidSchema,
  returnShipmentTrackingNumberSchema,
} = require("../../validations/user/returnShipment.validation");

// =====================================================
// GET RETURN SHIPMENTS BY ORDER UUID
// =====================================================

const getReturnShipmentsByOrderUuid = asyncHandler(
  async (req, res) => {
    const { error, value } =
      returnShipmentOrderUuidSchema.validate(req.params, {
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
      throw new ApiError(
        401,
        "Please log in to view your return shipments."
      );
    }

    const shipments =
      await userReturnShipmentService.getReturnShipmentsByOrderUuid(
        value.orderUuid,
        userId
      );

    return ResponseHelper.success(
      res,
      "Return shipments fetched successfully.",
      shipments
    );
  }
);

// =====================================================
// GET RETURN SHIPMENT BY ID
// =====================================================

const getReturnShipmentById = asyncHandler(async (req, res) => {
  const { error, value } = returnShipmentIdSchema.validate(
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
      "Please log in to view your return shipment."
    );
  }

  const shipment =
    await userReturnShipmentService.getReturnShipmentById(
      value.id,
      userId
    );

  return ResponseHelper.success(
    res,
    "Return shipment fetched successfully.",
    shipment
  );
});

// =====================================================
// GET RETURN SHIPMENT BY UUID
// =====================================================

const getReturnShipmentByUuid = asyncHandler(async (req, res) => {
  const { error, value } = returnShipmentUuidSchema.validate(
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
      "Please log in to view your return shipment."
    );
  }

  const shipment =
    await userReturnShipmentService.getReturnShipmentByUuid(
      value.uuid,
      userId
    );

  return ResponseHelper.success(
    res,
    "Return shipment fetched successfully.",
    shipment
  );
});

// =====================================================
// GET RETURN SHIPMENT TRACKING HISTORY
// =====================================================

const getReturnShipmentTrackingHistory = asyncHandler(
  async (req, res) => {
    const { error, value } =
      returnShipmentIdSchema.validate(req.params, {
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
      throw new ApiError(
        401,
        "Please log in to view return shipment tracking."
      );
    }

    const trackingHistory =
      await userReturnShipmentService.getReturnShipmentTrackingHistory(
        value.id,
        userId
      );

    return ResponseHelper.success(
      res,
      "Return shipment tracking history fetched successfully.",
      trackingHistory
    );
  }
);

// =====================================================
// GET LATEST RETURN SHIPMENT TRACKING
// =====================================================

const getLatestReturnShipmentTracking = asyncHandler(
  async (req, res) => {
    const { error, value } =
      returnShipmentIdSchema.validate(req.params, {
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
      throw new ApiError(
        401,
        "Please log in to view return shipment tracking."
      );
    }

    const tracking =
      await userReturnShipmentService.getLatestReturnShipmentTracking(
        value.id,
        userId
      );

    return ResponseHelper.success(
      res,
      "Latest return shipment tracking fetched successfully.",
      tracking
    );
  }
);

// =====================================================
// GET RETURN SHIPMENT BY TRACKING NUMBER
// =====================================================

const getReturnShipmentByTrackingNumber = asyncHandler(
  async (req, res) => {
    const { error, value } =
      returnShipmentTrackingNumberSchema.validate(req.params, {
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
      throw new ApiError(
        401,
        "Please log in to track your return shipment."
      );
    }

    const shipment =
      await userReturnShipmentService.getReturnShipmentByTrackingNumber(
        value.trackingNumber,
        userId
      );

    return ResponseHelper.success(
      res,
      "Return shipment fetched successfully.",
      shipment
    );
  }
);

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getReturnShipmentsByOrderUuid,
  getReturnShipmentById,
  getReturnShipmentByUuid,
  getReturnShipmentTrackingHistory,
  getLatestReturnShipmentTracking,
  getReturnShipmentByTrackingNumber,
};
