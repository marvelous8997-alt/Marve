
"use strict";

const { sequelize } = require("../../database/models");

const {
  adminOrderRepository,
  adminShipmentRepository,
} = require("../../repositories");

const { shiprocketRequest } = require("../../helpers/shiprocket.helper");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* =========================================================
   CONSTANTS
========================================================= */

const ELIGIBLE_ORDER_STATUSES = ["CONFIRMED", "PROCESSING"];

const SHIPMENT_STATUSES = [
  "PENDING",
  "READY_TO_SHIP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
  "RETURN_TO_ORIGIN",
];

const TRACKING_SOURCES = ["ADMIN", "COURIER", "SYSTEM"];

const ORDER_STATUS_BY_SHIPMENT_STATUS = {
  PICKED_UP: "SHIPPED",
  IN_TRANSIT: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
};
/* =========================================================
   HELPERS
========================================================= */

const normalizeText = (value) =>
  String(value ?? "").trim();

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getPlainData = (record) => {
  if (!record) return null;

  return typeof record.get === "function"
    ? record.get({ plain: true })
    : record;
};

const getResponseData = (response) =>
  response?.data || response || {};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  (
    error?.response?.data?.errors
      ? JSON.stringify(error.response.data.errors)
      : null
  ) ||
  error?.message ||
  "Shiprocket request failed.";

const getOrderIdentifier = (order) =>
  normalizeText(order.orderNumber || order.id);

const validateId = (value, label) => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new ApiError(400, `Invalid ${label}.`);
  }

  return id;
};

const validateOrderForShipment = (order) => {
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  if (!ELIGIBLE_ORDER_STATUSES.includes(order.orderStatus)) {
    throw new ApiError(
      400,
      `Shipment cannot be created for order status ${order.orderStatus}.`
    );
  }

  if (
    order.paymentMethod === "ONLINE" &&
    order.paymentStatus !== "PAID"
  ) {
    throw new ApiError(
      400,
      "Online payment must be completed before shipment creation."
    );
  }

  if (!["ONLINE", "COD"].includes(order.paymentMethod)) {
    throw new ApiError(400, "Invalid order payment method.");
  }

  if (!Array.isArray(order.items) || !order.items.length) {
    throw new ApiError(400, "Order does not contain any items.");
  }
};

const formatOrderDate = (date) => {
  const value = date ? new Date(date) : new Date();

  if (Number.isNaN(value.getTime())) {
    throw new ApiError(400, "Invalid order date.");
  }

  return value.toISOString().slice(0, 19).replace("T", " ");
};

/* =========================================================
   BUILD SHIPROCKET ITEMS
========================================================= */

const buildShiprocketItems = (items = []) => {
  return items.map((item) => {
    const quantity = toNumber(item.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError(400, "Invalid product quantity in order.");
    }

    const name = normalizeText(
      item.variationName
        ? `${item.productName} - ${item.variationName}`
        : item.productName
    );

    const sku = normalizeText(
      item.variationSku || item.productSku
    );

    if (!name || !sku) {
      throw new ApiError(
        400,
        "Product name and SKU are required for shipment."
      );
    }

    const sellingPrice = item.isFreeGift
      ? 0
      : toNumber(item.unitPrice);

    if (sellingPrice < 0) {
      throw new ApiError(400, "Invalid product selling price.");
    }

    return {
      name,
      sku,
      units: quantity,
      selling_price: sellingPrice,
      discount: toNumber(item.unitDiscount),
      tax: toNumber(item.taxRate),
    };
  });
};

/* =========================================================
   BUILD SHIPROCKET PAYLOAD
========================================================= */

