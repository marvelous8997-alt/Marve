"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        as: "cart",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      CartItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      CartItem.belongsTo(models.ProductVariation, {
        foreignKey: "product_variation_id",
        as: "variation",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  CartItem.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      cart_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      product_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      product_variation_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },

      // Identifies a BOGO gift item
      is_free_gift: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
      timestamps: true,

      indexes: [
        {
          fields: ["cart_id", "product_id", "is_free_gift"],
          unique: true,
          name: "uq_cart_items_cart_product_gift",
        },
        {
          fields: ["product_id"],
          name: "idx_cart_items_product_id",
        },
        {
          fields: ["product_variation_id"],
          name: "idx_cart_items_product_variation_id",
        },
      ],
    }
  );

  return CartItem;
};