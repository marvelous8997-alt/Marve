
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HomeCouponBanner extends Model {
    static associate(models) {
      // Add associations here if needed in the future.
    }
  }

  HomeCouponBanner.init(
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

      type: {
        type: DataTypes.ENUM("HOME_COUPON"),
        allowNull: false,
        defaultValue: "HOME_COUPON",
        unique: true,
        validate: {
          isIn: [["HOME_COUPON"]],
        },
      },

      image: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Banner image is required.",
          },
        },
      },

      eyebrow: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Eyebrow text is required.",
          },
          len: [1, 255],
        },
      },

      heading: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Banner heading is required.",
          },
          len: [1, 255],
        },
      },

      highlighted_heading: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Highlighted heading is required.",
          },
          len: [1, 255],
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Banner description is required.",
          },
        },
      },

      button_text: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Button text is required.",
          },
          len: [1, 100],
        },
      },

      button_link: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Button link is required.",
          },
        },
      },

      offer_text: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Offer text is required.",
          },
          len: [1, 255],
        },
      },

      discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: "Discount value must be a valid number.",
          },
          min: {
            args: [0.01],
            msg: "Discount value must be greater than zero.",
          },
        },
      },

      discount_type: {
        type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
        allowNull: false,
        defaultValue: "PERCENTAGE",
        validate: {
          isIn: [["PERCENTAGE", "FIXED"]],
        },
      },

      coupon_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Coupon code is required.",
          },
          len: [1, 100],
        },
        set(value) {
          this.setDataValue(
            "coupon_code",
            typeof value === "string" ? value.trim().toUpperCase() : value
          );
        },
      },

      terms_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Terms and conditions text is required.",
          },
        },
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
        validate: {
          isIn: [["ACTIVE", "INACTIVE"]],
        },
      },
    },
    {
      sequelize,
      modelName: "HomeCouponBanner",
      tableName: "home_coupon_banners",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["type"],
          name: "idx_home_coupon_banners_type",
        },
        {
          fields: ["status"],
          name: "idx_home_coupon_banners_status",
        },
        {
          fields: ["coupon_code"],
          name: "idx_home_coupon_banners_coupon_code",
        },
        {
          fields: ["createdAt"],
          name: "idx_home_coupon_banners_created_at",
        },
      ],
    }
  );

  return HomeCouponBanner;
};
