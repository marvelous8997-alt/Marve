
"use strict";

const { Op, fn, col, literal } = require("sequelize");

const {
  User,
  Order,
  CheckoutAddress,
} = require("../../database/models");

/* =========================================================
   FIND CUSTOMER BY ID
========================================================= */

const findById = async (id, transaction = null) => {
  return await User.findByPk(id, {
    transaction,
  });
};

/* =========================================================
   FIND CUSTOMER BY EMAIL
========================================================= */

const findByEmail = async (email, transaction = null) => {
  return await User.findOne({
    where: {
      email: String(email || "").trim().toLowerCase(),
    },
    transaction,
  });
};

/* =========================================================
   GET CUSTOMERS WITH SEARCH, FILTERS & PAGINATION
========================================================= */

const getCustomers = async ({
  page = 1,
  limit = 8,
  search = "",
  status,
  sortBy = "createdAt",
  sortOrder = "DESC",
} = {}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.min(100, Math.max(1, Number(limit) || 8));

  const offset = (page - 1) * limit;
  const where = {};
  const searchTerm = String(search || "").trim();

  /* Search by name, email or phone. */
  if (searchTerm) {
    where[Op.or] = [
      {
        firstName: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        lastName: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        email: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        phone: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    ];
  }

  /* Status filter. */
  if (status) {
    where.status = status;
  }

  const allowedSortFields = [
    "firstName",
    "lastName",
    "email",
    "status",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "createdAt";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  const result = await User.findAndCountAll({
    where,
    offset,
    limit,
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
  });

  const customers = result.rows;
  const customerIds = customers.map((customer) => customer.id);

  /* Fetch order statistics only for the current page. */
  const statistics = await getCustomerOrderStats(customerIds);

  const rows = customers.map((customer) => {
    const data =
      typeof customer.toJSON === "function"
        ? customer.toJSON()
        : customer;

    const stats = statistics[String(data.id)] || {};

    return {
      ...data,
      totalOrders: Number(stats.totalOrders || 0),
      completedOrders: Number(stats.completedOrders || 0),
      cancelledOrders: Number(stats.cancelledOrders || 0),
      totalSpent: Number(stats.totalSpent || 0),
    };
  });

  return {
    count: result.count,
    rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  };
};

/* =========================================================
   CUSTOMER ORDER STATISTICS
========================================================= */

const getCustomerOrderStats = async (
  customerIds,
  transaction = null
) => {
  if (!Array.isArray(customerIds) || customerIds.length === 0) {
    return {};
  }

  const rows = await Order.findAll({
    attributes: [
      "userId",

      [
        fn("COUNT", col("id")),
        "totalOrders",
      ],

      [
        fn(
          "SUM",
          literal(
            "CASE WHEN `orderStatus` = 'DELIVERED' THEN 1 ELSE 0 END"
          )
        ),
        "completedOrders",
      ],

      [
        fn(
          "SUM",
          literal(
            "CASE WHEN `orderStatus` = 'CANCELLED' THEN 1 ELSE 0 END"
          )
        ),
        "cancelledOrders",
      ],

      [
        fn(
          "SUM",
          literal(
            "CASE WHEN `orderStatus` = 'DELIVERED' THEN `totalAmount` ELSE 0 END"
          )
        ),
        "totalSpent",
      ],
    ],

    where: {
      userId: {
        [Op.in]: customerIds,
      },
    },

    group: ["userId"],
    raw: true,
    transaction,
  });

  const statistics = {};

  for (const row of rows) {
    statistics[String(row.userId)] = {
      totalOrders: Number(row.totalOrders || 0),
      completedOrders: Number(row.completedOrders || 0),
      cancelledOrders: Number(row.cancelledOrders || 0),
      totalSpent: Number(row.totalSpent || 0),
    };
  }

  return statistics;
};

/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

const updateCustomerStatus = async (
  customer,
  status,
  transaction = null
) => {
  return await customer.update(
    { status },
    { transaction }
  );
};

/* =========================================================
   COUNT CUSTOMER ORDERS
========================================================= */

const countCustomerOrders = async (
  userId,
  transaction = null
) => {
  return await Order.count({
    where: { userId },
    transaction,
  });
};

/* =========================================================
   GET CUSTOMER DELIVERY ADDRESS
========================================================= */

const getCustomerDeliveryAddress = async (
  userId,
  transaction = null
) => {
  const address = await CheckoutAddress.findOne({
    where: {
      userId,
    },
    order: [
      ["isDefault", "DESC"],
      ["updatedAt", "DESC"],
      ["id", "DESC"],
    ],
    transaction,
  });

  if (!address) {
    return null;
  }

  const data =
    typeof address.toJSON === "function"
      ? address.toJSON()
      : address;

  return {
    fullName: data.fullName || "",
    phone: data.phone || null,
    email: data.email || null,
    pincode: data.pincode || "",
    houseNumber: data.houseNumber || "",
    address: data.address || "",
    locality: data.locality || "",
    landmark: data.landmark || null,
    city: data.city || "",
    state: data.state || "",
    addressType: data.addressType || "HOME",
    isDefault: Boolean(data.isDefault),
  };
};

/* =========================================================
   CUSTOMER STATUS COUNTS
========================================================= */

const getCustomerStatusCounts = async () => {
  const [total, active, inactive, blocked] = await Promise.all([
    User.count(),
    User.count({ where: { status: "ACTIVE" } }),
    User.count({ where: { status: "INACTIVE" } }),
    User.count({ where: { status: "BLOCKED" } }),
  ]);

  return {
    ALL: total,
    ACTIVE: active,
    INACTIVE: inactive,
    BLOCKED: blocked,
  };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  findById,
  findByEmail,
  getCustomers,
  getCustomerOrderStats,
  getCustomerDeliveryAddress,
  updateCustomerStatus,
  countCustomerOrders,
  getCustomerStatusCounts,
};