
"use strict";

const { sequelize } = require("../../database/models");
const { adminCategoryRepository } = require("../../repositories");
const { uploadToCloudinary, deleteCloudinaryFile } = require("../../helpers/cloudinary.helper");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// CREATE CATEGORY
const createCategory = async (payload, file, userId) => {
  const transaction = await sequelize.transaction();
  let uploadedImage = null;
  try {
    const name = payload.name?.trim();
    const slug = payload.slug?.trim();
    if (!name) {
      throw new ApiError(400, "Category name is required.");
    }
    if (!slug) {
      throw new ApiError(400, "Category slug is required.");
    }

    const existingName = await adminCategoryRepository.findByName(name);
    if (existingName) {
      throw new ApiError(409, "Category name already exists.");
    }

    const existingSlug = await adminCategoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ApiError(409, "Category slug already exists.");
    }

    let image = null;
    if (file) {
      const result = await uploadToCloudinary(file, {
        folder: "marve/categories",
        resourceType: "image",
      });
      uploadedImage = result.secure_url;
      image = uploadedImage;
    }
    const category = await adminCategoryRepository.createCategory(
      {
        ...payload,
        name,
        slug,
        image,
        created_by: userId,
        updated_by: userId,
      },
      transaction
    );
    await transaction.commit();
    return category.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    if (uploadedImage) {
      try {
        await deleteCloudinaryFile(uploadedImage, "image");
      } catch (cleanupError) {
        logger.error(cleanupError);
      }
    }
    logger.error(error);
    throw error;
  }
};

// UPDATE CATEGORY
const updateCategory = async (uuid, payload, file, userId) => {
  const transaction = await sequelize.transaction();
  let newImage = null;

  try {
    const category = await adminCategoryRepository.findByUuid(uuid);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    const name = typeof payload.name === "string" ? payload.name.trim() : undefined;
    const slug = typeof payload.slug === "string" ? payload.slug.trim() : undefined;

    if (name && name !== category.name) {
      const existingName = await adminCategoryRepository.findByName(name);
      if (existingName && existingName.id !== category.id) {
        throw new ApiError(409, "Category name already exists.");
      }
      payload.name = name;
    }

    if (slug && slug !== category.slug) {
      const existingSlug = await adminCategoryRepository.findBySlug(slug);
      if (existingSlug && existingSlug.id !== category.id) {
        throw new ApiError(409, "Category slug already exists.");
      }
      payload.slug = slug;
    }

    const oldImage = category.image;
    if (file) {
      const result = await uploadToCloudinary(file, {
        folder: "marve/categories",
        resourceType: "image",
      });
      newImage = result.secure_url;
      payload.image = newImage;
    }

    payload.updated_by = userId;
    await adminCategoryRepository.updateCategory(
      category,
      payload,
      transaction
    );
    await transaction.commit();
    if (newImage && oldImage) {
      try {
        await deleteCloudinaryFile(oldImage, "image");
      } catch (cleanupError) {
        logger.error(cleanupError);
      }
    }
    return category.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    if (newImage) {
      try {
        await deleteCloudinaryFile(newImage, "image");
      } catch (cleanupError) {
        logger.error(cleanupError);
      }
    }
    logger.error(error);
    throw error;
  }
};

// UPDATE CATEGORY STATUS
const updateCategoryStatus = async (uuid, status, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const category = await adminCategoryRepository.findByUuid(uuid);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      throw new ApiError(400, "Invalid category status.");
    }
    await adminCategoryRepository.updateCategory(
      category,
      {
        status,
        updated_by: userId,
      },
      transaction
    );
    await transaction.commit();
    return category.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(error);
    throw error;
  }
};

// GET SINGLE CATEGORY
const getCategory = async (uuid) => {
  const category = await adminCategoryRepository.findByUuid(uuid);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
  return category.toJSON();
};

// GET CATEGORY LIST
const getCategories = async (query) => {
  const result = await adminCategoryRepository.getCategories(query);
  return {
    ...result,
    rows: result.rows.map((category) => category.toJSON()),
  };
};

// DELETE CATEGORY
const deleteCategory = async (uuid) => {
  const transaction = await sequelize.transaction();
  try {
    const category = await adminCategoryRepository.findByUuid(uuid);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
    await adminCategoryRepository.deleteCategory(category, transaction);
    await transaction.commit();
    return true;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(error);
    throw error;
  }
};

module.exports = {
  createCategory,
  updateCategory,
  updateCategoryStatus,
  getCategory,
  getCategories,
  deleteCategory,
};