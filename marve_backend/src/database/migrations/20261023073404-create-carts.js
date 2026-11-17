"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("carts", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "CONVERTED", "ABANDONED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      // Applied coupon information
      applied_coupon_type: {
        type: Sequelize.ENUM("DISCOUNT", "BOGO"),
        allowNull: true,
        defaultValue: null,
      },

      applied_coupon_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },

      applied_coupon_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },

      // Customer-selected eligible BOGO gift product
      selected_bogo_product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "products",
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

    await queryInterface.addIndex("carts", ["status"], {
      name: "idx_carts_status",
    });

    await queryInterface.addIndex(
      "carts",
      ["applied_coupon_type", "applied_coupon_id"],
      {
        name: "idx_carts_applied_coupon",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("carts");
  },
};