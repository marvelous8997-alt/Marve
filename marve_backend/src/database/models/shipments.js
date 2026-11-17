
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    static associate(models) {
      Shipment.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Shipment.hasMany(models.ShipmentTrackingEvent, {
        foreignKey: "shipmentId",
        as: "trackingEvents",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Shipment.init(
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
shiprocketOrderId: {
  type: DataTypes.STRING(100),
  allowNull: true,
},

shiprocketShipmentId: {
  type: DataTypes.STRING(100),
  allowNull: true,
},
      // Courier Information
      courierName: {
        type: DataTypes.STRING(150),
        allowNull: true,
        set(value) {
          this.setDataValue(
            "courierName",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      courierCode: {
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value) {
          this.setDataValue(
            "courierCode",
            typeof value === "string" && value.trim()
              ? value.trim().toUpperCase()
              : null
          );
        },
      },

      trackingNumber: {
        type: DataTypes.STRING(150),
        allowNull: true,
        set(value) {
          this.setDataValue(
            "trackingNumber",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      awbNumber: {
        type: DataTypes.STRING(150),
        allowNull: true,
        set(value) {
          this.setDataValue(
            "awbNumber",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      // Shipment Status
      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "READY_TO_SHIP",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELLED",
          "RETURN_TO_ORIGIN"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      // Shipment Dates
      shippedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      estimatedDeliveryAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // Additional Information
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lastTrackedAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
    },
    {
      sequelize,
      modelName: "Shipment",
      tableName: "shipments",
      timestamps: true,
indexes: [
  {
    name: "shipments_order_id_index",
    fields: ["orderId"],
  },
  {
    name: "shipments_shiprocket_order_id_index",
    fields: ["shiprocketOrderId"],
  },
  {
    name: "shipments_shiprocket_shipment_id_index",
    fields: ["shiprocketShipmentId"],
  },
  {
    name: "shipments_tracking_number_index",
    fields: ["trackingNumber"],
  },
  {
    name: "shipments_awb_number_index",
    fields: ["awbNumber"],
  },
  {
    name: "shipments_status_index",
    fields: ["status"],
  },
  {
    name: "shipments_created_at_index",
    fields: ["createdAt"],
  },
],
    }
  );

  return Shipment;
};
