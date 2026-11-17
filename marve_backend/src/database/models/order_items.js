"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      OrderItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });

      OrderItem.belongsTo(models.ProductVariation, {
        foreignKey: "productVariationId",
        as: "variation",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });

      // Return Items
OrderItem.hasMany(models.ReturnItem, {
  foreignKey: "orderItemId",
  as: "returnItems",
});
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      orderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      productId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      productVariationId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      productName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
        set(value) {
          this.setDataValue(
            "productName",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      productSlug: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      productSku: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      variationName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      variationSku: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      productImage: {
        type: DataTypes.STRING(2048),
        allowNull: true,
      },

      variationAttributes: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
          max: 4294967295,
        },
      },

      unitPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0 },
      },

      unitDiscount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      // Identifies a BOGO coupon free gift item
isFreeGift: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false,
  field: "is_free_gift",
},
      taxRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },

      taxAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      lineTotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0 },
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
      timestamps: true,
      indexes: [
        {
          name: "order_items_order_id_index",
          fields: ["orderId"],
        },
        {
          name: "order_items_product_id_index",
          fields: ["productId"],
        },
        {
          name: "order_items_product_variation_id_index",
          fields: ["productVariationId"],
        },
      ],
    }
  );

  return OrderItem;
};