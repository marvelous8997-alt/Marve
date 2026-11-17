"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      firstName: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      lastName: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      email: {
        allowNull: true,
        type: Sequelize.STRING(191),
        unique: true,
      },

      phone: {
        allowNull: true,
        type: Sequelize.STRING(20),
        unique: true,
      },

      isEmailVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      isPhoneVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      offersOptIn: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    await queryInterface.addIndex("users", ["status"], {
      name: "users_status_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};