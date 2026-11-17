
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DiscountCoupon extends Model {
    static associate(models) {
      // Admin who created the coupon
      DiscountCoupon.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // Admin who last updated the coupon
      DiscountCoupon.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  DiscountCoupon.init(
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

      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value) {
          if (typeof value === "string") {
            this.setDataValue(
              "code",
              value.trim().toUpperCase().replace(/\s+/g, "")
            );
          } else {
            this.setDataValue("code", value);
          }
        },
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      discount_type: {
        type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
        allowNull: false,
      },

      discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      maximum_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      minimum_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      usage_limit: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      usage_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      per_customer_limit: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      sort_order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DiscountCoupon",
      tableName: "discount_coupons",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["status"],
          name: "idx_discount_coupons_status",
        },
        {
          fields: ["discount_type"],
          name: "idx_discount_coupons_discount_type",
        },
        {
          fields: ["start_date", "end_date"],
          name: "idx_discount_coupons_validity",
        },
        {
          fields: ["sort_order"],
          name: "idx_discount_coupons_sort_order",
        },
        {
          fields: ["created_by"],
          name: "idx_discount_coupons_created_by",
        },
      ],
    }
  );

  return DiscountCoupon;
};
