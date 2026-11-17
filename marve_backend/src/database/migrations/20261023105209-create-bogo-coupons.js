
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bogo_coupons", {
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
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      buy_quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },

      get_quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },

      minimum_order_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },

      usage_limit: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
usage_count: {
  type: Sequelize.INTEGER.UNSIGNED,
  allowNull: false,
  defaultValue: 0,
},
      per_customer_limit: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
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

    await queryInterface.addIndex("bogo_coupons", ["status"], {
      name: "idx_bogo_coupons_status",
    });

    await queryInterface.addIndex("bogo_coupons", ["sort_order"], {
      name: "idx_bogo_coupons_sort_order",
    });

    await queryInterface.addIndex(
      "bogo_coupons",
      ["start_date", "end_date"],
      {
        name: "idx_bogo_coupons_validity",
      }
    );

    await queryInterface.addIndex("bogo_coupons", ["created_by"], {
      name: "idx_bogo_coupons_created_by",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bogo_coupons");

    // MySQL removes the ENUM with its table.
  },
};
