"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userotps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      userId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      identifier: {
        allowNull: false,
        type: Sequelize.STRING(191),
      },

      type: {
        allowNull: false,
        type: Sequelize.ENUM("PHONE", "EMAIL"),
      },

      otpHash: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      expiresAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      verifiedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      attempts: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
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

    // Index for finding OTP records by user
    await queryInterface.addIndex("userotps", ["userId"], {
      name: "userotps_user_id_index",
    });

    // Index for OTP lookup by identifier
    await queryInterface.addIndex("userotps", ["identifier"], {
      name: "userotps_identifier_index",
    });

    // Index for expiration cleanup / validation
    await queryInterface.addIndex("userotps", ["expiresAt"], {
      name: "userotps_expires_at_index",
    });

    // Composite index for authentication lookup
    await queryInterface.addIndex(
      "userotps",
      ["identifier", "type", "verifiedAt"],
      {
        name: "userotps_auth_lookup_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("userotps");
  },
};