const buildShiprocketPayload = (order, packageDimensions) => {
  const weight = Number(packageDimensions?.weight);
  const length = Number(packageDimensions?.length);
  const breadth = Number(packageDimensions?.breadth);
  const height = Number(packageDimensions?.height);

  if (
    !Number.isFinite(length) ||
    !Number.isFinite(breadth) ||
    !Number.isFinite(height) ||
    length <= 0 ||
    breadth <= 0 ||
    height <= 0
  ) {
    throw new ApiError(
      400,
      "Valid parcel length, breadth and height are required."
    );
  }

  const customerName = normalizeText(order.deliveryFullName);
  const phone = normalizeText(order.deliveryPhone);
  const email = normalizeText(order.deliveryEmail);

  const addressLine1 = [
    order.deliveryHouseNumber,
    order.deliveryAddress,
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(", ");

  const addressLine2 = [
    order.deliveryLocality,
    order.deliveryLandmark,
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(", ");

  const city = normalizeText(order.deliveryCity);
  const state = normalizeText(order.deliveryState);
  const pincode = normalizeText(order.deliveryPincode);

  if (
    !customerName ||
    !phone ||
    !addressLine1 ||
    !city ||
    !state ||
    !pincode
  ) {
    throw new ApiError(
      400,
      "Order delivery address is incomplete."
    );
  }

  if (!/^\d{6}$/.test(pincode)) {
    throw new ApiError(400, "Invalid delivery pincode.");
  }

  const subtotal = toNumber(order.subtotal);
  const productDiscount = toNumber(order.productDiscount);
  const couponDiscount = toNumber(order.couponDiscount);
  const shippingAmount = toNumber(order.shippingAmount);
  const totalAmount = toNumber(order.totalAmount);

  if (
    subtotal < 0 ||
    productDiscount < 0 ||
    couponDiscount < 0 ||
    shippingAmount < 0 ||
    totalAmount <= 0
  ) {
    throw new ApiError(400, "Invalid order amount details.");
  }

  const pickupLocation =
    normalizeText(process.env.SHIPROCKET_PICKUP_LOCATION) ||
    "work";

  return {
    order_id: getOrderIdentifier(order),
    order_date: formatOrderDate(order.createdAt),

    pickup_location: pickupLocation,

    billing_customer_name: customerName,
    billing_last_name: "",
    billing_address: addressLine1,
    billing_address_2: addressLine2,
    billing_city: city,
    billing_pincode: pincode,
    billing_state: state,
    billing_country: "India",
    billing_email: email,
    billing_phone: phone,

    shipping_is_billing: true,

    length,
    breadth,
    height,
    weight,

    order_items: buildShiprocketItems(order.items),

    payment_method:
      order.paymentMethod === "COD" ? "COD" : "Prepaid",

    shipping_charges: shippingAmount,
    giftwrap_charges: 0,
    transaction_charges: 0,

    total_discount: productDiscount + couponDiscount,
    sub_total: subtotal,
  };
};


/* =========================================================
   SHIPROCKET ORDER
========================================================= */

const createShiprocketOrder = async (payload) => {
  try {
    logger.info("Shiprocket order payload debug", {
      payload: JSON.stringify(payload, null, 2),
      isValidJson: (() => {
        try {
          JSON.parse(JSON.stringify(payload));
          return true;
        } catch {
          return false;
        }
      })(),
    });

    const response = await shiprocketRequest({
      method: "POST",
      url: "/orders/create/adhoc",
      data: payload,
    });

    const data = getResponseData(response);

    if (!data.order_id || !data.shipment_id) {
      throw new ApiError(
        502,
        "Shiprocket did not return valid order and shipment IDs."
      );
    }

    return {
      shiprocketOrderId: String(data.order_id),
      shiprocketShipmentId: String(data.shipment_id),
      response: data,
    };
  } catch (error) {
    logger.error("Shiprocket order creation failed", {
      message: getErrorMessage(error),
    });

    if (error instanceof ApiError) throw error;

    throw new ApiError(502, getErrorMessage(error));
  }
};

/* =========================================================
   ASSIGN AWB
========================================================= */


const assignShiprocketAwb = async (
  shipmentId,
  courierId = null
) => {
  try {
    const payload = {
      shipment_id: Number(shipmentId),
    };

    if (courierId !== null && courierId !== undefined) {
      const id = Number(courierId);

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ApiError(400, "Invalid courier ID.");
      }

      payload.courier_id = id;
    }

    const response = await shiprocketRequest({
      method: "POST",
      url: "/courier/assign/awb",
      data: payload,
    });

    const data = getResponseData(response);

    const result =
      data.response?.data ||
      data.data ||
      data.response ||
      data;

    const awbNumber = normalizeText(
      result.awb_code || result.awb
    );

    if (!awbNumber) {
      throw new ApiError(
        502,
        "Shiprocket did not return an AWB number."
      );
    }

    return {
      awbNumber,
      courierName: normalizeText(result.courier_name) || null,
      courierCode: normalizeText(
        result.courier_company_id || result.courier_id
      ) || null,
      response: data,
    };
  } catch (error) {
    logger.warn("Shiprocket AWB assignment is pending.", {
      shipmentId,
      message: getErrorMessage(error),
    });

    throw error;
  }
};

/* =========================================================
   GET SHIPROCKET TRACKING BY AWB
========================================================= */

const getShiprocketTrackingByAwb = async (awbNumber) => {
  const awb = normalizeText(awbNumber);

  if (!awb) {
    throw new ApiError(400, "AWB number is required for tracking.");
  }

  try {
    const response = await shiprocketRequest({
      method: "GET",
      url: `/courier/track/awb/${encodeURIComponent(awb)}`,
    });

    return getResponseData(response);
  } catch (error) {
    logger.error("Shiprocket tracking request failed.", {
      awbNumber: awb,
      message: getErrorMessage(error),
    });

    throw error;
  }
};
/* =========================================================
   CREATE SHIPMENT
========================================================= */


const createShipment = async (
  orderIdentifier,
  {
    courierId = null,
    notes = null,
    packageDimensions = null,
  } = {}
) => {
  const identifier = normalizeText(orderIdentifier);

  if (!identifier) {
    throw new ApiError(400, "Order ID or UUID is required.");
  }

  let order;

  if (/^\d+$/.test(identifier)) {
    order = await adminOrderRepository.findById(Number(identifier));
  } else {
    order = await adminOrderRepository.findByUuid(identifier);
  }

  const orderData = getPlainData(order);

  validateOrderForShipment(orderData);

  /*
    Create a local reservation before calling Shiprocket.
    Existing incomplete reservations must be reconciled manually.
  */

  const reservationTransaction = await sequelize.transaction();

  let payload;
  let shipment;
  let shiprocketOrder;

  try {
    const latestOrder = await adminOrderRepository.findByIdForUpdate(
      orderData.id,
      reservationTransaction
    );

    const latestOrderData = getPlainData(latestOrder);

    validateOrderForShipment(latestOrderData);

    payload = buildShiprocketPayload(
      latestOrderData,
      packageDimensions
    );

    const existingShipment =
      await adminShipmentRepository.getShipmentByOrderId(
        orderData.id,
        { transaction: reservationTransaction }
      );

    if (existingShipment) {
      throw new ApiError(
        409,
        "A shipment record already exists for this order. Reconcile it before creating another shipment."
      );
    }

    shipment = await adminShipmentRepository.createShipment(
      {
        orderId: orderData.id,
        status: "PENDING",
        notes: notes ? normalizeText(notes) : null,
      },
      { transaction: reservationTransaction }
    );

    await reservationTransaction.commit();
  } catch (error) {
    if (!reservationTransaction.finished) {
      await reservationTransaction.rollback();
    }

    throw error;
  }

  try {
    /*
      STEP 1: Create Shiprocket order.
      This is mandatory for shipment creation.
    */

    shiprocketOrder = await createShiprocketOrder(payload);

    /*
      STEP 2: Save Shiprocket IDs immediately.
      These IDs are required for future AWB reconciliation.
    */

    let updatedShipment =
      await adminShipmentRepository.updateShipment(
        shipment,
        {
          shiprocketOrderId: shiprocketOrder.shiprocketOrderId,
          shiprocketShipmentId: shiprocketOrder.shiprocketShipmentId,
          status: "PENDING",
        }
      );

    /*
      STEP 3: Try AWB assignment separately.
      AWB failure should not fail shipment order creation.
    */

    let awb = null;

    try {
      awb = await assignShiprocketAwb(
        shiprocketOrder.shiprocketShipmentId,
        courierId
      );
    } catch (awbError) {
      logger.warn("Shipment created successfully, but AWB assignment is pending.", {
        orderId: orderData.id,
        localShipmentId: shipment.id,
        shiprocketOrderId: shiprocketOrder.shiprocketOrderId,
        shiprocketShipmentId: shiprocketOrder.shiprocketShipmentId,
        message: getErrorMessage(awbError),
      });
    }

    /*
      STEP 4: Update shipment only when AWB is available.
      Database errors here must reach the outer catch.
    */

    if (awb) {
      updatedShipment =
        await adminShipmentRepository.updateShipment(
          updatedShipment,
          {
            awbNumber: awb.awbNumber,
            trackingNumber: awb.awbNumber,
            courierName: awb.courierName,
            courierCode: awb.courierCode,
            status: "READY_TO_SHIP",
          }
        );

      await adminShipmentRepository.createTrackingEvent({
        shipmentId: updatedShipment.id,
        status: "READY_TO_SHIP",
        location: null,
        description: "Shipment created and AWB assigned.",
        eventAt: new Date(),
        source: "SYSTEM",
        rawPayload: awb.response,
      });
    }

    /*
      STEP 5: Log successful shipment creation.
    */

    logger.info("Shipment created successfully", {
      orderId: orderData.id,
      shipmentId: updatedShipment.id,
      shiprocketOrderId: shiprocketOrder.shiprocketOrderId,
      shiprocketShipmentId: shiprocketOrder.shiprocketShipmentId,
      awbNumber: awb?.awbNumber || null,
      awbPending: !awb,
    });

    /*
      STEP 6: Return success even when AWB is pending.
    */

    return {
      message: awb
        ? "Shipment created successfully and AWB assigned."
        : "Shipment created successfully. AWB assignment is pending.",

      shipment: updatedShipment,

      shiprocket: {
        orderId: shiprocketOrder.shiprocketOrderId,
        shipmentId: shiprocketOrder.shiprocketShipmentId,
        awbNumber: awb?.awbNumber || null,
        courierName: awb?.courierName || null,
        courierCode: awb?.courierCode || null,
      },

      awbPending: !awb,
    };
  } catch (error) {
    logger.error("Shipment workflow failed", {
      orderId: orderData.id,
      localShipmentId: shipment?.id,
      shiprocketOrderId: shiprocketOrder?.shiprocketOrderId || null,
      shiprocketShipmentId:
        shiprocketOrder?.shiprocketShipmentId || null,
      message: getErrorMessage(error),
    });

    /*
      Never delete the reservation or external IDs automatically.
      Reconcile the Shiprocket order before retrying.
    */

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      "Shipment creation failed. Check the saved shipment and Shiprocket IDs before retrying."
    );
  }
};


