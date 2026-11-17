"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Payment.hasMany(models.PaymentWebhookEvent, {
        foreignKey: "paymentId",
        as: "webhookEvents",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });

      // Return Refunds
Payment.hasMany(models.ReturnRefund, {
  foreignKey: "paymentId",
  as: "returnRefunds",
});
    }
  }

  Payment.init(
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

      orderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      paymentNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
        set(value) {
          this.setDataValue(
            "paymentNumber",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      provider: {
        type: DataTypes.ENUM("RAZORPAY", "COD"),
        allowNull: false,
        defaultValue: "RAZORPAY",
      },

      method: {
        type: DataTypes.ENUM(
          "ONLINE",
          "COD",
          "UPI",
          "CARD",
          "NETBANKING",
          "WALLET",
          "EMI",
          "OTHER"
        ),
        allowNull: false,
        defaultValue: "ONLINE",
      },

      status: {
        type: DataTypes.ENUM(
          "CREATED",
          "PENDING",
          "AUTHORIZED",
          "CAPTURED",
          "FAILED",
          "CANCELLED",
          "REFUNDED",
          "PARTIALLY_REFUNDED"
        ),
        allowNull: false,
        defaultValue: "CREATED",
      },

      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "INR",
        validate: {
          len: [3, 3],
        },
        set(value) {
          this.setDataValue(
            "currency",
            typeof value === "string" ? value.trim().toUpperCase() : value
          );
        },
      },

      razorpayOrderId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        set(value) {
          this.setDataValue(
            "razorpayOrderId",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      razorpayPaymentId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        set(value) {
          this.setDataValue(
            "razorpayPaymentId",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      idempotencyKey: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        set(value) {
          this.setDataValue(
            "idempotencyKey",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      failureCode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      failureDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      methodDetails: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      authorizedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      capturedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      failedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      refundedAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      timestamps: true,
      indexes: [
        {
          name: "payments_order_id_index",
          fields: ["orderId"],
        },
        {
          name: "payments_status_index",
          fields: ["status"],
        },
        {
          name: "payments_provider_status_index",
          fields: ["provider", "status"],
        },
        {
          name: "payments_created_at_index",
          fields: ["createdAt"],
        },
      ],
    }
  );

  return Payment;
};