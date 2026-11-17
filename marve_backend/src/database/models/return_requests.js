
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReturnRequest extends Model {
    static associate(models) {
      ReturnRequest.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      ReturnRequest.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      ReturnRequest.hasMany(models.ReturnItem, {
        foreignKey: "returnRequestId",
        as: "items",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      ReturnRequest.hasMany(models.ReturnShipment, {
        foreignKey: "returnRequestId",
        as: "shipments",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      ReturnRequest.hasMany(models.ReturnRefund, {
        foreignKey: "returnRequestId",
        as: "refunds",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  ReturnRequest.init(
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

      returnNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
        set(value) {
          this.setDataValue(
            "returnNumber",
            typeof value === "string" ? value.trim().toUpperCase() : value
          );
        },
      },

      orderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      reason: {
        type: DataTypes.ENUM(
          "SIZE_TOO_SMALL",
          "SIZE_TOO_LARGE",
          "PRODUCT_DAMAGED",
          "WRONG_PRODUCT",
          "PRODUCT_NOT_AS_DESCRIBED",
          "QUALITY_ISSUE",
          "OTHER"
        ),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
          this.setDataValue(
            "description",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      images: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          "REQUESTED",
          "APPROVED",
          "REJECTED",
          "PICKUP_SCHEDULED",
          "PICKED_UP",
          "RECEIVED",
          "INSPECTING",
          "REFUND_APPROVED",
          "REFUND_INITIATED",
          "REFUNDED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "REQUESTED",
      },

      adminNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      requestedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },

      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      receivedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      inspectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      refundedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      refundAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "INR",
        set(value) {
          this.setDataValue(
            "currency",
            typeof value === "string" ? value.trim().toUpperCase() : value
          );
        },
        validate: {
          len: [3, 3],
        },
      },
    },
    {
      sequelize,
      modelName: "ReturnRequest",
      tableName: "return_requests",
      timestamps: true,
      indexes: [
        {
          name: "return_requests_order_id_index",
          fields: ["orderId"],
        },
        {
          name: "return_requests_user_id_index",
          fields: ["userId"],
        },
        {
          name: "return_requests_status_index",
          fields: ["status"],
        },
        {
          name: "return_requests_requested_at_index",
          fields: ["requestedAt"],
        },
        {
          name: "return_requests_user_status_index",
          fields: ["userId", "status"],
        },
      ],
    }
  );

  return ReturnRequest;
};