/* =========================================================
   GET SHIPMENTS
========================================================= */

const getShipments = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  courierName,
  orderNumber,
  trackingNumber,
  dateFrom,
  dateTo,
  sortBy = "createdAt",
  sortOrder = "DESC",
} = {}) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageLimit = Math.min(
    100,
    Math.max(1, Number(limit) || 10)
  );

  const result = await adminShipmentRepository.getShipments({
    page: currentPage,
    limit: pageLimit,
    search: normalizeText(search),
    status,
    courierName: normalizeText(courierName),
    orderNumber: normalizeText(orderNumber),
    trackingNumber: normalizeText(trackingNumber),
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  });

  const totalItems = result.count;

  return {
    shipments: result.rows,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / pageLimit),
    },
  };
};

/* =========================================================
   GET SHIPMENT BY ORDER
========================================================= */

const getShipmentByOrderId = async (orderIdentifier) => {
  const identifier = normalizeText(orderIdentifier);

  if (!identifier) {
    throw new ApiError(400, "Order ID or UUID is required.");
  }

  const order = /^\d+$/.test(identifier)
    ? await adminOrderRepository.findById(Number(identifier))
    : await adminOrderRepository.findByUuid(identifier);

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  const shipment =
    await adminShipmentRepository.getShipmentByOrderId(order.id);

  if (!shipment) {
    throw new ApiError(404, "Shipment not found for this order.");
  }

  return adminShipmentRepository.getShipmentDetails(shipment.id);
};

