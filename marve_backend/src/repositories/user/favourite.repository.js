"use strict";

const {
  Favourite,
  Product,
  ProductImage,
  Category,
} = require("../../database/models");

// Get all favourites for a specific user.
const getUserFavourites = async (userId) => {
  return await Favourite.findAll({
    where: {
      user_id: userId,
    },

    attributes: [
      "id",
      "uuid",
      "user_id",
      "product_id",
      "createdAt",
      "updatedAt",
    ],

    include: [
      {
        model: Product,
        as: "product",
        required: true,

        attributes: [
          "id",
          "uuid",
          "name",
          "slug",
          "SKU",
          "price",
          "compare_at_price",
          "stock",
          "status",
          "category_id",
          "subcategory_id",
        ],

        include: [
          {
            model: ProductImage,
            as: "images",
            required: false,

            attributes: [
              "id",
              "image_url",
              "alt_text",
              "is_primary",
              "sort_order",
            ],

            separate: true,

            order: [
              ["is_primary", "DESC"],
              ["sort_order", "ASC"],
              ["id", "ASC"],
            ],
          },
          {
            model: Category,
            as: "category",
            required: false,

            attributes: [
              "id",
              "name",
              "slug",
            ],
          },
        ],
      },
    ],

    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
  });
};

// Get a specific favourite by user and product.
const getFavouriteByUserAndProduct = async (userId, productId) => {
  return await Favourite.findOne({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });
};

// Add a product to the user's favourites.
const addFavourite = async (userId, productId) => {
  return await Favourite.create({
    user_id: userId,
    product_id: productId,
  });
};

// Remove a specific product from the user's favourites.
const removeFavourite = async (userId, productId) => {
  return await Favourite.destroy({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });
};

// Check whether a product is in the user's favourites.
const isProductFavourite = async (userId, productId) => {
  const favourite = await Favourite.findOne({
    where: {
      user_id: userId,
      product_id: productId,
    },
    attributes: ["id"],
  });

  return Boolean(favourite);
};

module.exports = {
  getUserFavourites,
  getFavouriteByUserAndProduct,
  addFavourite,
  removeFavourite,
  isProductFavourite,
};