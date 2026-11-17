
"use strict";

const { adminReturnRequestRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

const {
  sequelize,
  Order,
  ReturnShipment,
  ReturnRefund,
  Payment,
} = require("../../database/models");

const shiprocketConfig = require("../../database/config/shiprocket.config");

const {
  createShiprocketReturnOrder,
  assignShiprocketReturnAwb,
  scheduleShiprocketReturnPickup,
  getShiprocketReturnTracking,
  shiprocketRequest,
} = require("../../helpers/shiprocket.helper");
/* =========================================================
   CONSTANTS
========================================================= */

const RETURN_REQUEST_STATUSES =
  adminReturnRequestRepository.RETURN_REQUEST_STATUSES;

const RETURN_REASONS = [
  "SIZE_TOO_SMALL",
  "SIZE_TOO_LARGE",
  "PRODUCT_DAMAGED",
  "WRONG_PRODUCT",
  "PRODUCT_NOT_AS_DESCRIBED",
  "QUALITY_ISSUE",
  "OTHER",
];

const ALLOWED_SORT_FIELDS = [
  "returnNumber",
  "status",
  "reason",
  "refundAmount",
  "requestedAt",
  "approvedAt",
  "rejectedAt",
  "createdAt",
  "updatedAt",
];

const MAX_PAGE_SIZE = 100;

/* =========================================================
   HELPERS
========================================================= */

const normalizeIdentifier = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const normalizeOptionalText = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
};

const validateUuid = (uuid) => {
  const normalizedUuid = normalizeIdentifier(uuid);

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!normalizedUuid || !uuidRegex.test(normalizedUuid)) {
    throw new ApiError(400, "Invalid return request UUID.");
  }

  return normalizedUuid;
};

const validateDate = (value, fieldName) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, `Invalid ${fieldName} date.`);
  }

  return date;
};

/* =========================================================
   VALIDATE LIST QUERY
========================================================= */

const validateListQuery = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);

  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  );

  const status = normalizeIdentifier(query.status).toUpperCase();
  const reason = normalizeIdentifier(query.reason).toUpperCase();

  const sortBy = normalizeIdentifier(query.sortBy) || "requestedAt";

  const sortOrder =
    normalizeIdentifier(query.sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  if (status && !RETURN_REQUEST_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid return request status.");
  }

  if (reason && !RETURN_REASONS.includes(reason)) {
    throw new ApiError(400, "Invalid return reason.");
  }

  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    throw new ApiError(400, "Invalid sort field.");
  }

  const dateFrom = validateDate(query.dateFrom, "start");
  const dateTo = validateDate(query.dateTo, "end");

  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new ApiError(
      400,
      "Start date cannot be greater than end date."
    );
  }

  return {
    page,
    limit,
    search: normalizeIdentifier(query.search),
    returnNumber: normalizeIdentifier(query.returnNumber),
    orderNumber: normalizeIdentifier(query.orderNumber),
    customer: normalizeIdentifier(query.customer),
    email: normalizeIdentifier(query.email),
    phone: normalizeIdentifier(query.phone),
    status: status || undefined,
    reason: reason || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sortBy,
    sortOrder,
  };
};

/* =========================================================
   CREATE / PROCESS RETURN PICKUP
========================================================= */

