"use strict";

const { userFavouriteRepository } = require("../../repositories");
const { Product } = require("../../database/models");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// GET ALL FAVOURITES FOR A USER
const getFavourites = async (userId) => {
  try {
    const favourites =
      await userFavouriteRepository.getUserFavourites(userId);

    return favourites.map((favourite) => favourite.toJSON());
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// ADD PRODUCT TO FAVOURITES
const addFavourite = async (userId, productId) => {
  try {
    if (!productId || !Number.isSafeInteger(Number(productId)) ||
        Number(productId) <= 0) {
      throw new ApiError(400, "A valid product ID is required.");
    }

    const product = await Product.findByPk(productId, {
      attributes: ["id", "status"],
    });

    if (!product || product.status !== "ACTIVE") {
      throw new ApiError(404, "Product not found or unavailable.");
    }

    const existingFavourite =
      await userFavouriteRepository.getFavouriteByUserAndProduct(
        userId,
        productId
      );

    if (existingFavourite) {
      throw new ApiError(409, "Product is already in your favourites.");
    }

    const favourite = await userFavouriteRepository.addFavourite(
      userId,
      productId
    );

    logger.info("Product added to favourites successfully.");

    return favourite.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// REMOVE PRODUCT FROM FAVOURITES
const removeFavourite = async (userId, productId) => {
  try {
    if (!productId || !Number.isSafeInteger(Number(productId)) ||
        Number(productId) <= 0) {
      throw new ApiError(400, "A valid product ID is required.");
    }

    const deletedCount =
      await userFavouriteRepository.removeFavourite(userId, productId);

    if (!deletedCount) {
      throw new ApiError(404, "Favourite product not found.");
    }

    logger.info("Product removed from favourites successfully.");

    return {
      productId: Number(productId),
      isFavourite: false,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// CHECK WHETHER A PRODUCT IS A FAVOURITE
const checkFavourite = async (userId, productId) => {
  try {
    if (!productId || !Number.isSafeInteger(Number(productId)) ||
        Number(productId) <= 0) {
      throw new ApiError(400, "A valid product ID is required.");
    }

    const isFavourite =
      await userFavouriteRepository.isProductFavourite(userId, productId);

    return {
      productId: Number(productId),
      isFavourite,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
  checkFavourite,
};