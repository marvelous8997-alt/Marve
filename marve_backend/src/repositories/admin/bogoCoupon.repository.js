
"use strict";

const { Op } = require("sequelize");

const {
  BogoCoupon,
  BogoCouponBuyProduct,
  BogoCouponGetProduct,
  Product,
} = require("../../database/models");

// Normalize BOGO Coupon Code
const normalizeCode = (code) => {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
};

// Common includes for Buy and Get Products
const getBogoCouponIncludes = () => [
  {
    model: BogoCouponBuyProduct,
    as: "buyProducts",
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
  },
  {
    model: BogoCouponGetProduct,
    as: "getProducts",
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
  },
];

// Create BOGO Coupon
const createBogoCoupon = async (payload, transaction) => {
  return await BogoCoupon.create(payload, {
    transaction,
  });
};

// Find BOGO Coupon By ID
const findById = async (id, transaction) => {
  return await BogoCoupon.findByPk(id, {
    transaction,
  });
};

// Find BOGO Coupon By UUID
const findByUuid = async (uuid, transaction) => {
  return await BogoCoupon.findOne({
    where: { uuid },
    transaction,
  });
};

// Find BOGO Coupon By Code
const findByCode = async (code, transaction) => {
  return await BogoCoupon.findOne({
    where: {
      code: normalizeCode(code),
    },
    transaction,
  });
};

// Find BOGO Coupon By UUID With Buy/Get Products
const findByUuidWithProducts = async (uuid, transaction) => {
  return await BogoCoupon.findOne({
    where: { uuid },
    include: getBogoCouponIncludes(),
    transaction,
  });
};

// Update BOGO Coupon
const updateBogoCoupon = async (
  bogoCoupon,
  payload,
  transaction
) => {
  return await bogoCoupon.update(payload, {
    transaction,
  });
};

// Update BOGO Coupon Status
const updateBogoCouponStatus = async (
  uuid,
  status,
  userId,
  transaction
) => {
  const bogoCoupon = await BogoCoupon.findOne({
    where: { uuid },
    transaction,
  });

  if (!bogoCoupon) {
    return null;
  }

  return await bogoCoupon.update(
    {
      status,
      updated_by: userId,
    },
    {
      transaction,
    }
  );
};

// Delete BOGO Coupon
const deleteBogoCoupon = async (
  bogoCoupon,
  transaction
) => {
  return await bogoCoupon.destroy({
    transaction,
  });
};

// Get BOGO Coupons With Search, Filters, Sorting and Pagination

const getBogoCoupons = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  sortBy = "sort_order",
  sortOrder = "ASC",
} = {}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;
  const where = {};

  const searchTerm =
    typeof search === "string" ? search.trim() : "";

  if (searchTerm) {
    where[Op.or] = [
      { code: { [Op.like]: `%${searchTerm}%` } },
      { name: { [Op.like]: `%${searchTerm}%` } },
      { description: { [Op.like]: `%${searchTerm}%` } },
    ];
  }


  const today = new Date().toLocaleDateString("en-CA");

  if (status === "ACTIVE") {
    where.status = "ACTIVE";
    where[Op.and] = [
      {
        [Op.or]: [
          { start_date: null },
          { start_date: { [Op.lte]: today } },
        ],
      },
      {
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gte]: today } },
        ],
      },
    ];
  } else if (status === "INACTIVE") {
    where.status = "INACTIVE";
    where[Op.and] = [
      {
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gte]: today } },
        ],
      },
    ];
  } else if (status === "EXPIRED") {
    where.end_date = {
      [Op.lt]: today,
    };
  } else if (status === "SCHEDULED") {
    where.status = "ACTIVE";
    where.start_date = {
      [Op.gt]: today,
    };
    where[Op.or] = [
      { end_date: null },
      { end_date: { [Op.gte]: today } },
    ];
  }


  const allowedSortFields = [
    "code",
    "name",
    "buy_quantity",
    "get_quantity",
    "minimum_order_value",
    "usage_limit",
    "per_customer_limit",
    "start_date",
    "end_date",
    "status",
    "sort_order",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "sort_order";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "DESC"
      ? "DESC"
      : "ASC";

  const result = await BogoCoupon.findAndCountAll({
    where,
    include: getBogoCouponIncludes(),
    offset,
    limit,
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
    distinct: true,
    subQuery: false,
  });

  return {
    count: result.count,
    rows: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  };
};


// Get All Active BOGO Coupons For Dropdown
const getActiveBogoCouponsForDropdown = async () => {
  return await BogoCoupon.findAll({
    where: {
      status: "ACTIVE",
    },
    attributes: [
      "id",
      "uuid",
      "code",
      "name",
      "description",
      "buy_quantity",
      "get_quantity",
      "minimum_order_value",
      "start_date",
      "end_date",
      "status",
    ],
    order: [
      ["sort_order", "ASC"],
      ["name", "ASC"],
    ],
  });
};

// Replace Buy Products For A BOGO Coupon
const replaceBuyProducts = async (
  bogoCouponId,
  productIds = [],
  transaction
) => {
  await BogoCouponBuyProduct.destroy({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    transaction,
  });

  const uniqueProductIds = [
    ...new Set(
      productIds
        .map((id) => Number(id))
        .filter((id) => Number.isSafeInteger(id) && id > 0)
    ),
  ];

  if (uniqueProductIds.length === 0) {
    return [];
  }

  return await BogoCouponBuyProduct.bulkCreate(
    uniqueProductIds.map((productId) => ({
      bogo_coupon_id: bogoCouponId,
      product_id: productId,
    })),
    {
      transaction,
    }
  );
};

// Replace Get Products For A BOGO Coupon
const replaceGetProducts = async (
  bogoCouponId,
  productIds = [],
  transaction
) => {
  await BogoCouponGetProduct.destroy({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    transaction,
  });

  const uniqueProductIds = [
    ...new Set(
      productIds
        .map((id) => Number(id))
        .filter((id) => Number.isSafeInteger(id) && id > 0)
    ),
  ];

  if (uniqueProductIds.length === 0) {
    return [];
  }

  return await BogoCouponGetProduct.bulkCreate(
    uniqueProductIds.map((productId) => ({
      bogo_coupon_id: bogoCouponId,
      product_id: productId,
    })),
    {
      transaction,
    }
  );
};

// Get Buy Products For A BOGO Coupon
const getBuyProducts = async (bogoCouponId, transaction) => {
  return await BogoCouponBuyProduct.findAll({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
    transaction,
  });
};

// Get Get Products For A BOGO Coupon
const getGetProducts = async (bogoCouponId, transaction) => {
  return await BogoCouponGetProduct.findAll({
    where: {
      bogo_coupon_id: bogoCouponId,
    },
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
    transaction,
  });
};

module.exports = {
  normalizeCode,
  createBogoCoupon,
  findById,
  findByUuid,
  findByCode,
  findByUuidWithProducts,
  updateBogoCoupon,
  updateBogoCouponStatus,
  deleteBogoCoupon,
  getBogoCoupons,
  getActiveBogoCouponsForDropdown,
  replaceBuyProducts,
  replaceGetProducts,
  getBuyProducts,
  getGetProducts,
};
