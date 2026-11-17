
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReturnRefund extends Model {
    static associate(models) {
      ReturnRefund.belongsTo(models.ReturnRequest, {
        foreignKey: "returnRequestId",
        as: "returnRequest",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      ReturnRefund.belongsTo(models.Payment, {
        foreignKey: "paymentId",
        as: "payment",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  ReturnRefund.init(
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

returnRequestId: {
  type: DataTypes.BIGINT.UNSIGNED,
  allowNull: false,
  unique: true,
},

      paymentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      refundNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      paymentMethod: {
        type: DataTypes.ENUM("ONLINE", "COD"),
        allowNull: false,
      },

      gateway: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      gatewayRefundId: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      refundAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "INR",
      },

      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "PROCESSING",
          "INITIATED",
          "COMPLETED",
          "FAILED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      refundMethod: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      refundReference: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      initiatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      failedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      rawPayload: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      processingStartedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      nextRetryAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      retryCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      idempotencyKey: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "ReturnRefund",
      tableName: "return_refunds",
      timestamps: true,
      indexes: [
        {
          name: "return_refunds_return_request_id_index",
          fields: ["returnRequestId"],
        },
        {
          name: "return_refunds_payment_id_index",
          fields: ["paymentId"],
        },
        {
          name: "return_refunds_gateway_refund_id_index",
          fields: ["gatewayRefundId"],
        },
        {
          name: "return_refunds_status_index",
          fields: ["status"],
        },
        {
          name: "return_refunds_initiated_at_index",
          fields: ["initiatedAt"],
        },
        {
          name: "return_refunds_scheduled_at_index",
          fields: ["scheduledAt"],
        },
        {
          name: "return_refunds_next_retry_at_index",
          fields: ["nextRetryAt"],
        },
        {
          name: "return_refunds_status_scheduled_at_index",
          fields: ["status", "scheduledAt"],
        },

      ],
    }
  );

  return ReturnRefund;
};
