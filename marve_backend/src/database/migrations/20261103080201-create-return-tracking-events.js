
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("return_tracking_events", {
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

      returnShipmentId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "return_shipments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      providerEventId: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      status: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      location: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      eventAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      source: {
        allowNull: false,
        type: Sequelize.ENUM(
          "ADMIN",
          "COURIER",
          "SYSTEM"
        ),
        defaultValue: "SYSTEM",
      },

      rawPayload: {
        type: Sequelize.JSON,
        allowNull: true,
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
      "return_tracking_events",
      ["returnShipmentId"],
      {
        name: "return_tracking_events_return_shipment_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_tracking_events",
      ["providerEventId"],
      {
        name: "return_tracking_events_provider_event_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_tracking_events",
      ["status"],
      {
        name: "return_tracking_events_status_index",
      }
    );

    await queryInterface.addIndex(
      "return_tracking_events",
      ["eventAt"],
      {
        name: "return_tracking_events_event_at_index",
      }
    );

    await queryInterface.addIndex(
      "return_tracking_events",
      ["returnShipmentId", "eventAt"],
      {
        name: "return_tracking_events_shipment_event_at_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("return_tracking_events");
  },
};
