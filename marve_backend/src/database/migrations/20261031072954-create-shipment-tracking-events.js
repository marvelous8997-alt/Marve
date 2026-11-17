
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shipment_tracking_events", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
providerEventId: {
  type: Sequelize.STRING(150),
  allowNull: true,
},
      shipmentId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "shipments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // Tracking Status
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
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
      },

      // Tracking Location
      location: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },

      // Tracking Description
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      // Event Date
      eventAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      // Event Source (ADMIN / COURIER / SYSTEM)
      source: {
        allowNull: false,
        type: Sequelize.ENUM(
          "ADMIN",
          "COURIER",
          "SYSTEM"
        ),
        defaultValue: "SYSTEM",
      },

      // Original Courier Response (if available)
      rawPayload: {
        allowNull: true,
        type: Sequelize.JSON,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    // Indexes
    await queryInterface.addIndex(
      "shipment_tracking_events",
      ["shipmentId"],
      {
        name: "shipment_tracking_events_shipment_id_index",
      }
    );

    await queryInterface.addIndex(
      "shipment_tracking_events",
      ["status"],
      {
        name: "shipment_tracking_events_status_index",
      }
    );

    await queryInterface.addIndex(
      "shipment_tracking_events",
      ["eventAt"],
      {
        name: "shipment_tracking_events_event_at_index",
      }
    );

    await queryInterface.addIndex(
      "shipment_tracking_events",
      ["shipmentId", "eventAt"],
      {
        name: "shipment_tracking_events_shipment_event_at_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("shipment_tracking_events");
  },
};
