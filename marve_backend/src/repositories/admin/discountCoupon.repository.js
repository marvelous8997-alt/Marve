
"use strict";

const { Op } = require("sequelize");
const { DiscountCoupon } = require("../../database/models");

const getTodayDateString = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

// Create Discount Coupon
const createDiscountCoupon = async (payload, transaction) => {
  return await DiscountCoupon.create(payload, {
    transaction,
  });
};

// Find By ID
const findById = async (id, transaction) => {
  return await DiscountCoupon.findByPk(id, {
    transaction,
  });
};

// Find By UUID
const findByUuid = async (uuid, transaction) => {
  return await DiscountCoupon.findOne({
    where: { uuid },
    transaction,
  });
};

// Find By Coupon Code
const findByCode = async (code, transaction) => {
  return await DiscountCoupon.findOne({
    where: {
      code: String(code || "").trim().toUpperCase().replace(/\s+/g, ""),
    },
    transaction,
  });
};

// Update Discount Coupon
const updateDiscountCoupon = async (
  discountCoupon,
  payload,
  transaction
) => {
  return await discountCoupon.update(payload, {
    transaction,
  });
};

// Update Discount Coupon Status
const updateDiscountCouponStatus = async (
  uuid,
  status,
  userId,
  transaction
) => {
  const discountCoupon = await DiscountCoupon.findOne({
    where: { uuid },
    transaction,
  });

  if (!discountCoupon) {
    return null;
  }

  return await discountCoupon.update(
    {
      status,
      updated_by: userId,
    },
    {
      transaction,
    }
  );
};

// Delete Discount Coupon
const deleteDiscountCoupon = async (
  discountCoupon,
  transaction
) => {
  return await discountCoupon.destroy({
    transaction,
  });
};

// Get Discount Coupons
const getDiscountCoupons = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  discountType,
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
      {
        code: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        name: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        description: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    ];
  }


const today = getTodayDateString();

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

  where[Op.and] = [
    {
      start_date: {
        [Op.gt]: today,
      },
    },
    {
      [Op.or]: [
        { end_date: null },
        { end_date: { [Op.gte]: today } },
      ],
    },
  ];
}

  if (
    discountType &&
    ["PERCENTAGE", "FIXED"].includes(discountType)
  ) {
    where.discount_type = discountType;
  }

  const allowedSortFields = [
    "code",
    "name",
    "discount_type",
    "discount_value",
    "minimum_order_value",
    "usage_count",
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
    String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

  const result = await DiscountCoupon.findAndCountAll({
    where,
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

// Get All Active Discount Coupons For Dropdown
const getActiveDiscountCouponsForDropdown = async () => {
  return await DiscountCoupon.findAll({
    where: {
      status: "ACTIVE",
    },
    attributes: [
      "id",
      "uuid",
      "code",
      "name",
      "discount_type",
      "discount_value",
      "status",
    ],
    order: [
      ["sort_order", "ASC"],
      ["name", "ASC"],
    ],
  });
};

module.exports = {
  createDiscountCoupon,
  findById,
  findByUuid,
  findByCode,
  updateDiscountCoupon,
  updateDiscountCouponStatus,
  deleteDiscountCoupon,
  getDiscountCoupons,
  getActiveDiscountCouponsForDropdown,
};
