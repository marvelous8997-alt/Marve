"use strict";

const { ProductImage, Product } = require("../../database/models");

// Create Product Image
const createProductImage = async (payload, transaction) => {
  return await ProductImage.create(payload, {
    transaction,
  });
};

// Create Multiple Product Images
const createProductImages = async (images, transaction) => {
  if (!Array.isArray(images) || images.length === 0) {
    return [];
  }

  return await ProductImage.bulkCreate(images, {
    transaction,
    validate: true,
  });
};

// Find Image By ID
const findById = async (id) => {
  return await ProductImage.findByPk(id, {
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "uuid", "name", "slug"],
      },
    ],
  });
};

// Find Image By UUID
const findByUuid = async (uuid) => {
  return await ProductImage.findOne({
    where: { uuid },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "uuid", "name", "slug"],
      },
    ],
  });
};

// Get Images By Product ID
const getImagesByProductId = async (productId, transaction) => {
  return await ProductImage.findAll({
    where: {
      product_id: productId,
    },
    transaction,
    order: [
      ["sort_order", "ASC"],
      ["id", "ASC"],
    ],
  });
};

// Find Primary Image By Product ID
const findPrimaryImage = async (productId, transaction) => {
  return await ProductImage.findOne({
    where: {
      product_id: productId,
      is_primary: true,
    },
    transaction,
    order: [["id", "ASC"]],
  });
};

// Update Product Image
const updateProductImage = async (image, payload, transaction) => {
  return await image.update(payload, {
    transaction,
  });
};

// Update Image By UUID
const updateProductImageByUuid = async (
  uuid,
  payload,
  transaction
) => {
  const image = await ProductImage.findOne({
    where: { uuid },
    transaction,
  });

  if (!image) {
    return null;
  }

  return await image.update(payload, {
    transaction,
  });
};

// Set Primary Image
const setPrimaryImage = async (
  productId,
  imageId,
  transaction
) => {
  // Confirm that the image belongs to this product.
  const image = await ProductImage.findOne({
    where: {
      id: imageId,
      product_id: productId,
    },
    transaction,
  });

  if (!image) {
    return null;
  }

  // Clear the previous primary image.
  await ProductImage.update(
    { is_primary: false },
    {
      where: {
        product_id: productId,
        is_primary: true,
      },
      transaction,
    }
  );

  // Set the selected image as primary.
  await image.update(
    { is_primary: true },
    { transaction }
  );

  return image;
};

// Delete Product Image
const deleteProductImage = async (image, transaction) => {
  return await image.destroy({
    transaction,
  });
};

// Delete Image By UUID
const deleteProductImageByUuid = async (uuid, transaction) => {
  const image = await ProductImage.findOne({
    where: { uuid },
    transaction,
  });

  if (!image) {
    return null;
  }

  await image.destroy({ transaction });

  return image;
};

// Delete All Images Of A Product
const deleteImagesByProductId = async (productId, transaction) => {
  return await ProductImage.destroy({
    where: {
      product_id: productId,
    },
    transaction,
  });
};

// Get Paginated Product Images
const getProductImages = async ({
  page = 1,
  limit = 10,
  productId,
  isPrimary,
  search = "",
  sortBy = "sort_order",
  sortOrder = "ASC",
}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;
  const where = {};

  // Filter by product
  if (
    productId !== undefined &&
    productId !== null &&
    productId !== ""
  ) {
    where.product_id = productId;
  }

  // Filter by primary image
  if (isPrimary !== undefined && isPrimary !== null && isPrimary !== "") {
    where.is_primary =
      isPrimary === true ||
      isPrimary === "true" ||
      isPrimary === 1 ||
      isPrimary === "1";
  }

  // Search by image URL or alt text
  const searchTerm = String(search || "").trim();

  if (searchTerm) {
    const { Op } = require("sequelize");

    where[Op.or] = [
      {
        image_url: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        alt_text: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    ];
  }

  const allowedSortFields = [
    "image_url",
    "alt_text",
    "is_primary",
    "sort_order",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "sort_order";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

  const result = await ProductImage.findAndCountAll({
    where,
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "uuid", "name", "slug"],
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
  createProductImage,
  createProductImages,
  findById,
  findByUuid,
  getImagesByProductId,
  findPrimaryImage,
  updateProductImage,
  updateProductImageByUuid,
  setPrimaryImage,
  deleteProductImage,
  deleteProductImageByUuid,
  deleteImagesByProductId,
  getProductImages,
};