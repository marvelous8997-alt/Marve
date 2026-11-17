"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
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

      orderId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      paymentNumber: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true,
      },

      provider: {
        allowNull: false,
        type: Sequelize.ENUM("RAZORPAY", "COD"),
        defaultValue: "RAZORPAY",
      },

      method: {
        allowNull: false,
        type: Sequelize.ENUM(
          "ONLINE",
          "COD",
          "UPI",
          "CARD",
          "NETBANKING",
          "WALLET",
          "EMI",
          "OTHER"
        ),
        defaultValue: "ONLINE",
      },

      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          "CREATED",
          "PENDING",
          "AUTHORIZED",
          "CAPTURED",
          "FAILED",
          "CANCELLED",
          "REFUNDED",
          "PARTIALLY_REFUNDED"
        ),
        defaultValue: "CREATED",
      },

      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
      },

      currency: {
        allowNull: false,
        type: Sequelize.STRING(3),
        defaultValue: "INR",
      },

      // Razorpay identifiers
      razorpayOrderId: {
        allowNull: true,
        type: Sequelize.STRING(100),
        unique: true,
      },

      razorpayPaymentId: {
        allowNull: true,
        type: Sequelize.STRING(100),
        unique: true,
      },

      // Internal idempotency key for safe retries
      idempotencyKey: {
        allowNull: true,
        type: Sequelize.STRING(100),
        unique: true,
      },

      failureCode: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      failureDescription: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      methodDetails: {
        allowNull: true,
        type: Sequelize.JSON,
      },

      authorizedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      capturedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      failedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      refundedAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
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

    await queryInterface.addIndex("payments", ["orderId"], {
      name: "payments_order_id_index",
    });

    await queryInterface.addIndex("payments", ["status"], {
      name: "payments_status_index",
    });

    await queryInterface.addIndex("payments", ["provider", "status"], {
      name: "payments_provider_status_index",
    });

    await queryInterface.addIndex("payments", ["createdAt"], {
      name: "payments_created_at_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("payments");
  },
};