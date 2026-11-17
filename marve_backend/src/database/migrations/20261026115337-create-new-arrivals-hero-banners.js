"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("new_arrivals_hero_banners", {
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

      type: {
        type: Sequelize.ENUM("NEW_ARRIVALS_HERO"),
        allowNull: false,
        defaultValue: "NEW_ARRIVALS_HERO",
      },

      image: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },

      eyebrow: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      heading: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      highlighted_heading: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      button_text: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      button_link: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },

      floating_label: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      floating_title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      floating_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      bottom_label: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

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

    await queryInterface.addIndex("new_arrivals_hero_banners", ["type"], {
      name: "idx_new_arrivals_hero_banners_type",
    });

    await queryInterface.addIndex("new_arrivals_hero_banners", ["status"], {
      name: "idx_new_arrivals_hero_banners_status",
    });

    await queryInterface.addIndex(
      "new_arrivals_hero_banners",
      ["createdAt"],
      {
        name: "idx_new_arrivals_hero_banners_created_at",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("new_arrivals_hero_banners");
  },
};