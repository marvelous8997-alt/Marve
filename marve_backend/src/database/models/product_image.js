"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      // Each image belongs to one product
      ProductImage.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }

  ProductImage.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      product_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      image_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },

      alt_text: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      is_primary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      sort_order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "product_images",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["product_id"],
          name: "idx_product_images_product_id",
        },
        {
          fields: ["product_id", "is_primary"],
          name: "idx_product_images_primary",
        },
        {
          fields: ["product_id", "sort_order"],
          name: "idx_product_images_sort_order",
        },
      ],
    }
  );

  return ProductImage;
};