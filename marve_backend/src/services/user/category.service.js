"use strict";

const { userCategoryRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// GET ALL ACTIVE CATEGORIES
const getCategories = async () => {
  try {
    const categories =
      await userCategoryRepository.getActiveCategories();

    return categories.map((category) => category.toJSON());
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// GET ACTIVE CATEGORY BY ID
const getCategoryById = async (id) => {
  try {
    const category =
      await userCategoryRepository.getActiveCategoryById(id);

    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    return category.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getCategories,
  getCategoryById,
};