"use strict";

const { Model } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class ProductAttributeValue extends Model {
    static associate(models) {
      ProductAttributeValue.belongsTo(models.ProductAttribute, {
        foreignKey: "attribute_id",
        as: "attribute",
        onDelete: "CASCADE",
      });

      ProductAttributeValue.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      ProductAttributeValue.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  ProductAttributeValue.init(
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

      attribute_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Attribute value is required.",
          },
          len: {
            args: [1, 100],
            msg: "Attribute value must be between 1 and 100 characters.",
          },
        },
      },

      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },

      color_code: {
        type: DataTypes.STRING(7),
        allowNull: true,
        validate: {
          is: {
            args: /^#[0-9A-Fa-f]{6}$/,
            msg: "Color code must be a valid 6-digit hex color.",
          },
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
      modelName: "ProductAttributeValue",
      tableName: "product_attribute_values",
      timestamps: true,

      hooks: {
        beforeValidate(attributeValue) {
          if (attributeValue.value && !attributeValue.slug) {
            attributeValue.slug = slugify(attributeValue.value, {
              lower: true,
              strict: true,
              trim: true,
            });
          }
        },
      },

      indexes: [
        {
          fields: ["attribute_id"],
          name: "idx_product_attribute_values_attribute_id",
        },
        {
          fields: ["attribute_id", "status"],
          name: "idx_product_attribute_values_status",
        },
        {
          unique: true,
          fields: ["attribute_id", "slug"],
          name: "uq_product_attribute_values_attribute_slug",
        },
        {
          fields: ["attribute_id", "sort_order"],
          name: "idx_product_attribute_values_sort_order",
        },
      ],
    }
  );

  return ProductAttributeValue;
};