"use strict";

const { Category } = require("../../database/models");

// Get all active categories for storefront
const getActiveCategories = async () => {
  return await Category.findAll({
    where: {
      status: "ACTIVE",
    },
    attributes: [
      "id",
      "uuid",
      "name",
      "slug",
      "description",
      "image",
      "icon",
      "status",
      "sort_order",
      "createdAt",
      "updatedAt",
    ],
    order: [
      ["sort_order", "ASC"],
      ["id", "ASC"],
    ],
  });
};

// Get active category by ID
const getActiveCategoryById = async (id) => {
  return await Category.findOne({
    where: {
      id,
      status: "ACTIVE",
    },
    attributes: [
      "id",
      "uuid",
      "name",
      "slug",
      "description",
      "image",
      "icon",
      "status",
      "sort_order",
      "createdAt",
      "updatedAt",
    ],
  });
};

module.exports = {
  getActiveCategories,
  getActiveCategoryById,
};