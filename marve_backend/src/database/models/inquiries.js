"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Inquiry extends Model {
    static associate(models) {
      // Add associations here if inquiry assignment
      // or customer-account relations are introduced later.
    }
  }

  Inquiry.init(
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

      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First name is required.",
          },
          len: {
            args: [1, 100],
            msg: "First name must be between 1 and 100 characters.",
          },
        },
      },

      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: {
            args: [0, 100],
            msg: "Last name cannot exceed 100 characters.",
          },
        },
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Email is required.",
          },
          isEmail: {
            msg: "Please provide a valid email address.",
          },
          len: {
            args: [3, 255],
            msg: "Email cannot exceed 255 characters.",
          },
        },
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: {
            args: [0, 20],
            msg: "Phone number cannot exceed 20 characters.",
          },
        },
      },

      subject: {
        type: DataTypes.ENUM(
          "ORDER",
          "PRODUCT",
          "DELIVERY",
          "RETURN",
          "OTHER"
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [[
              "ORDER",
              "PRODUCT",
              "DELIVERY",
              "RETURN",
              "OTHER",
            ]],
            msg: "Please select a valid inquiry subject.",
          },
        },
      },

      message: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Message is required.",
          },
        },
      },

      status: {
        type: DataTypes.ENUM(
          "NEW",
          "READ",
          "RESOLVED"
        ),
        allowNull: false,
        defaultValue: "NEW",
        validate: {
          isIn: {
            args: [[
              "NEW",
              "READ",
              "RESOLVED",
            ]],
            msg: "Please provide a valid inquiry status.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Inquiry",
      tableName: "inquiries",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["uuid"],
          name: "idx_inquiries_uuid",
          unique: true,
        },
        {
          fields: ["status"],
          name: "idx_inquiries_status",
        },
        {
          fields: ["subject"],
          name: "idx_inquiries_subject",
        },
        {
          fields: ["createdAt"],
          name: "idx_inquiries_created_at",
        },
        {
          fields: ["email"],
          name: "idx_inquiries_email",
        },
      ],
    }
  );

  return Inquiry;
};