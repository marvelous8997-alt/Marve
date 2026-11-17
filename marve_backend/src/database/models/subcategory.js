"use strict";

const { Model } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    static associate(models) {
      Subcategory.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      Subcategory.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      Subcategory.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  Subcategory.init(
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

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      slug: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },

      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      icon: {
        type: DataTypes.STRING(100),
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
      modelName: "Subcategory",
      tableName: "subcategories",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      hooks: {
        beforeValidate(subcategory) {
          // Generate slug only when one has not been provided.
          // This preserves manually edited slugs from the frontend.
          if (subcategory.name && !subcategory.slug) {
            subcategory.slug = slugify(subcategory.name, {
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
          name: "idx_subcategories_category_id",
        },
        {
          fields: ["status"],
          name: "idx_subcategories_status",
        },
        {
          fields: ["sort_order"],
          name: "idx_subcategories_sort_order",
        },
      ],
    }
  );

  return Subcategory;
};