/* =========================================================
   GET SHIPMENT BY ID
========================================================= */

const getShipmentById = async (shipmentId) => {
  const id = validateId(shipmentId, "shipment ID");

  const shipment =
    await adminShipmentRepository.getShipmentDetails(id);

  if (!shipment) {
    throw new ApiError(404, "Shipment not found.");
  }

  return shipment;
};

/* =========================================================
   GET TRACKING HISTORY
========================================================= */

const getShipmentTrackingHistory = async (shipmentId) => {
  const id = validateId(shipmentId, "shipment ID");

  const shipment =
    await adminShipmentRepository.getShipmentById(id);

  if (!shipment) {
    throw new ApiError(404, "Shipment not found.");
  }

  return adminShipmentRepository.getTrackingEventsByShipmentId(id);
};

/* =========================================================
   GET LATEST TRACKING EVENT
========================================================= */

const getLatestShipmentTracking = async (shipmentId) => {
  const id = validateId(shipmentId, "shipment ID");

  const shipment =
    await adminShipmentRepository.getShipmentById(id);

  if (!shipment) {
    throw new ApiError(404, "Shipment not found.");
  }

  return adminShipmentRepository.getLatestTrackingEvent(id);
};


/* =========================================================
   SYNC SHIPROCKET TRACKING
========================================================= */

