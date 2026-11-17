"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Define associations here.
     */
    static associate(models) {
      // User -> UserOTP
      User.hasMany(models.UserOtp, {
        foreignKey: "userId",
        as: "otps",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      User.hasOne(models.Cart, {
        foreignKey: "user_id",
        as: "cart",
      });
      // User -> CheckoutAddress
      User.hasMany(models.CheckoutAddress, {
        foreignKey: "userId",
        as: "checkoutAddresses",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      // Return Requests
      User.hasMany(models.ReturnRequest, {
        foreignKey: "userId",
        as: "returnRequests",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [1, 100],
        },
      },

      lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [1, 100],
        },
      },

      email: {
        type: DataTypes.STRING(191),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
          len: [5, 191],
        },
        set(value) {
          if (value) {
            this.setDataValue("email", value.trim().toLowerCase());
          } else {
            this.setDataValue("email", null);
          }
        },
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
        validate: {
          len: [10, 20],
        },
        set(value) {
          if (value) {
            this.setDataValue("phone", value.trim());
          } else {
            this.setDataValue("phone", null);
          }
        },
      },

      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      offersOptIn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "BLOCKED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",

      timestamps: true,

      indexes: [
        {
          name: "users_status_index",
          fields: ["status"],
        },
      ],
    }
  );

  return User;
};