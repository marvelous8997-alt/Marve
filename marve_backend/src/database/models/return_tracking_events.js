
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReturnTrackingEvent extends Model {
    static associate(models) {
      ReturnTrackingEvent.belongsTo(models.ReturnShipment, {
        foreignKey: "returnShipmentId",
        as: "returnShipment",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  ReturnTrackingEvent.init(
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

      returnShipmentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      providerEventId: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      status: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      eventAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      source: {
        type: DataTypes.ENUM(
          "ADMIN",
          "COURIER",
          "SYSTEM"
        ),
        allowNull: false,
        defaultValue: "SYSTEM",
      },

      rawPayload: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ReturnTrackingEvent",
      tableName: "return_tracking_events",
      timestamps: true,
      indexes: [
        {
          name: "return_tracking_events_return_shipment_id_index",
          fields: ["returnShipmentId"],
        },
        {
          name: "return_tracking_events_provider_event_id_index",
          fields: ["providerEventId"],
        },
        {
          name: "return_tracking_events_status_index",
          fields: ["status"],
        },
        {
          name: "return_tracking_events_event_at_index",
          fields: ["eventAt"],
        },
        {
          name: "return_tracking_events_shipment_event_at_index",
          fields: ["returnShipmentId", "eventAt"],
        },
      ],
    }
  );

  return ReturnTrackingEvent;
};
