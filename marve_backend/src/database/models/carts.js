
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Cart.hasMany(models.CartItem, {
        foreignKey: "cart_id",
        as: "items",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Cart.belongsTo(models.Product, {
        foreignKey: "selected_bogo_product_id",
        as: "selectedBogoProduct",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  Cart.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "CONVERTED", "ABANDONED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      // Applied coupon type: DISCOUNT or BOGO
      applied_coupon_type: {
        type: DataTypes.ENUM("DISCOUNT", "BOGO"),
        allowNull: true,
        defaultValue: null,
      },

      // Coupon ID from the corresponding coupon table
      applied_coupon_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },

      // Snapshot of the applied coupon code
      applied_coupon_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
      },

      // Selected eligible BOGO gift product
      selected_bogo_product_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "products",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "carts",
      timestamps: true,

      indexes: [
        {
          fields: ["user_id"],
          unique: true,
          name: "uq_carts_user_id",
        },
        {
          fields: ["status"],
          name: "idx_carts_status",
        },
        {
          fields: ["applied_coupon_type", "applied_coupon_id"],
          name: "idx_carts_applied_coupon",
        },
      ],
    }
  );

  return Cart;
};