const SHIPROCKET_TRACKING_STATUS_MAP = {
  PENDING: "PENDING",
  NEW: "PENDING",
  READY_TO_SHIP: "READY_TO_SHIP",
  PICKUP_SCHEDULED: "READY_TO_SHIP",
  PICKED_UP: "PICKED_UP",
  SHIPPED: "IN_TRANSIT",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  CANCELED: "CANCELLED",
  RTO: "RETURN_TO_ORIGIN",
  RETURN_TO_ORIGIN: "RETURN_TO_ORIGIN",
};

const syncShipmentTracking = async (shipmentId) => {
  const id = validateId(shipmentId, "shipment ID");

  const shipment = await adminShipmentRepository.getShipmentById(id);

  if (!shipment) {
    throw new ApiError(404, "Shipment not found.");
  }

  const awbNumber = normalizeText(
    shipment.awbNumber || shipment.trackingNumber
  );

  if (!awbNumber) {
    throw new ApiError(
      400,
      "AWB number is not available for this shipment."
    );
  }

  // Fetch tracking from Shiprocket (Mock mode in current testing).
  const response = await getShiprocketTrackingByAwb(awbNumber);

  const trackingData = response?.tracking_data || response;

  const trackingEvents = Array.isArray(trackingData?.shipment_track)
    ? trackingData.shipment_track
    : [];

  const latestProviderEvent = trackingEvents[0] || {};

  const providerStatus = normalizeText(
    latestProviderEvent.current_status ||
    trackingData?.shipment_status ||
    trackingData?.current_status
  ).toUpperCase();

  const mappedStatus =
    SHIPROCKET_TRACKING_STATUS_MAP[providerStatus];

  if (!mappedStatus) {
    throw new ApiError(
      422,
      `Unsupported Shiprocket tracking status: ${providerStatus || "UNKNOWN"}.`
    );
  }

  const eventAt = latestProviderEvent.date
    ? new Date(latestProviderEvent.date)
    : new Date();

  if (Number.isNaN(eventAt.getTime())) {
    throw new ApiError(422, "Invalid tracking event date.");
  }

  const location = normalizeText(
    latestProviderEvent.location
  ) || null;

  const description = normalizeText(
    latestProviderEvent.activity ||
    latestProviderEvent.description ||
    providerStatus
  ) || null;

  // Avoid creating duplicate events when status/details have not changed.
  const latestEvent =
    await adminShipmentRepository.getLatestTrackingEvent(id);

  const isNewEvent =
    !latestEvent ||
    latestEvent.status !== mappedStatus ||
    normalizeText(latestEvent.location) !== normalizeText(location) ||
    normalizeText(latestEvent.description) !== normalizeText(description);

  let result = null;

  if (isNewEvent) {
    result = await updateShipmentStatus(id, mappedStatus, {
      location,
      description,
      eventAt,
      source: "COURIER",
      rawPayload: response,
    });
  }

  // Update sync timestamp even when the tracking event is unchanged.
  const latestShipment =
    await adminShipmentRepository.getShipmentById(id);

  await adminShipmentRepository.updateLastTrackedAt(
    latestShipment,
    new Date()
  );

  const updatedShipment =
    await adminShipmentRepository.getShipmentDetails(id);

  logger.info("Shipment tracking synced successfully.", {
    shipmentId: id,
    awbNumber,
    status: mappedStatus,
    newEventCreated: isNewEvent,
  });

  return {
    message: "Shipment tracking synced successfully.",
    shipment: updatedShipment,
    tracking: {
      awbNumber,
      providerStatus,
      status: mappedStatus,
      location,
      description,
      eventAt,
      newEventCreated: isNewEvent,
    },
  };
};


