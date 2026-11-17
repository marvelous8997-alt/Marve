
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReturnShipment extends Model {
    static associate(models) {
      ReturnShipment.belongsTo(models.ReturnRequest, {
        foreignKey: "returnRequestId",
        as: "returnRequest",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      ReturnShipment.hasMany(models.ReturnTrackingEvent, {
        foreignKey: "returnShipmentId",
        as: "trackingEvents",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  ReturnShipment.init(
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

      shiprocketOrderId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      shiprocketShipmentId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      courierName: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      courierCode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      trackingNumber: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      awbNumber: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "PICKUP_SCHEDULED",
          "PICKUP_REQUESTED",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "PICKUP_FAILED",
          "CANCELLED",
          "RTO"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      pickupFullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      pickupPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

      pickupEmail: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },

      pickupAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      pickupLocality: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      pickupLandmark: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      pickupCity: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      pickupState: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      pickupPincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },

      pickupCountry: {
        type: DataTypes.STRING(2),
        allowNull: false,
        defaultValue: "IN",
      },

      pickupScheduledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      pickedUpAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      lastTrackedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      rawPayload: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ReturnShipment",
      tableName: "return_shipments",
      timestamps: true,
      indexes: [
        {
          name: "return_shipments_return_request_id_index",
          fields: ["returnRequestId"],
        },
        {
          name: "return_shipments_shiprocket_order_id_index",
          fields: ["shiprocketOrderId"],
        },
        {
          name: "return_shipments_shiprocket_shipment_id_index",
          fields: ["shiprocketShipmentId"],
        },
        {
          name: "return_shipments_tracking_number_index",
          fields: ["trackingNumber"],
        },
        {
          name: "return_shipments_awb_number_index",
          fields: ["awbNumber"],
        },
        {
          name: "return_shipments_status_index",
          fields: ["status"],
        },
      ],
    }
  );

  return ReturnShipment;
};
