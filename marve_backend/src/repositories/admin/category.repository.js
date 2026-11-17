"use strict";

const { Op } = require("sequelize");
const { Category } = require("../../database/models");

// Create Category
const createCategory = async (payload, transaction) => {
  return await Category.create(payload, {
    transaction,
  });
};

// Find By ID
const findById = async (id) => {
  return await Category.findByPk(id);
};

// Find By UUID
const findByUuid = async (uuid) => {
  return await Category.findOne({
    where: { uuid },
  });
};

// Find By Name
const findByName = async (name) => {
  return await Category.findOne({
    where: { name },
  });
};

// Find By Slug
const findBySlug = async (slug) => {
  return await Category.findOne({
    where: { slug },
  });
};

// Update Category
const updateCategory = async (category, payload, transaction) => {
  return await category.update(payload, {
    transaction,
  });
};

// Update Category Status
const updateCategoryStatus = async (uuid, status, userId) => {
  const category = await Category.findOne({
    where: { uuid },
  });

  if (!category) {
    return null;
  }

  return await category.update({
    status,
    updated_by: userId,
  });
};

// Delete Category
const deleteCategory = async (category, transaction) => {
  return await category.destroy({
    transaction,
  });
};

// Get Categories
const getCategories = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  sortBy = "sort_order",
  sortOrder = "ASC",
}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;
  const where = {};

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

  if (status) {
    where.status = status;
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

  const result = await Category.findAndCountAll({
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

// Get all active categories for dropdown
const getActiveCategoriesForDropdown = async () => {
  return await Category.findAll({
    where: {
      status: "ACTIVE",
    },
    attributes: ["id", "name", "status"],
    order: [["name", "ASC"]],
  });
};

module.exports = {
  createCategory,
  findById,
  findByUuid,
  findByName,
  findBySlug,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  getCategories,
  getActiveCategoriesForDropdown,
};