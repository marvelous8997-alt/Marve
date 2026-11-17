
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BogoCouponGetProduct extends Model {
    static associate(models) {
      // Get Product belongs to a BOGO Coupon
      BogoCouponGetProduct.belongsTo(models.BogoCoupon, {
        foreignKey: "bogo_coupon_id",
        as: "bogoCoupon",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // Get Product references a Product
      BogoCouponGetProduct.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  BogoCouponGetProduct.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      bogo_coupon_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      product_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BogoCouponGetProduct",
      tableName: "bogo_coupon_get_products",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          unique: true,
          fields: ["bogo_coupon_id", "product_id"],
          name: "uq_bogo_get_coupon_product",
        },
        {
          fields: ["bogo_coupon_id"],
          name: "idx_bogo_get_coupon_id",
        },
        {
          fields: ["product_id"],
          name: "idx_bogo_get_product_id",
        },
      ],
    }
  );

  return BogoCouponGetProduct;
};
