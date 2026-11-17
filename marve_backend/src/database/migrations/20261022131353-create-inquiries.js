"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inquiries", {
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

      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      subject: {
        type: Sequelize.ENUM(
          "ORDER",
          "PRODUCT",
          "DELIVERY",
          "RETURN",
          "OTHER"
        ),
        allowNull: false,
      },

      message: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "NEW",
          "READ",
          "RESOLVED"
        ),
        allowNull: false,
        defaultValue: "NEW",
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

    await queryInterface.addIndex("inquiries", ["uuid"], {
      name: "idx_inquiries_uuid",
      unique: true,
    });

    await queryInterface.addIndex("inquiries", ["status"], {
      name: "idx_inquiries_status",
    });

    await queryInterface.addIndex("inquiries", ["subject"], {
      name: "idx_inquiries_subject",
    });

    await queryInterface.addIndex("inquiries", ["createdAt"], {
      name: "idx_inquiries_created_at",
    });

    await queryInterface.addIndex("inquiries", ["email"], {
      name: "idx_inquiries_email",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inquiries");
  },
};