/* =========================================================
   UPDATE SHIPMENT STATUS
========================================================= */

const updateShipmentStatus = async (
  shipmentId,
  status,
  {
    location = null,
    description = null,
    eventAt = new Date(),
    source = "ADMIN",
    rawPayload = null,
  } = {}
) => {
  const id = validateId(shipmentId, "shipment ID");
  const normalizedStatus = normalizeText(status).toUpperCase();

  if (!SHIPMENT_STATUSES.includes(normalizedStatus)) {
    throw new ApiError(400, "Invalid shipment status.");
  }

  if (!TRACKING_SOURCES.includes(source)) {
    throw new ApiError(400, "Invalid tracking event source.");
  }

  const parsedEventDate = new Date(eventAt);

  if (Number.isNaN(parsedEventDate.getTime())) {
    throw new ApiError(400, "Invalid tracking event date.");
  }

  const transaction = await sequelize.transaction();

  try {
    const shipment = await adminShipmentRepository.getShipmentById(
      id,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!shipment) {
      throw new ApiError(404, "Shipment not found.");
    }

    const result =
      await adminShipmentRepository.createTrackingEventAndUpdateShipment(
        shipment,
        {
          status: normalizedStatus,
          location: location ? normalizeText(location) : null,
          description: description
            ? normalizeText(description)
            : null,
          eventAt: parsedEventDate,
          source,
          rawPayload,
        },
        { transaction }
      );

const nextOrderStatus =
  ORDER_STATUS_BY_SHIPMENT_STATUS[normalizedStatus];

if (nextOrderStatus) {
  const order = await adminOrderRepository.findByIdForUpdate(
    shipment.orderId,
    transaction
  );

  if (!order) {
    throw new ApiError(404, "Order not found for this shipment.");
  }

  await adminOrderRepository.updateOrderStatus(
    order,
    nextOrderStatus,
    transaction
  );
}

    await transaction.commit();

    return result;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getShipments,
  createShipment,
  getShipmentByOrderId,
  getShipmentById,
  getShipmentTrackingHistory,
  getLatestShipmentTracking,
  updateShipmentStatus,
  syncShipmentTracking, // NEW
};
