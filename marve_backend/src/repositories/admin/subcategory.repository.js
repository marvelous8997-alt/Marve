"use strict";

const { Op } = require("sequelize");
const {
  Subcategory,
  Category,
} = require("../../database/models");

// Create Subcategory
const createSubcategory = async (payload, transaction) => {
  return await Subcategory.create(payload, {
    transaction,
  });
};

// Find By ID
const findById = async (id) => {
  return await Subcategory.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "uuid", "name", "slug"],
      },
    ],
  });
};

// Find By UUID
const findByUuid = async (uuid) => {
  return await Subcategory.findOne({
    where: { uuid },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "uuid", "name", "slug"],
      },
    ],
  });
};

// Find By Name
const findByName = async (name, categoryId = null) => {
  const where = { name };

  if (categoryId !== null) {
    where.category_id = categoryId;
  }

  return await Subcategory.findOne({
    where,
  });
};

// Find By Slug
const findBySlug = async (slug) => {
  return await Subcategory.findOne({
    where: { slug },
  });
};

// Update Subcategory
const updateSubcategory = async (
  subcategory,
  payload,
  transaction
) => {
  return await subcategory.update(payload, {
    transaction,
  });
};

// Update Subcategory Status
const updateSubcategoryStatus = async (uuid, status, userId) => {
  const subcategory = await Subcategory.findOne({
    where: { uuid },
  });

  if (!subcategory) {
    return null;
  }

  return await subcategory.update({
    status,
    updated_by: userId,
  });
};

// Delete Subcategory
const deleteSubcategory = async (subcategory, transaction) => {
  return await subcategory.destroy({
    transaction,
  });
};

// Get Subcategories
const getSubcategories = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  categoryId,
  sortBy = "sort_order",
  sortOrder = "ASC",
}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;
  const where = {};

  // Search by subcategory name or slug
  if (search.trim()) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search.trim()}%`,
        },
      },
      {
        slug: {
          [Op.like]: `%${search.trim()}%`,
        },
      },
    ];
  }

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Filter by parent category
  if (categoryId !== undefined && categoryId !== null && categoryId !== "") {
    where.category_id = categoryId;
  }

  const allowedSortFields = [
    "name",
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

  const result = await Subcategory.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "uuid", "name", "slug", "status"],
        required: false,
      },
    ],
    distinct: true,
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

module.exports = {
  createSubcategory,
  findById,
  findByUuid,
  findByName,
  findBySlug,
  updateSubcategory,
  updateSubcategoryStatus,
  deleteSubcategory,
  getSubcategories,
};