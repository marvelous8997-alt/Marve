
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bogo_coupon_get_products", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      bogo_coupon_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "bogo_coupons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    await queryInterface.addConstraint("bogo_coupon_get_products", {
      fields: ["bogo_coupon_id", "product_id"],
      type: "unique",
      name: "uq_bogo_get_coupon_product",
    });

    await queryInterface.addIndex(
      "bogo_coupon_get_products",
      ["bogo_coupon_id"],
      {
        name: "idx_bogo_get_coupon_id",
      }
    );

    await queryInterface.addIndex(
      "bogo_coupon_get_products",
      ["product_id"],
      {
        name: "idx_bogo_get_product_id",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bogo_coupon_get_products");
  },
};
