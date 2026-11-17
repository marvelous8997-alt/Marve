
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BogoCoupon extends Model {
    static associate(models) {
      // BOGO Coupon belongs to the admin who created it
      BogoCoupon.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // BOGO Coupon belongs to the admin who last updated it
      BogoCoupon.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });

      // BOGO Coupon has multiple eligible Buy Products
      BogoCoupon.hasMany(models.BogoCouponBuyProduct, {
        foreignKey: "bogo_coupon_id",
        as: "buyProducts",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // BOGO Coupon has multiple eligible Get Products
      BogoCoupon.hasMany(models.BogoCouponGetProduct, {
        foreignKey: "bogo_coupon_id",
        as: "getProducts",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  BogoCoupon.init(
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
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      buy_quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },

      get_quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },

      minimum_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      usage_limit: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      usage_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
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
        validate: {
          isAfterStartDate(value) {
            if (
              value &&
              this.start_date &&
              new Date(value) < new Date(this.start_date)
            ) {
              throw new Error(
                "End date must be greater than or equal to start date."
              );
            }
          },
        },
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
      modelName: "BogoCoupon",
      tableName: "bogo_coupons",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["status"],
          name: "idx_bogo_coupons_status",
        },
        {
          fields: ["sort_order"],
          name: "idx_bogo_coupons_sort_order",
        },
        {
          fields: ["start_date", "end_date"],
          name: "idx_bogo_coupons_dates",
        },
        {
          fields: ["created_by"],
          name: "idx_bogo_coupons_created_by",
        },
      ],
    }
  );

  return BogoCoupon;
};
