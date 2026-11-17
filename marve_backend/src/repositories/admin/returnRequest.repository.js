
"use strict";

const { Op, fn, col } = require("sequelize");

const {
  ReturnRequest,
  ReturnItem,
  ReturnShipment,
  ReturnTrackingEvent,
  ReturnRefund,
  Order,
  OrderItem,
  Product,
  ProductVariation,
  User,
  Payment,
  sequelize,
} = require("../../database/models");

/* =========================================================
   RETURN REQUEST STATUS
========================================================= */

const RETURN_REQUEST_STATUSES = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "RECEIVED",
  "INSPECTING",
  "REFUND_APPROVED",
  "REFUND_INITIATED",
  "REFUNDED",
  "CANCELLED",
];

/* =========================================================
   COMMON INCLUDE
   RETURN REQUEST LIST
========================================================= */

const getReturnRequestListInclude = () => [
  {
    model: Order,
    as: "order",
    required: false,
    attributes: [
      "id",
      "uuid",
      "orderNumber",
      "orderStatus",
      "paymentStatus",
      "paymentMethod",
      "totalAmount",
      "currency",
      "placedAt",
      "createdAt",
    ],
  },
  {
    model: User,
    as: "user",
    required: false,
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "phone",
    ],
  },
  {
    model: ReturnItem,
    as: "items",
    required: false,
    attributes: [
      "id",
      "uuid",
      "orderItemId",
      "quantity",
      "unitPrice",
      "refundAmount",
      "itemCondition",
      "createdAt",
    ],
    include: [
      {
        model: OrderItem,
        as: "orderItem",
        required: false,
      },
    ],
  },
  {
  model: ReturnShipment,
  as: "shipments",
  required: false,
  attributes: [
    "id",
    "uuid",
    "returnRequestId",
    "shiprocketOrderId",
    "shiprocketShipmentId",
    "courierName",
    "courierCode",
    "trackingNumber",
    "awbNumber",
    "status",
    "pickupScheduledAt",
    "pickedUpAt",
    "deliveredAt",
    "lastTrackedAt",
    "createdAt",
    "updatedAt",
  ],
},
];

/* =========================================================
   COMPLETE RETURN REQUEST INCLUDE
========================================================= */

const getReturnRequestDetailsInclude = () => [
{
  model: Order,
  as: "order",
  required: false,
  include: [
    {
      model: Payment,
      as: "payments",
      required: false,
    },
  ],
},
  {
    model: User,
    as: "user",
    required: false,
  },
  {
    model: ReturnItem,
    as: "items",
    required: false,
    include: [
{
  model: OrderItem,
  as: "orderItem",
  required: false,
  include: [
    {
      model: Product,
      as: "product",
      required: false,
    },
    {
      model: ProductVariation,
      as: "variation",
      required: false,
    },
  ],
},
    ],
  },
  {
    model: ReturnShipment,
    as: "shipments",
    required: false,
    include: [
      {
        model: ReturnTrackingEvent,
        as: "trackingEvents",
        required: false,
      },
    ],
  },
  {
    model: ReturnRefund,
    as: "refunds",
    required: false,
    include: [
      {
        model: Payment,
        as: "payment",
        required: false,
      },
    ],
  },
];

/* =========================================================
   FIND RETURN REQUEST BY ID
========================================================= */

const getReturnRequestById = async (
  id,
  options = {}
) => {
  return await ReturnRequest.findByPk(id, {
    ...options,
  });
};

/* =========================================================
   FIND RETURN REQUEST BY UUID
========================================================= */

const getReturnRequestByUuid = async (
  uuid,
  options = {}
) => {
  return await ReturnRequest.findOne({
    where: { uuid },
    ...options,
  });
};

/* =========================================================
   FIND RETURN REQUEST BY RETURN NUMBER
========================================================= */

const getReturnRequestByNumber = async (
  returnNumber,
  options = {}
) => {
  return await ReturnRequest.findOne({
    where: { returnNumber },
    ...options,
  });
};

/* =========================================================
   FIND RETURN REQUEST BY ID FOR UPDATE
========================================================= */

const getReturnRequestByIdForUpdate = async (
  id,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to lock a return request."
    );
  }

  return await ReturnRequest.findByPk(id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};

/* =========================================================
   FIND RETURN REQUEST BY UUID FOR UPDATE
========================================================= */

