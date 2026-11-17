
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("return_items", {
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
        onDelete: "CASCADE",
      },

      orderItemId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "order_items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },

      unitPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
      },

      refundAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      itemCondition: {
        allowNull: true,
        type: Sequelize.ENUM(
          "UNINSPECTED",
          "GOOD",
          "DAMAGED",
          "USED",
          "REJECTED"
        ),
        defaultValue: "UNINSPECTED",
      },

      inspectionNote: {
        allowNull: true,
        type: Sequelize.TEXT,
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
      "return_items",
      ["returnRequestId"],
      {
        name: "return_items_return_request_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_items",
      ["orderItemId"],
      {
        name: "return_items_order_item_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_items",
      ["itemCondition"],
      {
        name: "return_items_item_condition_index",
      }
    );

    await queryInterface.addIndex(
      "return_items",
      ["returnRequestId", "orderItemId"],
      {
        name: "return_items_request_order_item_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("return_items");
  },
};
