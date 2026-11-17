"use strict";

const { sequelize } = require("../../database/models");
const { adminSubcategoryRepository, adminCategoryRepository } = require("../../repositories");
const { uploadToCloudinary, deleteCloudinaryFile } = require("../../helpers/cloudinary.helper");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// CREATE SUBCATEGORY
const createSubcategory = async (payload, file, userId) => {
  const transaction = await sequelize.transaction();
  let uploadedImage = null;

  try {
    const categoryId = payload.category_id;
    const name = payload.name?.trim();
    const slug = payload.slug?.trim();

    if (!categoryId) {
      throw new ApiError(400, "Parent category is required.");
    }

    if (!name) {
      throw new ApiError(400, "Subcategory name is required.");
    }

    if (!slug) {
      throw new ApiError(400, "Subcategory slug is required.");
    }

    const category = await adminCategoryRepository.findById(categoryId);

    if (!category) {
      throw new ApiError(404, "Parent category not found.");
    }

    const existingName = await adminSubcategoryRepository.findByName(name);

    if (existingName) {
      throw new ApiError(409, "Subcategory name already exists.");
    }

    const existingSlug = await adminSubcategoryRepository.findBySlug(slug);

    if (existingSlug) {
      throw new ApiError(409, "Subcategory slug already exists.");
    }

    let image = null;

    if (file) {
      const result = await uploadToCloudinary(file, {
        folder: "marve/subcategories",
        resourceType: "image",
      });

      uploadedImage = result.secure_url;
      image = uploadedImage;
    }

    const subcategory = await adminSubcategoryRepository.createSubcategory(
      {
        ...payload,
        category_id: categoryId,
        name,
        slug,
        image,
        created_by: userId,
        updated_by: userId,
      },
      transaction
    );

    await transaction.commit();

    return subcategory.toJSON();
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

// UPDATE SUBCATEGORY
const updateSubcategory = async (uuid, payload, file, userId) => {
  const transaction = await sequelize.transaction();
  let newImage = null;

  try {
    const subcategory = await adminSubcategoryRepository.findByUuid(uuid);

    if (!subcategory) {
      throw new ApiError(404, "Subcategory not found.");
    }

    const categoryId =
      payload.category_id !== undefined
        ? payload.category_id
        : subcategory.category_id;

    const name =
      typeof payload.name === "string" ? payload.name.trim() : undefined;

    const slug =
      typeof payload.slug === "string" ? payload.slug.trim() : undefined;

    if (!categoryId) {
      throw new ApiError(400, "Parent category is required.");
    }

    // Validate parent category if it is changed.
    if (String(categoryId) !== String(subcategory.category_id)) {
      const category = await adminCategoryRepository.findById(categoryId);

      if (!category) {
        throw new ApiError(404, "Parent category not found.");
      }

      payload.category_id = categoryId;
    }

    if (name !== undefined) {
      if (!name) {
        throw new ApiError(400, "Subcategory name is required.");
      }

      if (name !== subcategory.name) {
        const existingName = await adminSubcategoryRepository.findByName(name);

        if (existingName && String(existingName.id) !== String(subcategory.id)) {
          throw new ApiError(409, "Subcategory name already exists.");
        }

        payload.name = name;
      }
    }

    if (slug !== undefined) {
      if (!slug) {
        throw new ApiError(400, "Subcategory slug is required.");
      }

      if (slug !== subcategory.slug) {
        const existingSlug = await adminSubcategoryRepository.findBySlug(slug);

        if (
          existingSlug &&
          String(existingSlug.id) !== String(subcategory.id)
        ) {
          throw new ApiError(409, "Subcategory slug already exists.");
        }

        payload.slug = slug;
      }
    }

    const oldImage = subcategory.image;

    if (file) {
      const result = await uploadToCloudinary(file, {
        folder: "marve/subcategories",
        resourceType: "image",
      });
      newImage = result.secure_url;
      payload.image = newImage;
    }

    payload.updated_by = userId;
    await adminSubcategoryRepository.updateSubcategory(
      subcategory,
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
    return subcategory.toJSON();
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

// UPDATE SUBCATEGORY STATUS
const updateSubcategoryStatus = async (uuid, status, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const subcategory = await adminSubcategoryRepository.findByUuid(uuid);
    if (!subcategory) {
      throw new ApiError(404, "Subcategory not found.");
    }
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      throw new ApiError(400, "Invalid subcategory status.");
    }
    await adminSubcategoryRepository.updateSubcategory(
      subcategory,
      {
        status,
        updated_by: userId,
      },
      transaction
    );
    await transaction.commit();
    return subcategory.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(error);
    throw error;
  }
};

// GET SINGLE SUBCATEGORY
const getSubcategory = async (uuid) => {
  const subcategory = await adminSubcategoryRepository.findByUuid(uuid);
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found.");
  }
  return subcategory.toJSON();
};

// GET SUBCATEGORY LIST
const getSubcategories = async (query) => {
  const result = await adminSubcategoryRepository.getSubcategories(query);
  return {
    ...result,
    rows: result.rows.map((subcategory) => subcategory.toJSON()),
  };
};

// DELETE SUBCATEGORY
const deleteSubcategory = async (uuid) => {
  const transaction = await sequelize.transaction();
  try {
    const subcategory = await adminSubcategoryRepository.findByUuid(uuid);
    if (!subcategory) {
      throw new ApiError(404, "Subcategory not found.");
    }
    await adminSubcategoryRepository.deleteSubcategory(
      subcategory,
      transaction
    );
    await transaction.commit();
    if (subcategory.image) {
      try {
        await deleteCloudinaryFile(subcategory.image, "image");
      } catch (cleanupError) {
        logger.error(cleanupError);
      }
    }
    return true;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(error);
    throw error;
  }
};

const getActiveCategoriesForDropdown = async () => {
  const categories =
    await adminCategoryRepository.getActiveCategoriesForDropdown();

  return categories.map((category) => category.toJSON());
};

module.exports = {
  createSubcategory,
  updateSubcategory,
  updateSubcategoryStatus,
  getSubcategory,
  getSubcategories,
  deleteSubcategory,
  getActiveCategoriesForDropdown,
};