const getReturnRequestByUuidForUpdate = async (
  uuid,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to lock a return request."
    );
  }

  return await ReturnRequest.findOne({
    where: { uuid },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};

/* =========================================================
   GET ALL RETURN REQUESTS
   SEARCH, FILTERS & PAGINATION
========================================================= */

const getReturnRequests = async ({
  page = 1,
  limit = 10,
  search = "",
  returnNumber = "",
  orderNumber = "",
  customer = "",
  email = "",
  phone = "",
  status,
  reason,
  dateFrom,
  dateTo,
  sortBy = "requestedAt",
  sortOrder = "DESC",
} = {}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.min(100, Math.max(1, Number(limit) || 10));

  const offset = (page - 1) * limit;

  const where = {};
  const andConditions = [];

  const searchTerm = String(search || "").trim();
  const returnNumberTerm = String(returnNumber || "").trim();
  const orderNumberTerm = String(orderNumber || "").trim();
  const customerTerm = String(customer || "").trim();
  const emailTerm = String(email || "").trim();
  const phoneTerm = String(phone || "").trim();

  // General search.
  if (searchTerm) {
    andConditions.push({
      [Op.or]: [
        {
          returnNumber: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$order.orderNumber$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$user.firstName$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$user.lastName$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$user.email$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$user.phone$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ],
    });
  }

  // Return number filter.
  if (returnNumberTerm) {
    where.returnNumber = {
      [Op.like]: `%${returnNumberTerm}%`,
    };
  }

  // Order number filter.
  if (orderNumberTerm) {
    andConditions.push({
      "$order.orderNumber$": {
        [Op.like]: `%${orderNumberTerm}%`,
      },
    });
  }

  // Customer name filter.
  if (customerTerm) {
    andConditions.push({
      [Op.or]: [
        {
          "$user.firstName$": {
            [Op.like]: `%${customerTerm}%`,
          },
        },
        {
          "$user.lastName$": {
            [Op.like]: `%${customerTerm}%`,
          },
        },
      ],
    });
  }

  // Email filter.
  if (emailTerm) {
    andConditions.push({
      "$user.email$": {
        [Op.like]: `%${emailTerm}%`,
      },
    });
  }

  // Phone filter.
  if (phoneTerm) {
    andConditions.push({
      "$user.phone$": {
        [Op.like]: `%${phoneTerm}%`,
      },
    });
  }

  // Status filter.
  if (status && RETURN_REQUEST_STATUSES.includes(status)) {
    where.status = status;
  }

  // Reason filter.
  if (reason) {
    where.reason = reason;
  }

  // Requested date range.
  if (dateFrom || dateTo) {
    where.requestedAt = {};

    if (dateFrom) {
      const fromDate = new Date(dateFrom);

      if (!Number.isNaN(fromDate.getTime())) {
        fromDate.setHours(0, 0, 0, 0);
        where.requestedAt[Op.gte] = fromDate;
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);

      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        where.requestedAt[Op.lte] = toDate;
      }
    }

    if (!Object.keys(where.requestedAt).length) {
      delete where.requestedAt;
    }
  }

  if (andConditions.length) {
    where[Op.and] = andConditions;
  }

  // Allowed sorting fields.
  const allowedSortFields = [
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

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "requestedAt";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

// Count separately to avoid hasMany include pagination issues.
const count = await ReturnRequest.count({
  where,
  include: [
    {
      model: Order,
      as: "order",
      required: Boolean(searchTerm || orderNumberTerm),
      attributes: [],
    },
    {
      model: User,
      as: "user",
      required: Boolean(
        searchTerm || customerTerm || emailTerm || phoneTerm
      ),
      attributes: [],
    },
  ],
  distinct: true,
  col: "id",
});

// Fetch paginated return requests.
const rows = await ReturnRequest.findAll({
  where,
  include: getReturnRequestListInclude(),
  offset,
  limit,
  order: [
    [sortBy, sortOrder],
    ["id", "DESC"],
  ],
});

return {
  count,
  rows,
  page,
  limit,
  totalPages: Math.ceil(count / limit),
};
};

/* =========================================================
   GET COMPLETE RETURN REQUEST DETAILS BY UUID
========================================================= */

const getReturnRequestDetailsByUuid = async (
  uuid,
  options = {}
) => {
  return await ReturnRequest.findOne({
    where: { uuid },
    include: getReturnRequestDetailsInclude(),
    order: [
      [
        { model: ReturnShipment, as: "shipments" },
        "createdAt",
        "DESC",
      ],
      [
        { model: ReturnRefund, as: "refunds" },
        "createdAt",
        "DESC",
      ],
    ],
    ...options,
  });
};

/* =========================================================
   GET COMPLETE RETURN REQUEST DETAILS BY ID
========================================================= */

const getReturnRequestDetailsById = async (
  id,
  options = {}
) => {
  return await ReturnRequest.findByPk(id, {
    include: getReturnRequestDetailsInclude(),
    order: [
      [
        { model: ReturnShipment, as: "shipments" },
        "createdAt",
        "DESC",
      ],
      [
        { model: ReturnRefund, as: "refunds" },
        "createdAt",
        "DESC",
      ],
    ],
    ...options,
  });
};

/* =========================================================
   GET RETURN REQUESTS BY ORDER ID
========================================================= */

const getReturnRequestsByOrderId = async (
  orderId,
  options = {}
) => {
  return await ReturnRequest.findAll({
    where: { orderId },
    order: [
      ["requestedAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

/* =========================================================
   GET RETURN REQUESTS BY USER ID
========================================================= */

const getReturnRequestsByUserId = async (
  userId,
  options = {}
) => {
  return await ReturnRequest.findAll({
    where: { userId },
    order: [
      ["requestedAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

/* =========================================================
   GET RETURN REQUESTS BY STATUS
========================================================= */

const getReturnRequestsByStatus = async (
  status,
  options = {}
) => {
  return await ReturnRequest.findAll({
    where: { status },
    order: [
      ["requestedAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

/* =========================================================
   CREATE RETURN REQUEST
   INTERNAL USE
========================================================= */

const createReturnRequest = async (
  data,
  options = {}
) => {
  return await ReturnRequest.create(data, {
    ...options,
  });
};

/* =========================================================
   UPDATE RETURN REQUEST
========================================================= */

const updateReturnRequest = async (
  returnRequest,
  payload,
  options = {}
) => {
  if (!returnRequest) {
    return null;
  }

  return await returnRequest.update(payload, {
    ...options,
  });
};

/* =========================================================
   UPDATE RETURN REQUEST STATUS
========================================================= */

const updateReturnRequestStatus = async (
  returnRequest,
  status,
  payload = {},
  options = {}
) => {
  if (!returnRequest) {
    return null;
  }

  return await returnRequest.update(
    {
      ...payload,
      status,
    },
    {
      ...options,
    }
  );
};

/* =========================================================
   GET RETURN REQUEST STATUS COUNTS
========================================================= */

const getReturnStatusCounts = async () => {
  const counts = await ReturnRequest.findAll({
    attributes: [
      "status",
      [fn("COUNT", col("id")), "count"],
    ],
    group: ["status"],
    raw: true,
  });

  const result = Object.fromEntries(
    RETURN_REQUEST_STATUSES.map((status) => [
      status,
      0,
    ])
  );

  counts.forEach((item) => {
    result[item.status] = Number(item.count || 0);
  });

  result.ALL = Object.values(result).reduce(
    (total, count) => total + count,
    0
  );

  return result;
};

/* =========================================================
   GET RETURN REQUEST COUNT BY STATUS
========================================================= */

const getReturnRequestCountByStatus = async (
  status,
  options = {}
) => {
  return await ReturnRequest.count({
    where: { status },
    ...options,
  });
};

/* =========================================================
   DELETE RETURN REQUEST
   INTERNAL USE ONLY
========================================================= */

const deleteReturnRequest = async (
  returnRequest,
  options = {}
) => {
  if (!returnRequest) {
    return false;
  }

  await returnRequest.destroy({
    ...options,
  });

  return true;
};

// GET PAYMENT BY ID FOR UPDATE
const getPaymentByIdForUpdate = async (
  paymentId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to lock a payment."
    );
  }

  return Payment.findByPk(paymentId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};


// GET DUE RETURN REFUNDS FOR PROCESSING

const getDueReturnRefundsForUpdate = async (
  {
    limit = 20,
    now = new Date(),
  } = {},
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to fetch due return refunds."
    );
  }

  const batchSize = Math.min(
    100,
    Math.max(1, Number(limit) || 20)
  );

  return ReturnRefund.findAll({
    where: {
      paymentMethod: "ONLINE",
      gateway: "RAZORPAY",
      status: "PENDING",
      scheduledAt: {
        [Op.lte]: now,
      },
      [Op.or]: [
        { nextRetryAt: null },
        {
          nextRetryAt: {
            [Op.lte]: now,
          },
        },
      ],
    },
    order: [
      ["scheduledAt", "ASC"],
      ["id", "ASC"],
    ],
    limit: batchSize,
    transaction,
    lock: transaction.LOCK.UPDATE,
    skipLocked: true,
  });
};



/* =========================================================
   RETURN REFUNDS
========================================================= */

// CREATE RETURN REFUND
const createReturnRefund = async (
  refundData,
  options = {}
) => {
  return await ReturnRefund.create(
    refundData,
    options
  );
};

// GET REFUND BY RETURN REQUEST ID
const getReturnRefundByReturnRequestId = async (
  returnRequestId,
  options = {}
) => {
  return await ReturnRefund.findOne({
    where: { returnRequestId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// GET RETURN REFUND BY RETURN REQUEST ID FOR UPDATE
const getReturnRefundByReturnRequestIdForUpdate = async (
  returnRequestId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to lock a return refund."
    );
  }

  return await ReturnRefund.findOne({
    where: { returnRequestId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};


// GET RETURN REFUND BY ID FOR UPDATE
const getReturnRefundByIdForUpdate = async (
  refundId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to lock a return refund."
    );
  }

  return ReturnRefund.findByPk(refundId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};


// UPDATE RETURN REFUND
const updateReturnRefund = async (
  refund,
  payload,
  options = {}
) => {
  if (!refund) {
    return null;
  }

  return refund.update(payload, options);
};


/* =========================================================
   RETURN SHIPMENT
========================================================= */

// GET RETURN SHIPMENT BY RETURN REQUEST ID
const getReturnShipmentByReturnRequestId = async (
  returnRequestId,
  options = {}
) => {
  return await ReturnShipment.findOne({
    where: { returnRequestId },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// GET RETURN SHIPMENT BY ID
const getReturnShipmentById = async (
  shipmentId,
  options = {}
) => {
  return await ReturnShipment.findByPk(
    shipmentId,
    options
  );
};

// GET RETURN SHIPMENT BY UUID
const getReturnShipmentByUuid = async (
  uuid,
  options = {}
) => {
  return await ReturnShipment.findOne({
    where: { uuid },
    ...options,
  });
};

// GET RETURN SHIPMENT BY ID FOR UPDATE
const getReturnShipmentByIdForUpdate = async (
  shipmentId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to lock a return shipment."
    );
  }

  return await ReturnShipment.findByPk(shipmentId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
};

// CREATE RETURN SHIPMENT
const createReturnShipment = async (
  shipmentData,
  options = {}
) => {
  return await ReturnShipment.create(
    shipmentData,
    options
  );
};

// UPDATE RETURN SHIPMENT
const updateReturnShipment = async (
  shipment,
  payload,
  options = {}
) => {
  if (!shipment) {
    return null;
  }

  return await shipment.update(
    payload,
    options
  );
};

// GET RETURN SHIPMENT BY SHIPROCKET SHIPMENT ID
const getReturnShipmentByShiprocketShipmentId = async (
  shiprocketShipmentId,
  options = {}
) => {
  return await ReturnShipment.findOne({
    where: { shiprocketShipmentId },
    ...options,
  });
};

// GET RETURN SHIPMENT BY AWB
const getReturnShipmentByAwbNumber = async (
  awbNumber,
  options = {}
) => {
  const normalizedAwb = String(awbNumber || "").trim();

  if (!normalizedAwb) {
    return null;
  }

  return await ReturnShipment.findOne({
    where: {
      [Op.or]: [
        {
          awbNumber: normalizedAwb,
        },
        {
          trackingNumber: normalizedAwb,
        },
      ],
    },
    ...options,
  });
};

/* =========================================================
   RETURN TRACKING EVENTS
========================================================= */

// CREATE RETURN TRACKING EVENT
const createReturnTrackingEvent = async (
  eventData,
  options = {}
) => {
  return await ReturnTrackingEvent.create(
    eventData,
    options
  );
};

// CREATE MULTIPLE RETURN TRACKING EVENTS
const createReturnTrackingEvents = async (
  eventsData,
  options = {}
) => {
  if (
    !Array.isArray(eventsData) ||
    eventsData.length === 0
  ) {
    throw new Error(
      "At least one return tracking event is required."
    );
  }

  return await ReturnTrackingEvent.bulkCreate(
    eventsData,
    {
      validate: true,
      ...options,
    }
  );
};

// GET RETURN TRACKING EVENTS BY SHIPMENT ID
const getReturnTrackingEventsByShipmentId = async (
  returnShipmentId,
  options = {}
) => {
  return await ReturnTrackingEvent.findAll({
    where: { returnShipmentId },
    order: [
      ["eventAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// GET LATEST RETURN TRACKING EVENT
const getLatestReturnTrackingEvent = async (
  returnShipmentId,
  options = {}
) => {
  return await ReturnTrackingEvent.findOne({
    where: { returnShipmentId },
    order: [
      ["eventAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// GET TRACKING EVENT BY PROVIDER EVENT ID
const getReturnTrackingEventByProviderEventId = async (
  returnShipmentId,
  providerEventId,
  options = {}
) => {
  if (!providerEventId) {
    return null;
  }

  return await ReturnTrackingEvent.findOne({
    where: {
      returnShipmentId,
      providerEventId,
    },
    ...options,
  });
};

// CHECK DUPLICATE RETURN TRACKING EVENT
const getDuplicateReturnTrackingEvent = async (
  {
    returnShipmentId,
    status,
    eventAt,
    location,
    description,
  },
  options = {}
) => {
  return await ReturnTrackingEvent.findOne({
    where: {
      returnShipmentId,
      status,
      eventAt,
      location: location || null,
      description: description || null,
    },
    ...options,
  });
};

/* =========================================================
   TRANSACTION HELPER
========================================================= */

const withTransaction = async (
  callback,
  options = {}
) => {
  if (options.transaction) {
    return await callback(options.transaction);
  }

  return await sequelize.transaction(async (transaction) => {
    return await callback(transaction);
  });
};

// GET RESERVED RETURN REFUND AMOUNT FOR A PAYMENT
const getReservedReturnRefundAmountByPaymentId = async (
  paymentId,
  transaction
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to calculate reserved refunds."
    );
  }

  const amount = await ReturnRefund.sum("refundAmount", {
    where: {
      paymentId,
      status: {
        [Op.in]: [
          "PENDING",
          "PROCESSING",
          "INITIATED",
        ],
      },
    },
    transaction,
  });

  return Number(amount || 0);
};
/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  RETURN_REQUEST_STATUSES,

    // Return Shipments
  getReturnShipmentByReturnRequestId,
  getReturnShipmentById,
  getReturnShipmentByUuid,
  getReturnShipmentByIdForUpdate,
  getReturnShipmentByShiprocketShipmentId,
  getReturnShipmentByAwbNumber,
  createReturnShipment,
  updateReturnShipment,
  getPaymentByIdForUpdate,
// Return Refunds
createReturnRefund,
getReturnRefundByReturnRequestId,
getReturnRefundByReturnRequestIdForUpdate,
getReturnRefundByIdForUpdate,
getDueReturnRefundsForUpdate,
updateReturnRefund,
getReservedReturnRefundAmountByPaymentId,

  // Return Tracking Events
  createReturnTrackingEvent,
  createReturnTrackingEvents,
  getReturnTrackingEventsByShipmentId,
  getLatestReturnTrackingEvent,
  getReturnTrackingEventByProviderEventId,
  getDuplicateReturnTrackingEvent,

  getReturnRequestById,
  getReturnRequestByUuid,
  getReturnRequestByNumber,

  getReturnRequestByIdForUpdate,
  getReturnRequestByUuidForUpdate,

  getReturnRequests,
  getReturnRequestDetailsByUuid,
  getReturnRequestDetailsById,

  getReturnRequestsByOrderId,
  getReturnRequestsByUserId,
  getReturnRequestsByStatus,

  createReturnRequest,
  updateReturnRequest,
  updateReturnRequestStatus,

  getReturnStatusCounts,
  getReturnRequestCountByStatus,

  deleteReturnRequest,

  withTransaction,
};
