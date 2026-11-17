
"use strict";

const { Subcategory, Category } = require("../../database/models");

// Attributes returned for storefront subcategories
const SUBCATEGORY_ATTRIBUTES = [
  "id",
  "uuid",
  "category_id",
  "name",
  "slug",
  "description",
  "image",
  "icon",
  "status",
  "sort_order",
  "createdAt",
  "updatedAt",
];

// Parent category details
const CATEGORY_ATTRIBUTES = [
  "id",
  "uuid",
  "name",
  "slug",
  "description",
  "image",
  "icon",
  "status",
];

// Get all active subcategories for storefront
const getActiveSubcategories = async (filters = {}) => {
  const where = {
    status: "ACTIVE",
  };

  if (filters.categoryId !== undefined && filters.categoryId !== null) {
    where.category_id = filters.categoryId;
  }

  return await Subcategory.findAll({
    where,
    attributes: SUBCATEGORY_ATTRIBUTES,
    include: [
      {
        model: Category,
        as: "category",
        attributes: CATEGORY_ATTRIBUTES,
        required: true,
        where: {
          status: "ACTIVE",
        },
      },
    ],
    order: [
      ["sort_order", "ASC"],
      ["id", "ASC"],
    ],
  });
};

// Get an active subcategory by ID
const getActiveSubcategoryById = async (id) => {
  return await Subcategory.findOne({
    where: {
      id,
      status: "ACTIVE",
    },
    attributes: SUBCATEGORY_ATTRIBUTES,
    include: [
      {
        model: Category,
        as: "category",
        attributes: CATEGORY_ATTRIBUTES,
        required: true,
        where: {
          status: "ACTIVE",
        },
      },
    ],
  });
};

// Get an active subcategory by slug
const getActiveSubcategoryBySlug = async (slug) => {
  return await Subcategory.findOne({
    where: {
      slug,
      status: "ACTIVE",
    },
    attributes: SUBCATEGORY_ATTRIBUTES,
    include: [
      {
        model: Category,
        as: "category",
        attributes: CATEGORY_ATTRIBUTES,
        required: true,
        where: {
          status: "ACTIVE",
        },
      },
    ],
  });
};

module.exports = {
  getActiveSubcategories,
  getActiveSubcategoryById,
  getActiveSubcategoryBySlug,
};
