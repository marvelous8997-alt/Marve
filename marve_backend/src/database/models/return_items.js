
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReturnItem extends Model {
    static associate(models) {
      ReturnItem.belongsTo(models.ReturnRequest, {
        foreignKey: "returnRequestId",
        as: "returnRequest",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      ReturnItem.belongsTo(models.OrderItem, {
        foreignKey: "orderItemId",
        as: "orderItem",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  ReturnItem.init(
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

      returnRequestId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      orderItemId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
        },
      },

      unitPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      refundAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      itemCondition: {
        type: DataTypes.ENUM(
          "UNINSPECTED",
          "GOOD",
          "DAMAGED",
          "USED",
          "REJECTED"
        ),
        allowNull: true,
        defaultValue: "UNINSPECTED",
      },

      inspectionNote: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
          this.setDataValue(
            "inspectionNote",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },
    },
    {
      sequelize,
      modelName: "ReturnItem",
      tableName: "return_items",
      timestamps: true,
      indexes: [
        {
          name: "return_items_return_request_id_index",
          fields: ["returnRequestId"],
        },
        {
          name: "return_items_order_item_id_index",
          fields: ["orderItemId"],
        },
        {
          name: "return_items_item_condition_index",
          fields: ["itemCondition"],
        },
        {
          name: "return_items_request_order_item_index",
          fields: ["returnRequestId", "orderItemId"],
        },
      ],
    }
  );

  return ReturnItem;
};
