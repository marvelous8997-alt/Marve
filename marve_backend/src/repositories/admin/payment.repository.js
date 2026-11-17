"use strict";

const { Op } = require("sequelize");

const {
  Payment,
  Order,
  User,
} = require("../../database/models");

/* =========================================================
   CONSTANTS
========================================================= */

const ALLOWED_SORT_FIELDS = [
  "paymentNumber",
  "amount",
  "status",
  "method",
  "provider",
  "createdAt",
  "updatedAt",
  "capturedAt",
];

const PAYMENT_STATUSES = [
  "CREATED",
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

const PAYMENT_METHODS = [
  "ONLINE",
  "COD",
  "UPI",
  "CARD",
  "NETBANKING",
  "WALLET",
  "EMI",
  "OTHER",
];

/* =========================================================
   COMMON INCLUDES
========================================================= */

const getPaymentIncludes = () => [
  {
    model: Order,
    as: "order",
    required: false,
    include: [
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
    ],
  },
];

/* =========================================================
   FIND PAYMENT BY ID
========================================================= */

const findById = async (id, transaction = null) => {
  return Payment.findByPk(id, {
    transaction,
    include: getPaymentIncludes(),
  });
};

/* =========================================================
   FIND PAYMENT BY UUID
========================================================= */

const findByUuid = async (uuid, transaction = null) => {
  return Payment.findOne({
    where: { uuid },
    transaction,
    include: getPaymentIncludes(),
  });
};

/* =========================================================
   FIND PAYMENT BY PAYMENT NUMBER
========================================================= */

const findByPaymentNumber = async (
  paymentNumber,
  transaction = null
) => {
  return Payment.findOne({
    where: { paymentNumber },
    transaction,
    include: getPaymentIncludes(),
  });
};

/* =========================================================
   FIND PAYMENT BY RAZORPAY PAYMENT ID
========================================================= */

const findByRazorpayPaymentId = async (
  razorpayPaymentId,
  transaction = null
) => {
  return Payment.findOne({
    where: { razorpayPaymentId },
    transaction,
  });
};

/* =========================================================
   GET PAYMENTS WITH SEARCH, FILTERS & PAGINATION
========================================================= */

const getPayments = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  method,
  provider,
  dateFrom,
  dateTo,
  sortBy = "createdAt",
  sortOrder = "DESC",
} = {}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.min(100, Math.max(1, Number(limit) || 10));

  const offset = (page - 1) * limit;
  const where = {};
  const andConditions = [];

  const searchTerm = String(search || "").trim();

  if (searchTerm) {
    andConditions.push({
      [Op.or]: [
        {
          paymentNumber: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          razorpayOrderId: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          razorpayPaymentId: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$order.orderNumber$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$order.deliveryFullName$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$order.deliveryEmail$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          "$order.deliveryPhone$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ],
    });
  }

const normalizedStatus = String(status || "").toUpperCase();

if (normalizedStatus === "PAID") {
  where.status = "CAPTURED";
} else if (PAYMENT_STATUSES.includes(normalizedStatus)) {
  where.status = normalizedStatus;
}

  if (
    method &&
    PAYMENT_METHODS.includes(String(method).toUpperCase())
  ) {
    where.method = String(method).toUpperCase();
  }

  if (provider) {
    const normalizedProvider = String(provider).toUpperCase();

    if (["RAZORPAY", "COD"].includes(normalizedProvider)) {
      where.provider = normalizedProvider;
    }
  }

  /* Date range filter */

  if (dateFrom || dateTo) {
    const createdAt = {};

    if (dateFrom) {
      const fromDate = new Date(dateFrom);

      if (!Number.isNaN(fromDate.getTime())) {
        fromDate.setHours(0, 0, 0, 0);
        createdAt[Op.gte] = fromDate;
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);

      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        createdAt[Op.lte] = toDate;
      }
    }

    if (Object.keys(createdAt).length > 0) {
      where.createdAt = createdAt;
    }
  }

  if (andConditions.length > 0) {
    where[Op.and] = andConditions;
  }

  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    sortBy = "createdAt";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const result = await Payment.findAndCountAll({
    where,
    include: getPaymentIncludes(),
    distinct: true,
    col: "id",
    offset,
    limit,
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
  });

  return {
    count: result.count,
    rows: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  };
};

/* =========================================================
   UPDATE PAYMENT
========================================================= */

const updatePayment = async (
  payment,
  payload,
  transaction = null
) => {
  return payment.update(payload, { transaction });
};

/* =========================================================
   PAYMENT STATUS COUNTS
========================================================= */

const getPaymentStatusCounts = async () => {
  const counts = await Promise.all(
    PAYMENT_STATUSES.map(async (status) => {
      const count = await Payment.count({
        where: { status },
      });

      return [status, count];
    })
  );

  const result = Object.fromEntries(counts);

  result.ALL = Object.values(result).reduce(
    (total, count) => total + count,
    0
  );

  return result;
};

/* =========================================================
   PAYMENT SUMMARY
========================================================= */

const getPaymentSummary = async () => {
  const [
    totalPayments,
    capturedPayments,
    pendingPayments,
    failedPayments,
    refundedPayments,
    partiallyRefundedPayments,
  ] = await Promise.all([
    Payment.count(),

    Payment.count({
      where: { status: "CAPTURED" },
    }),

    Payment.count({
      where: {
        status: {
          [Op.in]: ["CREATED", "PENDING", "AUTHORIZED"],
        },
      },
    }),

    Payment.count({
      where: { status: "FAILED" },
    }),

    Payment.count({
      where: { status: "REFUNDED" },
    }),

    Payment.count({
      where: { status: "PARTIALLY_REFUNDED" },
    }),
  ]);

  return {
    totalPayments,
    capturedPayments,
    pendingPayments,
    failedPayments,
    refundedPayments,
    partiallyRefundedPayments,
  };
};

/* =========================================================
   REFUND AMOUNT HELPERS
========================================================= */

const getTotalCapturedAmount = async () => {
  const result = await Payment.sum("amount", {
    where: { status: "CAPTURED" },
  });

  return Number(result || 0);
};

const getTotalRefundedAmount = async () => {
  const result = await Payment.sum("refundedAmount");

  return Number(result || 0);
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  findById,
  findByUuid,
  findByPaymentNumber,
  findByRazorpayPaymentId,
  getPayments,
  updatePayment,
  getPaymentStatusCounts,
  getPaymentSummary,
  getTotalCapturedAmount,
  getTotalRefundedAmount,
};
