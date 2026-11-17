
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ShipmentTrackingEvent extends Model {
    static associate(models) {
      ShipmentTrackingEvent.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
        as: "shipment",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  ShipmentTrackingEvent.init(
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

      shipmentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
providerEventId: {
  type: DataTypes.STRING(150),
  allowNull: true,
},
      // Tracking Status
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
      },

      // Tracking Location
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
        set(value) {
          this.setDataValue(
            "location",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      // Tracking Description
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
          this.setDataValue(
            "description",
            typeof value === "string" && value.trim()
              ? value.trim()
              : null
          );
        },
      },

      // Event Date
      eventAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },

      // Event Source
      source: {
        type: DataTypes.ENUM(
          "ADMIN",
          "COURIER",
          "SYSTEM"
        ),
        allowNull: false,
        defaultValue: "SYSTEM",
      },

      // Original Courier Response
      rawPayload: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ShipmentTrackingEvent",
      tableName: "shipment_tracking_events",
      timestamps: true,
      indexes: [
        {
          name: "shipment_tracking_events_shipment_id_index",
          fields: ["shipmentId"],
        },
        {
          name: "shipment_tracking_events_status_index",
          fields: ["status"],
        },
        {
          name: "shipment_tracking_events_event_at_index",
          fields: ["eventAt"],
        },
        {
          name: "shipment_tracking_events_shipment_event_at_index",
          fields: ["shipmentId", "eventAt"],
        },
      ],
    }
  );

  return ShipmentTrackingEvent;
};
