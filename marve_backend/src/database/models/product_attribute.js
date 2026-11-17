"use strict";

const { Model } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class ProductAttribute extends Model {
    static associate(models) {
      ProductAttribute.hasMany(models.ProductAttributeValue, {
        foreignKey: "attribute_id",
        as: "values",
        onDelete: "CASCADE",
      });

      ProductAttribute.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      ProductAttribute.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  ProductAttribute.init(
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

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Attribute name is required.",
          },
          len: {
            args: [1, 100],
            msg: "Attribute name must be between 1 and 100 characters.",
          },
        },
      },

      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: "ProductAttribute",
      tableName: "product_attributes",
      timestamps: true,

      hooks: {
        beforeValidate(attribute) {
          if (attribute.name && !attribute.slug) {
            attribute.slug = slugify(attribute.name, {
              lower: true,
              strict: true,
              trim: true,
            });
          }
        },
      },

      indexes: [
        {
          fields: ["status"],
          name: "idx_product_attributes_status",
        },
        {
          fields: ["sort_order"],
          name: "idx_product_attributes_sort_order",
        },
      ],
    }
  );

  return ProductAttribute;
};