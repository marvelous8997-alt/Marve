
"use strict";

const { userSubcategoryRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// GET ALL ACTIVE SUBCATEGORIES
const getSubcategories = async (filters = {}) => {
  try {
    const subcategories =
      await userSubcategoryRepository.getActiveSubcategories(filters);

    return subcategories.map((subcategory) => subcategory.toJSON());
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// GET ACTIVE SUBCATEGORY BY ID
const getSubcategoryById = async (id) => {
  try {
    const subcategory =
      await userSubcategoryRepository.getActiveSubcategoryById(id);

    if (!subcategory) {
      throw new ApiError(404, "Subcategory not found.");
    }

    return subcategory.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// GET ACTIVE SUBCATEGORIES BY CATEGORY ID

const getSubcategoriesByCategoryId = async (categoryId) => {
  try {
    const subcategories =
      await userSubcategoryRepository.getActiveSubcategories({
        categoryId,
      });

    return subcategories.map((subcategory) => subcategory.toJSON());
  } catch (error) {
    logger.error(error);
    throw error;
  }
};


module.exports = {
  getSubcategories,
  getSubcategoryById,
  getSubcategoriesByCategoryId,
};
