
"use strict";

const { Op } = require("sequelize");

const {
  Favourite,
  User,
  Product,
  Category,
  ProductImage,
} = require("../../database/models");

/* ========================= Helpers ========================= */

// Build associations used by admin favourite queries.
const getFavouriteIncludes = () => [
{
  model: User,
  as: "user",
  attributes: [
    "id",
    "firstName",
    "lastName",
    "email",
    "phone",
  ],
  required: false,
},
  {
    model: Product,
    as: "product",
    attributes: [
      "id",
      "uuid",
      "name",
      "sku",
      "price",
      "category_id",
    ],
    required: false,
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name", "slug"],
        required: false,
      },
      {
        model: ProductImage,
        as: "images",
        attributes: [
          "id",
          "image_url",
          "is_primary",
          "sort_order",
        ],
        required: false,
      },
    ],
  },
];

/* ========================= Find Favourite By ID ========================= */

const findById = async (id) => {
  return await Favourite.findByPk(id, {
    include: getFavouriteIncludes(),
  });
};

/* ========================= Find Favourite By UUID ========================= */

const findByUuid = async (uuid) => {
  return await Favourite.findOne({
    where: { uuid },
    include: getFavouriteIncludes(),
  });
};

/* ========================= Get Favourites ========================= */

const getFavourites = async ({
  page = 1,
  limit = 8,
  search = "",
  category,
  sortBy = "createdAt",
  sortOrder = "DESC",
} = {}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 8);

  const offset = (page - 1) * limit;
  const where = {};

  const searchTerm = String(search || "").trim();

if (searchTerm) {
  where[Op.or] = [
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
    {
      "$product.name$": {
        [Op.like]: `%${searchTerm}%`,
      },
    },
    {
      "$product.sku$": {
        [Op.like]: `%${searchTerm}%`,
      },
    },
  ];
}

  if (category) {
    where["$product.category.name$"] = category;
  }

  const allowedSortFields = [
    "id",
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

try {
  const result = await Favourite.findAndCountAll({
    where,
    include: getFavouriteIncludes(),
    distinct: true,
    subQuery: false,
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
} catch (error) {
  console.error("Favourite list SQL error:", {
    message: error.message,
    sqlMessage:
      error.original?.sqlMessage ||
      error.parent?.sqlMessage,
    sql: error.sql || error.original?.sql,
  });

  throw error;
}
};

/* ========================= Exports ========================= */

module.exports = {
  findById,
  findByUuid,
  getFavourites,
};
