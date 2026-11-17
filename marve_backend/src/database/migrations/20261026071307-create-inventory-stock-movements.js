
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory_stock_movements", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },

      // PRODUCT or VARIATION
      item_type: {
        type: Sequelize.ENUM("PRODUCT", "VARIATION"),
        allowNull: false,
      },

      // ID of the product or product variation
      // Polymorphic reference: validated in the service.
      item_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      // Stock before the adjustment
      previous_stock: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },

      // Positive = stock added; negative = stock removed
      adjustment_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      // Stock after the adjustment
      new_stock: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },

      // Reason for the stock adjustment
      reason: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      // Optional additional explanation
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // Admin who performed the adjustment
      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addIndex(
      "inventory_stock_movements",
      ["item_type", "item_id"],
      {
        name: "idx_inventory_movements_item",
      }
    );

    await queryInterface.addIndex(
      "inventory_stock_movements",
      ["created_by"],
      {
        name: "idx_inventory_movements_created_by",
      }
    );

    await queryInterface.addIndex(
      "inventory_stock_movements",
      ["createdAt"],
      {
        name: "idx_inventory_movements_created_at",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inventory_stock_movements");
  },
};
