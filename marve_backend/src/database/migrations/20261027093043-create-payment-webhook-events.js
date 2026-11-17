"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_webhook_events", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },

      eventId: {
        allowNull: false,
        type: Sequelize.STRING(191),
        unique: true,
      },

      eventType: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      paymentId: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "payments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      razorpayOrderId: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      razorpayPaymentId: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      processingStatus: {
        allowNull: false,
        type: Sequelize.ENUM(
          "RECEIVED",
          "PROCESSING",
          "PROCESSED",
          "FAILED",
          "IGNORED"
        ),
        defaultValue: "RECEIVED",
      },

      payload: {
        allowNull: false,
        type: Sequelize.JSON,
      },

      processingAttempts: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },

      errorMessage: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      receivedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      processedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addIndex(
      "payment_webhook_events",
      ["paymentId"],
      {
        name: "payment_webhook_events_payment_id_index",
      }
    );

    await queryInterface.addIndex(
      "payment_webhook_events",
      ["processingStatus"],
      {
        name: "payment_webhook_events_status_index",
      }
    );

    await queryInterface.addIndex(
      "payment_webhook_events",
      ["eventType"],
      {
        name: "payment_webhook_events_type_index",
      }
    );

    await queryInterface.addIndex(
      "payment_webhook_events",
      ["receivedAt"],
      {
        name: "payment_webhook_events_received_at_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("payment_webhook_events");
  },
};