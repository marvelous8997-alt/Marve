
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BogoCouponBuyProduct extends Model {
    static associate(models) {
      // Buy Product belongs to a BOGO Coupon
      BogoCouponBuyProduct.belongsTo(models.BogoCoupon, {
        foreignKey: "bogo_coupon_id",
        as: "bogoCoupon",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // Buy Product references a Product
      BogoCouponBuyProduct.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  BogoCouponBuyProduct.init(
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
      modelName: "BogoCouponBuyProduct",
      tableName: "bogo_coupon_buy_products",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          unique: true,
          fields: ["bogo_coupon_id", "product_id"],
          name: "uq_bogo_buy_coupon_product",
        },
        {
          fields: ["bogo_coupon_id"],
          name: "idx_bogo_buy_coupon_id",
        },
        {
          fields: ["product_id"],
          name: "idx_bogo_buy_product_id",
        },
      ],
    }
  );

  return BogoCouponBuyProduct;
};
