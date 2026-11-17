
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("discount_coupons", {
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

      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      discount_type: {
        type: Sequelize.ENUM("PERCENTAGE", "FIXED"),
        allowNull: false,
      },

      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      maximum_discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      minimum_order_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      usage_limit: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },

      usage_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      per_customer_limit: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },

      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      sort_order: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

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

      updated_by: {
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
      "discount_coupons",
      ["status"],
      {
        name: "idx_discount_coupons_status",
      }
    );

    await queryInterface.addIndex(
      "discount_coupons",
      ["discount_type"],
      {
        name: "idx_discount_coupons_discount_type",
      }
    );

    await queryInterface.addIndex(
      "discount_coupons",
      ["start_date", "end_date"],
      {
        name: "idx_discount_coupons_validity",
      }
    );

    await queryInterface.addIndex(
      "discount_coupons",
      ["sort_order"],
      {
        name: "idx_discount_coupons_sort_order",
      }
    );

    await queryInterface.addIndex(
      "discount_coupons",
      ["created_by"],
      {
        name: "idx_discount_coupons_created_by",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("discount_coupons");
  },
};
