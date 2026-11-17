
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariation extends Model {
    static associate(models) {
      // Each variation belongs to one parent product.
      ProductVariation.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        onDelete: "CASCADE",
      });

      // Admin who created the variation.
      ProductVariation.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // Admin who last updated the variation.
      ProductVariation.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
      // Cart items that reference this variation.
ProductVariation.hasMany(models.CartItem, {
  foreignKey: "product_variation_id",
  as: "cartItems",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
    }
  }

  ProductVariation.init(
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

      product_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Variation name is required.",
          },
        },
      },

      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Variation SKU is required.",
          },
        },
      },
      attributes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        validate: {
          isValidAttributes(value) {
            if (
              !value ||
              typeof value !== "object" ||
              Array.isArray(value) ||
              Object.keys(value).length === 0
            ) {
              throw new Error(
                "At least one valid variation attribute is required."
              );
            }

            for (const [key, attributeValue] of Object.entries(value)) {
              if (
                !key.trim() ||
                attributeValue === null ||
                attributeValue === undefined ||
                String(attributeValue).trim() === ""
              ) {
                throw new Error(
                  "Variation attribute names and values cannot be empty."
                );
              }
            }
          },
        },
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      compare_at_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },

      stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      sort_order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
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
      modelName: "ProductVariation",
      tableName: "product_variations",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["product_id"],
          name: "idx_product_variations_product_id",
        },
        {
          fields: ["status"],
          name: "idx_product_variations_status",
        },
        {
          fields: ["sort_order"],
          name: "idx_product_variations_sort_order",
        },
      ],
    }
  );

  return ProductVariation;
};
