
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminShipmentService } = require("../../services");

const {
  getShipmentsSchema,
  getShipmentSchema,
  createShipmentSchema,
  updateShipmentStatusSchema,
} = require("../../validations/admin/shipment.validation");

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
   GET SHIPMENT LIST
========================================================= */

/*
  NOTE:
  Current shipment.service.js does not export getShipments().
  This handler will work after implementing the listing service.
*/

const getShipments = asyncHandler(async (req, res) => {
  if (typeof adminShipmentService.getShipments !== "function") {
    throw new Error("Shipment listing service is not implemented.");
  }

  const query = validateRequest(
    res,
    getShipmentsSchema,
    req.query
  );

  if (!query) return;

  const result = await adminShipmentService.getShipments({
    page: query.page,
    limit: query.limit,
    search: query.search,
    status: query.status,
    courierName: query.courierName,
    orderNumber: query.orderNumber,
    trackingNumber: query.trackingNumber,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return ResponseHelper.success(
    res,
    "Shipments fetched successfully.",
    result
  );
});

/* =========================================================
   GET SHIPMENT DETAILS
========================================================= */

const getShipment = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getShipmentSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const shipment = await adminShipmentService.getShipmentById(
    params.identifier
  );

  return ResponseHelper.success(
    res,
    "Shipment details fetched successfully.",
    shipment
  );
});

/* =========================================================
   CREATE SHIPMENT
========================================================= */

const createShipment = asyncHandler(async (req, res) => {
  const body = validateRequest(
    res,
    createShipmentSchema,
    req.body
  );

  if (!body) return;

const shipment = await adminShipmentService.createShipment(
  body.orderIdentifier,
  {
    courierId: body.courierId,
    notes: body.notes,
    packageDimensions: {
      length: body.length,
      breadth: body.breadth,
      height: body.height,
      weight: body.weight,
    },
  }
);

  return ResponseHelper.success(
    res,
    "Shipment created successfully.",
    shipment
  );
});

/* =========================================================
   GET SHIPMENT TRACKING HISTORY
========================================================= */

const getShipmentTrackingHistory = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getShipmentSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const trackingHistory =
    await adminShipmentService.getShipmentTrackingHistory(
      params.identifier
    );

  return ResponseHelper.success(
    res,
    "Shipment tracking history fetched successfully.",
    trackingHistory
  );
});

/* =========================================================
   GET LATEST SHIPMENT TRACKING
========================================================= */

const getLatestShipmentTracking = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getShipmentSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const tracking =
    await adminShipmentService.getLatestShipmentTracking(
      params.identifier
    );

  return ResponseHelper.success(
    res,
    "Latest shipment tracking fetched successfully.",
    tracking
  );
});


/* =========================================================
   SYNC SHIPMENT TRACKING
========================================================= */

const syncShipmentTracking = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getShipmentSchema,
    {
      identifier: req.params.identifier,
    }
  );

  if (!params) return;

  const result = await adminShipmentService.syncShipmentTracking(
    params.identifier
  );

  return ResponseHelper.success(
    res,
    "Shipment tracking synced successfully.",
    result
  );
});


/* =========================================================
   UPDATE SHIPMENT STATUS
========================================================= */

const updateShipmentStatus = asyncHandler(async (req, res) => {
  const params = validateRequest(
    res,
    getShipmentSchema,
    {
      identifier: req.params.uuid || req.params.identifier,
    }
  );

  if (!params) return;

  const body = validateRequest(
    res,
    updateShipmentStatusSchema,
    req.body
  );

  if (!body) return;

  const shipment = await adminShipmentService.updateShipmentStatus(
    params.identifier,
    body.status,
    {
      description: body.description,
      location: body.location,
      eventAt: body.eventAt,
      source: body.source,
    }
  );

  return ResponseHelper.success(
    res,
    "Shipment status updated successfully.",
    shipment
  );
});

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getShipments,
  getShipment,
  createShipment,
  getShipmentTrackingHistory,
  getLatestShipmentTracking,
  updateShipmentStatus,
  syncShipmentTracking, // NEW
};