const createReturnPickup = async (returnRequestUuid) => {
  let shipment = null;

  try {
    const returnRequest =
      await adminReturnRequestRepository.getReturnRequestDetailsByUuid(
        returnRequestUuid
      );

    if (!returnRequest) {
      throw new ApiError(404, "Return request not found.");
    }

    if (
      ![
        "APPROVED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
      ].includes(returnRequest.status)
    ) {
      throw new ApiError(
        409,
        "Return request is not approved for reverse pickup."
      );
    }

    shipment =
      await adminReturnRequestRepository.getReturnShipmentByReturnRequestId(
        returnRequest.id
      );

    if (!shipment) {
      throw new ApiError(
        404,
        "Local return shipment record not found."
      );
    }

    if (
      shipment.status === "PICKUP_SCHEDULED" ||
      shipment.status === "PICKED_UP" ||
      shipment.status === "IN_TRANSIT" ||
      shipment.status === "OUT_FOR_DELIVERY" ||
      shipment.status === "DELIVERED"
    ) {
      return shipment;
    }

    // STEP 1: Create Shiprocket return order.
    if (!shipment.shiprocketShipmentId) {
      const returnPayload =
        await buildReturnOrderPayload(returnRequest);

      const response =
        await createShiprocketReturnOrder(returnPayload);

      const shiprocketDetails =
        extractReturnOrderResponse(response);

      await adminReturnRequestRepository.updateReturnShipment(
        shipment,
        {
          ...shiprocketDetails,
          rawPayload: {
            returnOrderRequest: returnPayload,
            returnOrderResponse: response,
          },
          notes: "Shiprocket return order created.",
        }
      );

      shipment =
        await adminReturnRequestRepository.getReturnShipmentById(
          shipment.id
        );
    }

    // STEP 2: Assign return AWB.
    if (!shipment.awbNumber) {
      const awbResponse =
        await assignShiprocketReturnAwb({
          shipmentId: shipment.shiprocketShipmentId,
        });

      const awbDetails =
        extractReturnAwbResponse(awbResponse);

      await adminReturnRequestRepository.updateReturnShipment(
        shipment,
        {
          ...awbDetails,
          rawPayload: {
            ...(shipment.rawPayload || {}),
            awbResponse,
          },
          notes: "Return AWB assigned successfully.",
        }
      );

      shipment =
        await adminReturnRequestRepository.getReturnShipmentById(
          shipment.id
        );
    }

    // STEP 3: Schedule reverse pickup.
    const pickupResponse =
      await scheduleShiprocketReturnPickup({
        shipmentId: shipment.shiprocketShipmentId,
      });

    const pickupSuccessful =
      Number(pickupResponse?.pickup_status) === 1 ||
      Number(pickupResponse?.response?.data?.status) === 3;

    if (!pickupSuccessful) {
      throw new ApiError(
        502,
        "Shiprocket return pickup could not be confirmed."
      );
    }

    const pickupScheduledAt =
      pickupResponse?.response?.data?.pickup_scheduled_date
        ? new Date(
            pickupResponse.response.data.pickup_scheduled_date
          )
        : new Date();

    await sequelize.transaction(async (transaction) => {
      await adminReturnRequestRepository.updateReturnShipment(
        shipment,
        {
          status: "PICKUP_SCHEDULED",
          pickupScheduledAt,
          rawPayload: {
            ...(shipment.rawPayload || {}),
            pickupResponse,
          },
          notes: "Reverse pickup scheduled successfully.",
        },
        { transaction }
      );

      const lockedRequest =
        await adminReturnRequestRepository.getReturnRequestByUuidForUpdate(
          returnRequestUuid,
          transaction
        );

      if (
        lockedRequest &&
        lockedRequest.status === "APPROVED"
      ) {
        await adminReturnRequestRepository.updateReturnRequestStatus(
          lockedRequest,
          "PICKUP_SCHEDULED",
          {},
          { transaction }
        );
      }
    });

    logger.info(
      `Shiprocket reverse pickup scheduled: ${returnRequestUuid}`
    );

    return adminReturnRequestRepository.getReturnShipmentById(
      shipment.id
    );
  } catch (error) {
    if (shipment) {
      try {
        await adminReturnRequestRepository.updateReturnShipment(
          shipment,
          {
            status: "PICKUP_FAILED",
            notes: error.message,
          }
        );
      } catch (updateError) {
        logger.error(
          `Failed to update return shipment after Shiprocket error: ${updateError.message}`
        );
      }
    }

    logger.error(
      `Shiprocket return pickup error: ${error.message}`
    );

    throw error;
  }
};
/* =========================================================
   SERIALIZE RETURN REQUEST
========================================================= */

const serializeReturnRequest = (returnRequest) => {
  if (!returnRequest) {
    return null;
  }

  const data =
    typeof returnRequest.toJSON === "function"
      ? returnRequest.toJSON()
      : returnRequest;

  return data;
};

/* =========================================================
   SHIPROCKET RETURN HELPERS
========================================================= */

// Normalize number.
const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// Convert dimensions to CM.
const convertToCm = (value, unit = "cm") => {
  const number = toNumber(value);

  switch (String(unit).toLowerCase()) {
    case "mm":
      return number / 10;

    case "m":
      return number * 100;

    case "in":
    case "inch":
    case "inches":
      return number * 2.54;

    default:
      return number;
  }
};

// Convert weight to KG.
const convertToKg = (value, unit = "kg") => {
  const number = toNumber(value);

  switch (String(unit).toLowerCase()) {
    case "g":
    case "gram":
    case "grams":
      return number / 1000;

    case "lb":
    case "lbs":
      return number * 0.453592;

    default:
      return number;
  }
};

// Split customer name.
const splitFullName = (fullName) => {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    firstName: parts.shift() || "",
    lastName: parts.join(" "),
  };
};

// Fetch registered MARVE warehouse from Shiprocket.
const getShiprocketReturnWarehouse = async () => {
  const pickupLocation = normalizeIdentifier(
    shiprocketConfig.pickupLocation
  );

  if (!pickupLocation) {
    throw new ApiError(
      500,
      "Shiprocket pickup location is not configured."
    );
  }

  const response = await shiprocketRequest({
    method: "GET",
    url: "/settings/company/pickup",
  });

  const locations =
    response?.data?.shipping_address ||
    response?.shipping_address ||
    [];

  const warehouse = locations.find(
    (location) =>
      String(location.pickup_location || "")
        .trim()
        .toLowerCase() === pickupLocation.toLowerCase()
  );

  if (!warehouse) {
    throw new ApiError(
      400,
      `Shiprocket warehouse "${pickupLocation}" was not found.`
    );
  }

  const requiredFields = [
    "name",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "pin_code",
  ];

  for (const field of requiredFields) {
    if (!warehouse[field]) {
      throw new ApiError(
        400,
        `Shiprocket warehouse is missing required field: ${field}.`
      );
    }
  }

  return warehouse;
};

