"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },

      orderId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      productId: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      productVariationId: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "product_variations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      // Purchase-time product snapshot
      productName: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      productSlug: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },

      productSku: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      variationName: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },

      variationSku: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      productImage: {
        allowNull: true,
        type: Sequelize.STRING(2048),
      },

      variationAttributes: {
        allowNull: true,
        type: Sequelize.JSON,
      },

      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },

      unitPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
      },

      unitDiscount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      // Identifies a BOGO coupon free gift item
isFreeGift: {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  field: "is_free_gift",
},

      taxRate: {
        allowNull: false,
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      },

      taxAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      lineTotal: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
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

    await queryInterface.addIndex("order_items", ["orderId"], {
      name: "order_items_order_id_index",
    });

    await queryInterface.addIndex("order_items", ["productId"], {
      name: "order_items_product_id_index",
    });

    await queryInterface.addIndex("order_items", ["productVariationId"], {
      name: "order_items_variation_id_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("order_items");
  },
};