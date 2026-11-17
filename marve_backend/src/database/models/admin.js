"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // Admin associations can be added here later.
        Admin.hasMany(models.admin_sessions, {
        foreignKey: "adminId",
        as: "sessions",
      });
    }
  }

  Admin.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },

      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          len: [5, 191],
        },
        set(value) {
          if (typeof value === "string") {
            this.setDataValue("email", value.trim().toLowerCase());
          } else {
            this.setDataValue("email", value);
          }
        },
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      role: {
        type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN"),
        allowNull: false,
        defaultValue: "ADMIN",
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

      passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "admins",
      timestamps: true,
      indexes: [
        {
          name: "admins_status_index",
          fields: ["status"],
        },
        {
          name: "admins_role_index",
          fields: ["role"],
        },
      ],
    }
  );

  return Admin;
};
