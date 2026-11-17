
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InventoryStockMovement extends Model {
    static associate(models) {
      // Admin who performed the stock adjustment
      InventoryStockMovement.belongsTo(models.Admin, {
        foreignKey: "created_by",
        as: "createdBy",
      });
    }
  }

  InventoryStockMovement.init(
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

      item_type: {
        type: DataTypes.ENUM("PRODUCT", "VARIATION"),
        allowNull: false,
        validate: {
          isIn: [["PRODUCT", "VARIATION"]],
        },
      },

      item_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
        },
      },

      previous_stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      adjustment_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notZero(value) {
            if (value === 0) {
              throw new Error(
                "Adjustment quantity cannot be zero."
              );
            }
          },
        },
      },

      new_stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      reason: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Stock adjustment reason is required.",
          },
          len: [1, 100],
        },
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "InventoryStockMovement",
      tableName: "inventory_stock_movements",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["item_type", "item_id"],
          name: "idx_inventory_movements_item",
        },
        {
          fields: ["created_by"],
          name: "idx_inventory_movements_created_by",
        },
        {
          fields: ["createdAt"],
          name: "idx_inventory_movements_created_at",
        },
      ],
    }
  );

  return InventoryStockMovement;
};