// Build package dimensions from returned products.
const calculateReturnPackage = (items) => {
  let length = 0;
  let breadth = 0;
  let height = 0;
  let weight = 0;

  for (const item of items) {
    const orderItem = item.orderItem;
    const product = orderItem?.product;

    if (!orderItem || !product) {
      throw new ApiError(
        400,
        "Product details are missing for a return item."
      );
    }

    const quantity = Number(item.quantity);

    const productLength = convertToCm(
      product.length,
      product.dimension_unit
    );

    const productWidth = convertToCm(
      product.width,
      product.dimension_unit
    );

    const productHeight = convertToCm(
      product.height,
      product.dimension_unit
    );

    const productWeight = convertToKg(
      product.weight,
      product.weight_unit
    );

    if (
      productLength <= 0 ||
      productWidth <= 0 ||
      productHeight <= 0 ||
      productWeight <= 0 ||
      quantity <= 0
    ) {
      throw new ApiError(
        400,
        `Valid dimensions and weight are required for ${orderItem.productName}.`
      );
    }

    length = Math.max(length, productLength);
    breadth = Math.max(breadth, productWidth);

    // Assume items are packed vertically.
    height += productHeight * quantity;

    weight += productWeight * quantity;
  }

  return {
    length: Number(length.toFixed(2)),
    breadth: Number(breadth.toFixed(2)),
    height: Number(height.toFixed(2)),
    weight: Number(weight.toFixed(3)),
  };
};

// Build Shiprocket return order payload.
const buildReturnOrderPayload = async (returnRequest) => {
  const order = returnRequest.order;
  const items = returnRequest.items || [];
  const user = returnRequest.user;

  if (!order) {
    throw new ApiError(
      400,
      "Original order details are missing."
    );
  }

  if (!items.length) {
    throw new ApiError(
      400,
      "Return request does not contain any items."
    );
  }

  // Customer pickup address comes from original order snapshot.
  const customerName = normalizeIdentifier(
    order.deliveryFullName
  );

  const customerPhone =
    order.deliveryPhone || user?.phone;

  const customerEmail =
    order.deliveryEmail || user?.email;

  const customerAddress = [
    order.deliveryHouseNumber,
    order.deliveryAddress,
  ]
    .filter(Boolean)
    .join(", ");

  const customerAddress2 = [
    order.deliveryLocality,
    order.deliveryLandmark,
  ]
    .filter(Boolean)
    .join(", ");

  if (
    !customerName ||
    !customerPhone ||
    !customerEmail ||
    !customerAddress ||
    !order.deliveryCity ||
    !order.deliveryState ||
    !order.deliveryPincode
  ) {
    throw new ApiError(
      400,
      "Original customer delivery address is incomplete."
    );
  }

  const customer = splitFullName(customerName);

  // Fetch MARVE warehouse from Shiprocket.
  const warehouse = await getShiprocketReturnWarehouse();

  const warehouseName = splitFullName(warehouse.name);

  // Return items.
  const orderItems = items.map((item) => {
    const orderItem = item.orderItem;

    if (!orderItem) {
      throw new ApiError(
        400,
        "Original order item details are missing."
      );
    }

    const product = orderItem.product;
    const variation = orderItem.variation;

    const sku =
      orderItem.variationSku ||
      orderItem.productSku ||
      variation?.sku ||
      product?.sku;

    if (!sku) {
      throw new ApiError(
        400,
        `SKU is missing for ${orderItem.productName}.`
      );
    }

    return {
      name: [
        orderItem.productName,
        orderItem.variationName,
      ]
        .filter(Boolean)
        .join(" - "),

      sku,
      units: Number(item.quantity),
      selling_price: Number(item.unitPrice),
      discount: 0,
    };
  });

  const packageDetails = calculateReturnPackage(items);

  const subTotal = orderItems.reduce(
    (total, item) =>
      total + item.units * item.selling_price,
    0
  );

  if (subTotal < 0 || !Number.isFinite(subTotal)) {
    throw new ApiError(
      400,
      "Invalid return order subtotal."
    );
  }

  const pincode = Number(
    order.deliveryPincode
  );

  const warehousePincode = Number(
    warehouse.pin_code
  );

  if (
    !Number.isInteger(pincode) ||
    !Number.isInteger(warehousePincode)
  ) {
    throw new ApiError(
      400,
      "Invalid customer or warehouse pincode."
    );
  }

  return {
    order_id: String(returnRequest.returnNumber).slice(0, 50),

    order_date: new Date(
      order.placedAt || order.createdAt
    )
      .toISOString()
      .slice(0, 10),

    // Customer = pickup address.
    pickup_customer_name: customer.firstName,
    pickup_last_name: customer.lastName,
    pickup_address: customerAddress,
    pickup_address_2: customerAddress2,
    pickup_city: order.deliveryCity,
    pickup_state: order.deliveryState,
    pickup_country:
      order.deliveryPincodeCountry || "India",
    pickup_pincode: pincode,
    pickup_email: customerEmail,
    pickup_phone: String(customerPhone),
    pickup_isd_code: "91",

    // MARVE warehouse = return destination.
    shipping_customer_name: warehouseName.firstName,
    shipping_last_name: warehouseName.lastName,
    shipping_address: warehouse.address,
    shipping_address_2: warehouse.address_2 || "",
    shipping_city: warehouse.city,
    shipping_state: warehouse.state,
    shipping_country: warehouse.country,
    shipping_pincode: warehousePincode,
    shipping_email: warehouse.email || customerEmail,
    shipping_phone: String(warehouse.phone),
    shipping_isd_code: "91",

    order_items: orderItems,

    payment_method: "PREPAID",
    total_discount: 0,
    sub_total: Number(subTotal.toFixed(2)),

    ...packageDetails,
  };
};

