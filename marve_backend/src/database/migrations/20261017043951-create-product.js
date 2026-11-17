"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
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

      category_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      subcategory_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "subcategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      short_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },

      sku: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      compare_at_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      stock: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      // Product dimensions (single set per product)
      height: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      width: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      length: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      // Product weight
      weight: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
      },

      // Units for dimensions and weight
      dimension_unit: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "cm",
      },

      weight_unit: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "kg",
      },
      // Optional product video
      video_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      // Optional media-provider identifier, e.g. Cloudinary public ID
      video_public_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_new_arrival: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_bestseller: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_sale: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_offer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_gift: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      sort_order: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      updated_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    await queryInterface.addIndex("products", ["category_id"], {
      name: "idx_products_category_id",
    });

    await queryInterface.addIndex("products", ["subcategory_id"], {
      name: "idx_products_subcategory_id",
    });

    await queryInterface.addIndex("products", ["status"], {
      name: "idx_products_status",
    });

    await queryInterface.addIndex("products", ["sort_order"], {
      name: "idx_products_sort_order",
    });

    await queryInterface.addIndex(
      "products",
      ["featured", "is_new_arrival", "is_bestseller"],
      {
        name: "idx_products_storefront_flags",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("products");
  },
};