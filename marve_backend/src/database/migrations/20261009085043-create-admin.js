"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admins", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      email: {
        allowNull: false,
        type: Sequelize.STRING(191),
        unique: true,
      },

      password: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      role: {
        allowNull: false,
        type: Sequelize.ENUM("SUPER_ADMIN", "ADMIN"),
        defaultValue: "ADMIN",
      },

      status: {
        allowNull: false,
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", "BLOCKED"),
        defaultValue: "ACTIVE",
      },

      lastLoginAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      passwordChangedAt: {
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

    await queryInterface.addIndex("admins", ["status"], {
      name: "admins_status_index",
    });

    await queryInterface.addIndex("admins", ["role"], {
      name: "admins_role_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("admins");
  },
};