// Extract Shiprocket return order response.
const extractReturnOrderResponse = (response) => {
  const shipmentId = response?.shipment_id;
  const orderId = response?.order_id;

  if (!shipmentId) {
    throw new ApiError(
      502,
      "Shiprocket did not return a valid return shipment ID."
    );
  }

  return {
    shiprocketOrderId: orderId
      ? String(orderId)
      : null,

    shiprocketShipmentId: String(shipmentId),
  };
};

// Extract AWB details.
const extractReturnAwbResponse = (response) => {
  const data =
    response?.response?.data ||
    response?.data ||
    response;

  const awbNumber = data?.awb_code;

  if (!awbNumber) {
    throw new ApiError(
      502,
      "Shiprocket did not return a valid return AWB."
    );
  }

  return {
    awbNumber: String(awbNumber),
    trackingNumber: String(awbNumber),
    courierName: data?.courier_name || null,
    courierCode: data?.courier_company_id
      ? String(data.courier_company_id)
      : null,
  };
};

/* =========================================================
   SHIPROCKET TRACKING HELPERS
========================================================= */

// Normalize Shiprocket status.
const normalizeTrackingStatus = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

// Map Shiprocket status to local ReturnShipment status.
const mapShiprocketShipmentStatus = (status) => {
  const normalizedStatus = normalizeTrackingStatus(status);

  const statusMap = {
    "PICKUP SCHEDULED": "PICKUP_SCHEDULED",
    "PICKUP REQUESTED": "PICKUP_REQUESTED",
    "PICKUP GENERATED": "PICKUP_REQUESTED",
    "PICKUP DONE": "PICKED_UP",
    "PICKED UP": "PICKED_UP",
    "IN TRANSIT": "IN_TRANSIT",
    "OUT FOR DELIVERY": "OUT_FOR_DELIVERY",
    "DELIVERED": "DELIVERED",
    "PICKUP FAILED": "PICKUP_FAILED",
    "CANCELLED": "CANCELLED",
    "CANCELED": "CANCELLED",
    "RTO": "RTO",
    "RETURN TO ORIGIN": "RTO",
  };

  return statusMap[normalizedStatus] || null;
};

// Parse tracking date safely.
const parseTrackingDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

// Extract Shiprocket tracking data.
const extractShiprocketTrackingData = (response) => {
  const trackingData =
    response?.tracking_data ||
    response?.data?.tracking_data ||
    response?.data ||
    response;

  if (!trackingData || typeof trackingData !== "object") {
    throw new ApiError(
      502,
      "Invalid Shiprocket tracking response."
    );
  }

  const shipmentTrack = Array.isArray(
    trackingData.shipment_track
  )
    ? trackingData.shipment_track
    : [];

  const activities = Array.isArray(
    trackingData.shipment_track_activities
  )
    ? trackingData.shipment_track_activities
    : shipmentTrack;

  const currentTracking = shipmentTrack[0] || {};

  const currentStatus =
    trackingData.shipment_status ||
    currentTracking.current_status ||
    currentTracking.status ||
    null;

  return {
    trackingData,
    currentStatus,
    activities,
    currentTracking,
  };
};

// Convert Shiprocket activity into local event data.
const normalizeShiprocketTrackingActivity = (
  activity,
  returnShipmentId,
  fallbackStatus
) => {
  const status =
    activity?.["sr-status-label"] ||
    activity?.status ||
    activity?.current_status ||
    fallbackStatus;

  const description =
    activity?.activity ||
    activity?.description ||
    activity?.status ||
    status;

  const eventAt = parseTrackingDate(
    activity?.date ||
    activity?.event_time ||
    activity?.timestamp
  );

  if (!status || !eventAt) {
    return null;
  }

  const providerEventId =
    activity?.event_id ||
    activity?.id ||
    null;

  return {
    returnShipmentId,
    providerEventId: providerEventId
      ? String(providerEventId)
      : null,
    status: String(status).trim(),
    location: normalizeOptionalText(
      activity?.location
    ),
    description: normalizeOptionalText(
      description
    ),
    eventAt,
    source: "COURIER",
    rawPayload: activity,
  };
};

/* =========================================================
   GET ALL RETURN REQUESTS
========================================================= */

