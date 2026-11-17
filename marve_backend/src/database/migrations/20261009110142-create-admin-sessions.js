"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_sessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      adminId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      refreshTokenHash: {
        allowNull: false,
        type: Sequelize.STRING(64),
        unique: true,
      },

      expiresAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      revokedAt: {
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

    await queryInterface.addIndex("admin_sessions", ["adminId"], {
      name: "admin_sessions_admin_id_index",
    });

    await queryInterface.addIndex("admin_sessions", ["expiresAt"], {
      name: "admin_sessions_expires_at_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("admin_sessions");
  },
};