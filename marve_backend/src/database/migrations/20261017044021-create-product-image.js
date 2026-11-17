"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_images", {
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

      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      alt_text: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      sort_order: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
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
      "product_images",
      ["product_id"],
      {
        name: "idx_product_images_product_id",
      }
    );

    await queryInterface.addIndex(
      "product_images",
      ["product_id", "is_primary"],
      {
        name: "idx_product_images_primary",
      }
    );

    await queryInterface.addIndex(
      "product_images",
      ["product_id", "sort_order"],
      {
        name: "idx_product_images_sort_order",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("product_images");
  },
};