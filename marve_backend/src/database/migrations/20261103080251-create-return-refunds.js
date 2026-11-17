
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("return_refunds", {
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

      returnRequestId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "return_requests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      paymentId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "payments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      refundNumber: {
        allowNull: false,
        type: Sequelize.STRING(100),
        unique: true,
      },

      paymentMethod: {
        allowNull: false,
        type: Sequelize.ENUM("ONLINE", "COD"),
      },

      gateway: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      gatewayRefundId: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      refundAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
      },

      currency: {
        allowNull: false,
        type: Sequelize.STRING(3),
        defaultValue: "INR",
      },

      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          "PENDING",
          "PROCESSING",
          "INITIATED",
          "COMPLETED",
          "FAILED",
          "CANCELLED"
        ),
        defaultValue: "PENDING",
      },

      refundMethod: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      refundReference: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      failureReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      initiatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      failedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      rawPayload: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      scheduledAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      processingStartedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      nextRetryAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      retryCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      idempotencyKey: {
        allowNull: false,
        type: Sequelize.STRING(150),
        unique: true,
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

// Indexes

// One refund record per return request
await queryInterface.addIndex(
  "return_refunds",
  ["returnRequestId"],
  {
    name: "return_refunds_return_request_id_unique",
    unique: true,
  }
);

await queryInterface.addIndex(
  "return_refunds",
  ["paymentId"],
  {
    name: "return_refunds_payment_id_index",
  }
);

await queryInterface.addIndex(
  "return_refunds",
  ["gatewayRefundId"],
  {
    name: "return_refunds_gateway_refund_id_index",
  }
);

await queryInterface.addIndex(
  "return_refunds",
  ["status"],
  {
    name: "return_refunds_status_index",
  }
);

await queryInterface.addIndex(
  "return_refunds",
  ["initiatedAt"],
  {
    name: "return_refunds_initiated_at_index",
  }
);

await queryInterface.addIndex(
  "return_refunds",
  ["scheduledAt"],
  {
    name: "return_refunds_scheduled_at_index",
  }
);

await queryInterface.addIndex(
  "return_refunds",
  ["nextRetryAt"],
  {
    name: "return_refunds_next_retry_at_index",
  }
);

await queryInterface.addIndex(
  "return_refunds",
  ["status", "scheduledAt"],
  {
    name: "return_refunds_status_scheduled_at_index",
  }
);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("return_refunds");
  },
};
