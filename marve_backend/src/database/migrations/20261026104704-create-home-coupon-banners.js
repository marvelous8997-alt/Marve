
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("home_coupon_banners", {
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
        type: Sequelize.ENUM("HOME_COUPON"),
        allowNull: false,
        defaultValue: "HOME_COUPON",
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

      // Promotional offer text
      offer_text: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      // Discount amount or percentage
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      // Discount calculation type
      discount_type: {
        type: Sequelize.ENUM("PERCENTAGE", "FIXED"),
        allowNull: false,
        defaultValue: "PERCENTAGE",
      },

      // Coupon code displayed on the banner
      coupon_code: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      // Terms and conditions text
      terms_text: {
        type: Sequelize.TEXT,
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
      "home_coupon_banners",
      ["type"],
      {
        name: "idx_home_coupon_banners_type",
      }
    );

    await queryInterface.addIndex(
      "home_coupon_banners",
      ["status"],
      {
        name: "idx_home_coupon_banners_status",
      }
    );

    await queryInterface.addIndex(
      "home_coupon_banners",
      ["coupon_code"],
      {
        name: "idx_home_coupon_banners_coupon_code",
      }
    );

    await queryInterface.addIndex(
      "home_coupon_banners",
      ["createdAt"],
      {
        name: "idx_home_coupon_banners_created_at",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("home_coupon_banners");
  },
};
