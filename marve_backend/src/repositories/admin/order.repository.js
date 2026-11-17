
"use strict";

const { Op, literal } = require("sequelize");

const {
  Order,
  OrderItem,
  User,
  CheckoutAddress,
  Payment,
  Product,
  ProductVariation,
  Shipment,
} = require("../../database/models");

/* =========================================================
   FIND ORDER BY ID
========================================================= */

const findById = async (id, transaction = null) => {
  return await Order.findByPk(id, {
    transaction,
    include: [
      {
        model: User,
        as: "user",
        required: false,
      },
      {
        model: CheckoutAddress,
        as: "checkoutAddress",
        required: false,
      },
{
  model: OrderItem,
  as: "items",
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
      {
        model: Payment,
        as: "payments",
        required: false,
      },
    ],
    order: [
      [{ model: OrderItem, as: "items" }, "id", "ASC"],
    ],
  });
};

/* =========================================================
   FIND ORDER BY UUID
========================================================= */

const findByUuid = async (uuid) => {
  return await Order.findOne({
    where: { uuid },
    include: [
      {
        model: User,
        as: "user",
        required: false,
      },
      {
        model: CheckoutAddress,
        as: "checkoutAddress",
        required: false,
      },
      {
        model: OrderItem,
        as: "items",
        required: false,
      },
      {
        model: Payment,
        as: "payments",
        required: false,
      },
    ],
    order: [
      [{ model: OrderItem, as: "items" }, "id", "ASC"],
    ],
  });
};

/* =========================================================
   FIND ORDER BY ORDER NUMBER
========================================================= */

const findByOrderNumber = async (orderNumber) => {
  return await Order.findOne({
    where: { orderNumber },
    include: [
      {
        model: OrderItem,
        as: "items",
        required: false,
      },
    ],
  });
};

/* =========================================================
   GET ORDERS WITH SEARCH, FILTERS & PAGINATION
========================================================= */

const getOrders = async ({
  page = 1,
  limit = 10,
  search = "",
  orderNumber = "",
  customer = "",
  phone = "",
  product = "",
  orderStatus,
  paymentStatus,
  paymentMethod,
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
  const orderNumberTerm = String(orderNumber || "").trim();
  const customerTerm = String(customer || "").trim();
  const phoneTerm = String(phone || "").trim();
  const productTerm = String(product || "").trim();

  // General search: order number, customer, phone, product.
  if (searchTerm) {
    andConditions.push({
      [Op.or]: [
        { orderNumber: { [Op.like]: `%${searchTerm}%` } },
        { deliveryFullName: { [Op.like]: `%${searchTerm}%` } },
        { deliveryPhone: { [Op.like]: `%${searchTerm}%` } },
        { deliveryEmail: { [Op.like]: `%${searchTerm}%` } },
      ],
    });
  }

  if (orderNumberTerm) {
    where.orderNumber = {
      [Op.like]: `%${orderNumberTerm}%`,
    };
  }

  if (customerTerm) {
    andConditions.push({
      [Op.or]: [
        { deliveryFullName: { [Op.like]: `%${customerTerm}%` } },
        { deliveryEmail: { [Op.like]: `%${customerTerm}%` } },
      ],
    });
  }

  if (phoneTerm) {
    where.deliveryPhone = {
      [Op.like]: `%${phoneTerm}%`,
    };
  }

  if (orderStatus) {
    where.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }

  if (paymentMethod) {
    where.paymentMethod = paymentMethod;
  }

  // Date range filter.
  if (dateFrom || dateTo) {
    where.createdAt = {};

    if (dateFrom) {
      const fromDate = new Date(dateFrom);

      if (!Number.isNaN(fromDate.getTime())) {
        fromDate.setHours(0, 0, 0, 0);
        where.createdAt[Op.gte] = fromDate;
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);

      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = toDate;
      }
    }

    if (!Object.keys(where.createdAt).length) {
      delete where.createdAt;
    }
  }

  if (andConditions.length) {
    where[Op.and] = andConditions;
  }

  const include = [
    {
      model: User,
      as: "user",
      required: false,
    },
    {
      model: OrderItem,
      as: "items",
      required: Boolean(productTerm),
      where: productTerm
        ? {
            [Op.or]: [
              { productName: { [Op.like]: `%${productTerm}%` } },
              { productSku: { [Op.like]: `%${productTerm}%` } },
              { variationName: { [Op.like]: `%${productTerm}%` } },
              { variationSku: { [Op.like]: `%${productTerm}%` } },
            ],
          }
        : undefined,
    },
    {
  model: Shipment,
  as: "shipments",
  required: false,
  attributes: [
    "id",
    "uuid",
    "status",
    "awbNumber",
    "trackingNumber",
    "courierName",
    "createdAt",
  ],
},
  ];

  const allowedSortFields = [
    "orderNumber",
    "subtotal",
    "totalAmount",
    "orderStatus",
    "paymentStatus",
    "paymentMethod",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "createdAt";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const result = await Order.findAndCountAll({
    where,
    include,
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
   UPDATE ORDER
========================================================= */

const updateOrder = async (order, payload, transaction = null) => {
  return await order.update(payload, {
    transaction,
  });
};

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

const updateOrderStatus = async (
  order,
  orderStatus,
  transaction = null
) => {
  const payload = { orderStatus };

  if (orderStatus === "CANCELLED" && !order.cancelledAt) {
    payload.cancelledAt = new Date();
  }

  return await order.update(payload, {
    transaction,
  });
};

/* =========================================================
   DELETE ORDER
========================================================= */

const deleteOrder = async (order, transaction = null) => {
  return await order.destroy({
    transaction,
  });
};

/* =========================================================
   ORDER STATUS COUNTS
========================================================= */

const getOrderStatusCounts = async () => {
  const statuses = [
    "PENDING_PAYMENT",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURNED",
  ];

  const counts = await Promise.all(
    statuses.map(async (status) => {
      const count = await Order.count({
        where: { orderStatus: status },
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
   FIND ORDER BY ID FOR UPDATE
========================================================= */

const findByIdForUpdate = async (id, transaction) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to lock an order."
    );
  }

  return await Order.findByPk(id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
    include: [
      {
        model: User,
        as: "user",
        required: false,
      },
      {
        model: CheckoutAddress,
        as: "checkoutAddress",
        required: false,
      },
{
  model: OrderItem,
  as: "items",
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
      {
        model: Payment,
        as: "payments",
        required: false,
      },
    ],
    order: [
      [{ model: OrderItem, as: "items" }, "id", "ASC"],
    ],
  });
};

/* =========================================================
   FIND ORDER BY UUID FOR UPDATE
========================================================= */

const findByUuidForUpdate = async (uuid, transaction) => {
  if (!transaction) {
    throw new Error("Transaction is required to lock an order.");
  }

  return await Order.findOne({
    where: { uuid },
    transaction,
    lock: transaction.LOCK.UPDATE,
    include: [
      {
        model: User,
        as: "user",
        required: false,
      },
      {
        model: CheckoutAddress,
        as: "checkoutAddress",
        required: false,
      },
      {
        model: OrderItem,
        as: "items",
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
      {
        model: Payment,
        as: "payments",
        required: false,
      },
    ],
    order: [
      [{ model: OrderItem, as: "items" }, "id", "ASC"],
    ],
  });
};

/* =========================================================
   RESTORE ORDER ITEM STOCK
========================================================= */

const restoreOrderItemStock = async (
  productId,
  productVariationId,
  quantity,
  transaction = null
) => {
  if (!transaction) {
    throw new Error(
      "Transaction is required to restore order item stock."
    );
  }

  const validProductId = Number(productId);
  const validQuantity = Number(quantity);

  if (
    !Number.isSafeInteger(validProductId) ||
    validProductId < 1
  ) {
    throw new Error("Invalid product ID.");
  }

  if (
    !Number.isSafeInteger(validQuantity) ||
    validQuantity < 1
  ) {
    throw new Error("Invalid stock quantity.");
  }

  // Restore variation stock.
  if (
    productVariationId !== null &&
    productVariationId !== undefined
  ) {
    const validVariationId = Number(productVariationId);

    if (
      !Number.isSafeInteger(validVariationId) ||
      validVariationId < 1
    ) {
      throw new Error("Invalid product variation ID.");
    }

    const [updatedRows] = await ProductVariation.update(
      {
        stock: literal(`stock + ${validQuantity}`),
      },
      {
        where: {
          id: validVariationId,
          product_id: validProductId,
        },
        transaction,
      }
    );

    if (updatedRows !== 1) {
      throw new Error(
        `Unable to restore stock for product variation ${validVariationId}.`
      );
    }

    return true;
  }

  // Restore main product stock.
  const [updatedRows] = await Product.update(
    {
      stock: literal(`stock + ${validQuantity}`),
    },
    {
      where: {
        id: validProductId,
      },
      transaction,
    }
  );

  if (updatedRows !== 1) {
    throw new Error(
      `Unable to restore stock for product ${validProductId}.`
    );
  }

  return true;
};
/* =========================================================
   EXPORTS
========================================================= */

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  findById,
  findByIdForUpdate,

  findByUuid,
  findByUuidForUpdate,

  findByOrderNumber,
  getOrders,

  updateOrder,
  updateOrderStatus,

  restoreOrderItemStock,

  deleteOrder,
  getOrderStatusCounts,
};