const getReturnRequests = async (query = {}) => {
  try {
    const filters = validateListQuery(query);

    const result =
      await adminReturnRequestRepository.getReturnRequests(filters);

    return {
      count: result.count,
      rows: result.rows.map(serializeReturnRequest),
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  } catch (error) {
    logger.error(
      `Admin get return requests error: ${error.message}`
    );

    throw error;
  }
};

/* =========================================================
   GET RETURN REQUEST DETAILS BY UUID
========================================================= */

const getReturnRequestDetails = async (uuid) => {
  try {
    const normalizedUuid = validateUuid(uuid);

    const returnRequest =
      await adminReturnRequestRepository.getReturnRequestDetailsByUuid(
        normalizedUuid
      );

    if (!returnRequest) {
      throw new ApiError(404, "Return request not found.");
    }

    return serializeReturnRequest(returnRequest);
  } catch (error) {
    logger.error(
      `Admin get return request details error: ${error.message}`
    );

    throw error;
  }
};

const REFUND_DELAY_HOURS = 48;

const createScheduledReturnRefund = async ({
  returnRequestId,
  approvedAt,
  items,
  order,
  transaction,
}) => {
  if (!approvedAt || !Number.isFinite(new Date(approvedAt).getTime())) {
    throw new ApiError(400, "Invalid return approval date.");
  }

  if (!order || !["ONLINE", "COD"].includes(order.paymentMethod)) {
    throw new ApiError(400, "Invalid original order payment method.");
  }

const existingRefund =
  await adminReturnRequestRepository.getReturnRefundByReturnRequestIdForUpdate(
    returnRequestId,
    transaction
  );

  if (existingRefund) {
    throw new ApiError(409, "Refund record already exists.");
  }

const refundAmountPaise = (items || []).reduce(
  (total, item) => {
    const amount = Number(item.refundAmount);

    if (!Number.isFinite(amount) || amount < 0) {
      throw new ApiError(400, "Invalid return item refund amount.");
    }

    return total + Math.round((amount + Number.EPSILON) * 100);
  },
  0
);

  if (!Number.isSafeInteger(refundAmountPaise) || refundAmountPaise <= 0) {
    throw new ApiError(400, "Invalid refund amount.");
  }

  const refundAmount = (refundAmountPaise / 100).toFixed(2);

  const scheduledAt = new Date(
    new Date(approvedAt).getTime() +
      REFUND_DELAY_HOURS * 60 * 60 * 1000
  );

  let payment = null;
  let gateway = "COD";

if (order.paymentMethod === "ONLINE") {
const capturedPayment = (order.payments || []).find(
  (item) =>
    item.provider === "RAZORPAY" &&
    ["CAPTURED", "PARTIALLY_REFUNDED"].includes(item.status) &&
    item.razorpayPaymentId
);

  if (!capturedPayment) {
    throw new ApiError(
      400,
      "Captured Razorpay payment was not found for this order."
    );
  }

  payment =
    await adminReturnRequestRepository.getPaymentByIdForUpdate(
      capturedPayment.id,
      transaction
    );

if (
  !payment ||
  payment.provider !== "RAZORPAY" ||
  !["CAPTURED", "PARTIALLY_REFUNDED"].includes(
    payment.status
  ) ||
  !payment.razorpayPaymentId
) {
    throw new ApiError(
      409,
      "The original captured payment is no longer available for refund."
    );
  }

  if (payment.currency !== (order.currency || "INR")) {
    throw new ApiError(
      400,
      "Payment and order currencies do not match."
    );
  }

  gateway = payment.provider;

  const capturedAmountPaise = Math.round(
    Number(payment.amount) * 100
  );

  const alreadyRefundedPaise = Math.round(
    Number(payment.refundedAmount || 0) * 100
  );

  const reservedAmount =
    await adminReturnRequestRepository
      .getReservedReturnRefundAmountByPaymentId(
        payment.id,
        transaction
      );

  const reservedAmountPaise = Math.round(
    reservedAmount * 100
  );

  if (
    !Number.isSafeInteger(capturedAmountPaise) ||
    !Number.isSafeInteger(alreadyRefundedPaise) ||
    !Number.isSafeInteger(reservedAmountPaise) ||
    alreadyRefundedPaise < 0 ||
    reservedAmountPaise < 0 ||
    alreadyRefundedPaise +
      reservedAmountPaise +
      refundAmountPaise >
      capturedAmountPaise
  ) {
    throw new ApiError(
      400,
      "Refund amount exceeds the remaining captured payment balance."
    );
  }
}

  return adminReturnRequestRepository.createReturnRefund(
    {
      returnRequestId,
      paymentId: payment?.id || null,
      refundNumber: `RFD-${returnRequestId}-${Date.now()}`,
      paymentMethod: order.paymentMethod,
      gateway,
      refundAmount,
      currency: order.currency || "INR",
      status: "PENDING",
      scheduledAt,
      idempotencyKey: `RETURN-REFUND-${returnRequestId}`,
      retryCount: 0,
    },
    { transaction }
  );
};

/* =========================================================
   APPROVE RETURN REQUEST
========================================================= */

const approveReturnRequest = async (uuid, payload = {}) => {
  let transaction;

  try {
    const normalizedUuid = validateUuid(uuid);

    const adminNote = normalizeOptionalText(
      payload.adminNote
    );

    transaction = await sequelize.transaction();

    const returnRequest =
      await adminReturnRequestRepository.getReturnRequestByUuidForUpdate(
        normalizedUuid,
        transaction
      );

    if (!returnRequest) {
      throw new ApiError(
        404,
        "Return request not found."
      );
    }

    if (returnRequest.status !== "REQUESTED") {
      throw new ApiError(
        409,
        `Return request cannot be approved because its current status is ${returnRequest.status}.`
      );
    }

    // Load complete request data inside transaction.
    const requestDetails =
      await adminReturnRequestRepository.getReturnRequestDetailsByUuid(
        normalizedUuid,
        { transaction }
      );

    if (!requestDetails?.order || !requestDetails?.items?.length) {
      throw new ApiError(
        400,
        "Return request order or item details are missing."
      );
    }

    // Prevent duplicate local shipment creation.
    const existingShipment =
      await adminReturnRequestRepository.getReturnShipmentByReturnRequestId(
        returnRequest.id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

    if (existingShipment) {
      throw new ApiError(
        409,
        "A return shipment already exists for this return request."
      );
    }

    const order = requestDetails.order;

    const pickupFullName =
      order.deliveryFullName ||
      [
        requestDetails.user?.firstName,
        requestDetails.user?.lastName,
      ]
        .filter(Boolean)
        .join(" ");

    const pickupAddress = [
      order.deliveryHouseNumber,
      order.deliveryAddress,
    ]
      .filter(Boolean)
      .join(", ");

    const pickupLocality = order.deliveryLocality || null;
    const pickupLandmark = order.deliveryLandmark || null;

    if (
      !pickupFullName ||
      !order.deliveryPhone ||
      !pickupAddress ||
      !order.deliveryCity ||
      !order.deliveryState ||
      !order.deliveryPincode
    ) {
      throw new ApiError(
        400,
        "Original order pickup address is incomplete."
      );
    }

const approvedAt = new Date();

await adminReturnRequestRepository.updateReturnRequestStatus(
  returnRequest,
  "APPROVED",
  {
    approvedAt,
  },
  { transaction }
);

await createScheduledReturnRefund({
  returnRequestId: returnRequest.id,
  approvedAt,
  items: requestDetails.items || [],
  order: requestDetails.order,
  transaction,
});
// Reserve local shipment before calling Shiprocket.
await adminReturnRequestRepository.createReturnShipment(
  {
    returnRequestId: returnRequest.id,
    status: "PENDING",

    pickupFullName,
    pickupPhone: order.deliveryPhone,
    pickupEmail:
      order.deliveryEmail ||
      requestDetails.user?.email ||
      null,

    pickupAddress,
    pickupLocality,
    pickupLandmark,

    pickupCity: order.deliveryCity,
    pickupState: order.deliveryState,
    pickupPincode: String(order.deliveryPincode),

    pickupCountry:
      order.deliveryPincodeCountry || "India",

    notes: "Return approved. Reverse pickup pending.",
  },
  { transaction }
);

await transaction.commit();

    logger.info(
      `Return request approved: ${normalizedUuid}`
    );

    // Shiprocket API calls happen only after DB commit.
    try {
      await createReturnPickup(normalizedUuid);
    } catch (shiprocketError) {
      // Approval remains successful.
      // Shipment remains available for retry.
      logger.error(
        `Return approved but Shiprocket pickup failed: ${shiprocketError.message}`
      );
    }

    const updatedReturnRequest =
      await adminReturnRequestRepository.getReturnRequestDetailsByUuid(
        normalizedUuid
      );

    return serializeReturnRequest(updatedReturnRequest);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    logger.error(
      `Admin approve return request error: ${error.message}`
    );

    throw error;
  }
};

/* =========================================================
   REJECT RETURN REQUEST
========================================================= */

const rejectReturnRequest = async (uuid, payload = {}) => {
  let transaction;

  try {
    const normalizedUuid = validateUuid(uuid);

    const rejectionReason = normalizeOptionalText(
      payload.rejectionReason
    );

    const adminNote = normalizeOptionalText(payload.adminNote);

    if (!rejectionReason) {
      throw new ApiError(
        400,
        "Rejection reason is required."
      );
    }

    transaction = await sequelize.transaction();

    const returnRequest =
      await adminReturnRequestRepository.getReturnRequestByUuidForUpdate(
        normalizedUuid,
        transaction
      );

    if (!returnRequest) {
      throw new ApiError(404, "Return request not found.");
    }

    if (returnRequest.status !== "REQUESTED") {
      throw new ApiError(
        409,
        `Return request cannot be rejected because its current status is ${returnRequest.status}.`
      );
    }

    await adminReturnRequestRepository.updateReturnRequestStatus(
      returnRequest,
      "REJECTED",
      {
        rejectedAt: new Date(),
        rejectionReason,
        adminNote,
      },
      { transaction }
    );

    await transaction.commit();

    logger.info(
      `Return request rejected successfully: ${normalizedUuid}`
    );

    const updatedReturnRequest =
      await adminReturnRequestRepository.getReturnRequestDetailsByUuid(
        normalizedUuid
      );

    return serializeReturnRequest(updatedReturnRequest);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    logger.error(
      `Admin reject return request error: ${error.message}`
    );

    throw error;
  }
};

/* =========================================================
   GET RETURN REQUEST STATUS COUNTS
========================================================= */

const getReturnStatusCounts = async () => {
  try {
    return await adminReturnRequestRepository.getReturnStatusCounts();
  } catch (error) {
    logger.error(
      `Admin get return status counts error: ${error.message}`
    );

    throw error;
  }
};

/* =========================================================
   REFRESH RETURN SHIPMENT TRACKING
========================================================= */

const refreshReturnTracking = async (uuid) => {
  try {
    const normalizedUuid = validateUuid(uuid);

    // STEP 1: Find return request.
    const returnRequest =
      await adminReturnRequestRepository.getReturnRequestDetailsByUuid(
        normalizedUuid
      );

    if (!returnRequest) {
      throw new ApiError(
        404,
        "Return request not found."
      );
    }

    // STEP 2: Find local return shipment.
    const shipment =
      await adminReturnRequestRepository.getReturnShipmentByReturnRequestId(
        returnRequest.id
      );

    if (!shipment) {
      throw new ApiError(
        404,
        "Return shipment record not found."
      );
    }

    if (!shipment.awbNumber) {
      throw new ApiError(
        409,
        "Return shipment AWB is not assigned yet."
      );
    }

    if (!shipment.shiprocketShipmentId) {
      throw new ApiError(
        409,
        "Shiprocket return shipment ID is missing."
      );
    }

    // Do not refresh terminal failure/cancellation states.
    if (
      ["CANCELLED", "RTO"].includes(shipment.status)
    ) {
      throw new ApiError(
        409,
        `Tracking cannot be refreshed for shipment status ${shipment.status}.`
      );
    }

    // STEP 3: Fetch tracking from Shiprocket.
    const trackingResponse =
      await getShiprocketReturnTracking(
        shipment.awbNumber
      );

    const {
      trackingData,
      currentStatus,
      activities,
      currentTracking,
    } = extractShiprocketTrackingData(
      trackingResponse
    );

    if (!currentStatus && !activities.length) {
      throw new ApiError(
        502,
        "Shiprocket has not returned any tracking information."
      );
    }

    // STEP 4: Normalize tracking activities.
    const normalizedActivities = activities
      .map((activity) =>
        normalizeShiprocketTrackingActivity(
          activity,
          shipment.id,
          currentStatus
        )
      )
      .filter(Boolean);

    // STEP 5: Map current shipment status.
    const mappedStatus =
      mapShiprocketShipmentStatus(currentStatus);

    // STEP 6: Save events and update statuses transactionally.
    await sequelize.transaction(async (transaction) => {
      const lockedRequest =
        await adminReturnRequestRepository.getReturnRequestByUuidForUpdate(
          normalizedUuid,
          transaction
        );

      if (!lockedRequest) {
        throw new ApiError(
          404,
          "Return request not found."
        );
      }

      const lockedShipment =
        await adminReturnRequestRepository.getReturnShipmentByIdForUpdate(
          shipment.id,
          transaction
        );

      if (!lockedShipment) {
        throw new ApiError(
          404,
          "Return shipment record not found."
        );
      }

      // Save tracking activities without duplicates.
      for (const eventData of normalizedActivities) {
        let duplicate = null;

        // First check provider event ID.
        if (eventData.providerEventId) {
          duplicate =
            await adminReturnRequestRepository
              .getReturnTrackingEventByProviderEventId(
                lockedShipment.id,
                eventData.providerEventId,
                { transaction }
              );
        }

        // Fallback duplicate check.
        if (!duplicate) {
          duplicate =
            await adminReturnRequestRepository
              .getDuplicateReturnTrackingEvent(
                {
                  returnShipmentId: lockedShipment.id,
                  status: eventData.status,
                  eventAt: eventData.eventAt,
                  location: eventData.location,
                  description: eventData.description,
                },
                { transaction }
              );
        }

        if (!duplicate) {
          await adminReturnRequestRepository
            .createReturnTrackingEvent(
              eventData,
              { transaction }
            );
        }
      }

      // Update shipment status only when mapping is known.
      const shipmentUpdate = {
        lastTrackedAt: new Date(),
        rawPayload: {
          ...(lockedShipment.rawPayload || {}),
          trackingResponse,
        },
      };

      if (mappedStatus) {
        shipmentUpdate.status = mappedStatus;
      }

      // Record pickup time when shipment has been collected.
      if (
        mappedStatus &&
        [
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ].includes(mappedStatus) &&
        !lockedShipment.pickedUpAt
      ) {
        const pickupActivity = normalizedActivities.find(
          (event) =>
            mapShiprocketShipmentStatus(event.status) ===
            "PICKED_UP"
        );

        shipmentUpdate.pickedUpAt =
          pickupActivity?.eventAt || new Date();
      }

      // Record warehouse delivery time.
      if (
        mappedStatus === "DELIVERED" &&
        !lockedShipment.deliveredAt
      ) {
        const deliveryActivity = normalizedActivities.find(
          (event) =>
            mapShiprocketShipmentStatus(event.status) ===
            "DELIVERED"
        );

        shipmentUpdate.deliveredAt =
          deliveryActivity?.eventAt ||
          parseTrackingDate(
            trackingData.delivered_date
          ) ||
          new Date();
      }

      await adminReturnRequestRepository.updateReturnShipment(
        lockedShipment,
        shipmentUpdate,
        { transaction }
      );

      // Update parent return request status.
      // Do not overwrite inspection/refund statuses.
      const requestCanBeUpdated = [
        "APPROVED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
      ].includes(lockedRequest.status);

      if (requestCanBeUpdated) {
        if (mappedStatus === "DELIVERED") {
          await adminReturnRequestRepository
            .updateReturnRequestStatus(
              lockedRequest,
              "RECEIVED",
              {
                receivedAt:
                  lockedRequest.receivedAt ||
                  shipmentUpdate.deliveredAt ||
                  new Date(),
              },
              { transaction }
            );
        } else if (
          mappedStatus === "PICKED_UP" ||
          mappedStatus === "IN_TRANSIT" ||
          mappedStatus === "OUT_FOR_DELIVERY"
        ) {
          await adminReturnRequestRepository
            .updateReturnRequestStatus(
              lockedRequest,
              "PICKED_UP",
              {},
              { transaction }
            );
        } else if (
          mappedStatus === "PICKUP_SCHEDULED"
        ) {
          await adminReturnRequestRepository
            .updateReturnRequestStatus(
              lockedRequest,
              "PICKUP_SCHEDULED",
              {},
              { transaction }
            );
        }
      }
    });

    logger.info(
      `Return tracking refreshed successfully: ${normalizedUuid}`
    );

    // STEP 7: Return updated request details.
    const updatedReturnRequest =
      await adminReturnRequestRepository
        .getReturnRequestDetailsByUuid(
          normalizedUuid
        );

    return serializeReturnRequest(
      updatedReturnRequest
    );
  } catch (error) {
    logger.error(
      `Admin refresh return tracking error: ${error.message}`
    );

    throw error;
  }
};

/* =========================================================
   RETRY RETURN PICKUP
========================================================= */

const retryReturnPickup = async (uuid) => {
  const normalizedUuid = validateUuid(uuid);

  const returnRequest =
    await adminReturnRequestRepository.getReturnRequestDetailsByUuid(
      normalizedUuid
    );

  if (!returnRequest) {
    throw new ApiError(404, "Return request not found.");
  }

  const shipment =
  await adminReturnRequestRepository.getReturnShipmentByReturnRequestId(
    returnRequest.id
  );

if (!shipment) {
  throw new ApiError(
    404,
    "Return shipment record not found."
  );
}

if (
  ![
    "PENDING",
    "PICKUP_FAILED",
    "PICKUP_SCHEDULED",
  ].includes(shipment.status)
) {
  throw new ApiError(
    409,
    "Return shipment cannot be retried in its current status."
  );
}

  // Already assigned AWB: retry pickup only.
  if (
    shipment.shiprocketShipmentId &&
    shipment.awbNumber
  ) {
    const pickupResponse =
      await scheduleShiprocketReturnPickup({
        shipmentId: shipment.shiprocketShipmentId,
        retry: true,
      });

    const pickupSuccessful =
      Number(pickupResponse?.pickup_status) === 1 ||
      Number(pickupResponse?.response?.data?.status) === 3;

    if (!pickupSuccessful) {
      throw new ApiError(
        502,
        "Shiprocket pickup retry was not confirmed."
      );
    }

    await sequelize.transaction(async (transaction) => {
      await adminReturnRequestRepository.updateReturnShipment(
        shipment,
        {
          status: "PICKUP_SCHEDULED",
          pickupScheduledAt: new Date(),
          rawPayload: {
            ...(shipment.rawPayload || {}),
            pickupRetryResponse: pickupResponse,
          },
          notes: "Return pickup retry successful.",
        },
        { transaction }
      );

      const lockedRequest =
        await adminReturnRequestRepository.getReturnRequestByUuidForUpdate(
          normalizedUuid,
          transaction
        );

if (
  lockedRequest &&
  ["APPROVED", "PICKUP_SCHEDULED"].includes(
    lockedRequest.status
  )
) {
  await adminReturnRequestRepository.updateReturnRequestStatus(
    lockedRequest,
    "PICKUP_SCHEDULED",
    {},
    { transaction }
  );
}
    });

    return adminReturnRequestRepository.getReturnRequestDetailsByUuid(
      normalizedUuid
    );
  }

  // If order/AWB is missing, continue remaining steps.
  await createReturnPickup(normalizedUuid);

  return adminReturnRequestRepository.getReturnRequestDetailsByUuid(
    normalizedUuid
  );
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getReturnRequests,
  getReturnRequestDetails,

  approveReturnRequest,
  rejectReturnRequest,

  createReturnPickup,
  retryReturnPickup,

  refreshReturnTracking,

  getReturnStatusCounts,
};