
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("return_requests", {
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

      returnNumber: {
        allowNull: false,
        type: Sequelize.STRING(50),
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

      userId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      reason: {
        allowNull: false,
        type: Sequelize.ENUM(
          "SIZE_TOO_SMALL",
          "SIZE_TOO_LARGE",
          "PRODUCT_DAMAGED",
          "WRONG_PRODUCT",
          "PRODUCT_NOT_AS_DESCRIBED",
          "QUALITY_ISSUE",
          "OTHER"
        ),
      },

      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      images: {
        allowNull: true,
        type: Sequelize.JSON,
      },

      status: {
        allowNull: false,
        type: Sequelize.ENUM(
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
        defaultValue: "REQUESTED",
      },

      adminNote: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      rejectionReason: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      requestedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      approvedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      rejectedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      receivedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      inspectedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      refundedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      refundAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      currency: {
        allowNull: false,
        type: Sequelize.STRING(3),
        defaultValue: "INR",
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

    await queryInterface.addIndex(
      "return_requests",
      ["orderId"],
      {
        name: "return_requests_order_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_requests",
      ["userId"],
      {
        name: "return_requests_user_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_requests",
      ["status"],
      {
        name: "return_requests_status_index",
      }
    );

    await queryInterface.addIndex(
      "return_requests",
      ["requestedAt"],
      {
        name: "return_requests_requested_at_index",
      }
    );

    await queryInterface.addIndex(
      "return_requests",
      ["userId", "status"],
      {
        name: "return_requests_user_status_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("return_requests");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_return_requests_reason";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_return_requests_status";'
    );
  },
};
