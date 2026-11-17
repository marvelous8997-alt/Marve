"use strict";

const { Model } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      Category.belongsTo(models.Admin, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
      Category.hasMany(models.Subcategory, {
        foreignKey: "category_id",
        as: "subcategories",
      });
    }
  }

  Category.init(
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
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
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
      modelName: "Category",
      tableName: "categories",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      hooks: {
        beforeValidate(category) {
          // Generate slug only when one has not been provided.
          // This preserves manually edited slugs from the frontend.
          if (category.name && !category.slug) {
            category.slug = slugify(category.name, {
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
          name: "idx_categories_status",
        },
        {
          fields: ["sort_order"],
          name: "idx_categories_sort_order",
        },
      ],
    }
  );

  return Category;
};