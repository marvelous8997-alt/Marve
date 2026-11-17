"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("home_hero_banners", {
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

      // Banner type
      type: {
        type: Sequelize.ENUM("HOME_HERO"),
        allowNull: false,
        defaultValue: "HOME_HERO",
      },

      // Uploaded banner image URL
      image: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },

      // Small text above the main heading
      eyebrow: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      // Main heading
      heading: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      // Highlighted heading
      highlighted_heading: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      // Banner description
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      // Call-to-action button text
      button_text: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      // Call-to-action destination
      button_link: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },

      // Bottom label
      bottom_label: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      // Banner status
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
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
      "home_hero_banners",
      ["type"],
      {
        name: "idx_home_hero_banners_type",
      }
    );

    await queryInterface.addIndex(
      "home_hero_banners",
      ["status"],
      {
        name: "idx_home_hero_banners_status",
      }
    );

    await queryInterface.addIndex(
      "home_hero_banners",
      ["createdAt"],
      {
        name: "idx_home_hero_banners_created_at",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("home_hero_banners");
  },
};