"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PaymentWebhookEvent extends Model {
    static associate(models) {
      PaymentWebhookEvent.belongsTo(models.Payment, {
        foreignKey: "paymentId",
        as: "payment",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  PaymentWebhookEvent.init(
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

      eventId: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 191],
        },
        set(value) {
          this.setDataValue(
            "eventId",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      eventType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
        set(value) {
          this.setDataValue(
            "eventType",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      paymentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      razorpayOrderId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      razorpayPaymentId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      processingStatus: {
        type: DataTypes.ENUM(
          "RECEIVED",
          "PROCESSING",
          "PROCESSED",
          "FAILED",
          "IGNORED"
        ),
        allowNull: false,
        defaultValue: "RECEIVED",
      },

      payload: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Webhook payload is required.",
          },
        },
      },

      processingAttempts: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      receivedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PaymentWebhookEvent",
      tableName: "payment_webhook_events",
      timestamps: true,
      indexes: [
        {
          name: "payment_webhook_events_payment_id_index",
          fields: ["paymentId"],
        },
        {
          name: "payment_webhook_events_processing_status_index",
          fields: ["processingStatus"],
        },
        {
          name: "payment_webhook_events_event_type_index",
          fields: ["eventType"],
        },
        {
          name: "payment_webhook_events_received_at_index",
          fields: ["receivedAt"],
        },
      ],
    }
  );

  return PaymentWebhookEvent;
};