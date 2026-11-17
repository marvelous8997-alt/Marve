"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserOtp extends Model {
    /**
     * Define associations here.
     */
    static associate(models) {
      UserOtp.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  UserOtp.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      identifier: {
        type: DataTypes.STRING(191),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [5, 191],
        },
      },

      type: {
        type: DataTypes.ENUM("PHONE", "EMAIL"),
        allowNull: false,
        validate: {
          isIn: [["PHONE", "EMAIL"]],
        },
      },

      otpHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },

      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },

      attempts: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "UserOtp",
      tableName: "userotps",

      timestamps: true,

      indexes: [
        {
          name: "userotps_user_id_index",
          fields: ["userId"],
        },
        {
          name: "userotps_identifier_index",
          fields: ["identifier"],
        },
        {
          name: "userotps_expires_at_index",
          fields: ["expiresAt"],
        },
        {
          name: "userotps_auth_lookup_index",
          fields: ["identifier", "type", "verifiedAt"],
        },
      ],
    }
  );

  return UserOtp;
};