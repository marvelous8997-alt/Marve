
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CheckoutAddress extends Model {
    static associate(models) {
      // CheckoutAddress -> User
      CheckoutAddress.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  CheckoutAddress.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 150],
        },
        set(value) {
          this.setDataValue(
            "fullName",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 20],
        },
        set(value) {
          this.setDataValue(
            "phone",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      email: {
        type: DataTypes.STRING(191),
        allowNull: true,
        validate: {
          isEmail(value) {
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              throw new Error("Please provide a valid email address.");
            }
          },
          len: [5, 191],
        },
        set(value) {
          this.setDataValue(
            "email",
            typeof value === "string" && value.trim()
              ? value.trim().toLowerCase()
              : null
          );
        },
      },

      pincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 10],
        },
      },

      houseNumber: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 150],
        },
        set(value) {
          this.setDataValue(
            "houseNumber",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
        set(value) {
          this.setDataValue(
            "address",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      locality: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 150],
        },
      },

      landmark: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          len: [0, 150],
        },
      },

      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },

      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },

      addressType: {
        type: DataTypes.ENUM("HOME", "FRIENDS", "WORK", "OTHER"),
        allowNull: false,
        defaultValue: "HOME",
      },

      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
        validate: {
          min: -90,
          max: 90,
        },
      },

      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
        },
      },
    },
    {
      sequelize,
      modelName: "CheckoutAddress",
      tableName: "checkout_addresses",
      timestamps: true,

      indexes: [
        {
          name: "checkout_addresses_user_id_index",
          fields: ["userId"],
        },
        {
          name: "checkout_addresses_default_index",
          fields: ["userId", "isDefault"],
        },
        {
          name: "checkout_addresses_pincode_index",
          fields: ["pincode"],
        },
      ],
    }
  );

  return CheckoutAddress;
};
