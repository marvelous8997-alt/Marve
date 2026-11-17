"use strict";

const { Model } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product belongs to Category
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      // Product belongs to Subcategory
      Product.belongsTo(models.Subcategory, {
        foreignKey: "subcategory_id",
        as: "subcategory",
      });

      // Product has multiple images
      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
        onDelete: "CASCADE",
      });

      // Admin who created the product
      Product.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // Admin who last updated the product
      Product.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
      // Product has multiple variations
      Product.hasMany(models.ProductVariation, {
        foreignKey: "product_id",
        as: "variations",
        onDelete: "CASCADE",
      });
      Product.hasMany(models.CartItem, {
        foreignKey: "product_id",
        as: "cartItems",
      });
      
      // Product is eligible as a Buy Product in BOGO Coupons
      Product.hasMany(models.BogoCouponBuyProduct, {
        foreignKey: "product_id",
        as: "bogoBuyCoupons",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // Product is eligible as a Get Product in BOGO Coupons
      Product.hasMany(models.BogoCouponGetProduct, {
        foreignKey: "product_id",
        as: "bogoGetCoupons",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // Product can be selected as a BOGO gift in a Cart
Product.hasMany(models.Cart, {
  foreignKey: "selected_bogo_product_id",
  as: "selectedAsBogoGift",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Product can be saved by multiple users as a favourite.
Product.hasMany(models.Favourite, {
  foreignKey: "product_id",
  as: "favourites",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      subcategory_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      short_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },

      sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      compare_at_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      // Product dimensions (single set per product)
      height: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      width: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      length: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      // Product weight
      weight: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true,
      },

      // Units for dimensions and weight
      dimension_unit: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "cm",
      },

      weight_unit: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "kg",
      },
      // Optional product video (maximum one video per product)
      video_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      // Optional media-provider identifier
      video_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_new_arrival: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_bestseller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_sale: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_offer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_gift: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      sort_order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      hooks: {
        beforeValidate(product) {
          // Generate a slug only when one has not been provided.
          // Existing manually entered slugs remain unchanged.
          if (product.name && !product.slug) {
            product.slug = slugify(product.name, {
              lower: true,
              strict: true,
              trim: true,
            });
          }
        },
      },

      indexes: [
        {
          fields: ["category_id"],
          name: "idx_products_category_id",
        },
        {
          fields: ["subcategory_id"],
          name: "idx_products_subcategory_id",
        },
        {
          fields: ["status"],
          name: "idx_products_status",
        },
        {
          fields: ["sort_order"],
          name: "idx_products_sort_order",
        },
        {
          fields: ["featured", "is_new_arrival", "is_bestseller"],
          name: "idx_products_storefront_flags",
        },
      ],
    }
  );

  return Product;
};