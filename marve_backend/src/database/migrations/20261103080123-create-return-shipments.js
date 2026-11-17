
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("return_shipments", {
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

      returnRequestId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "return_requests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      shiprocketOrderId: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      shiprocketShipmentId: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      courierName: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      courierCode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      trackingNumber: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      awbNumber: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      status: {
        allowNull: false,
        type: Sequelize.ENUM(
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
        defaultValue: "PENDING",
      },

      pickupFullName: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      pickupPhone: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },

      pickupEmail: {
        allowNull: true,
        type: Sequelize.STRING(191),
      },

      pickupAddress: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      pickupLocality: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      pickupLandmark: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },

      pickupCity: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      pickupState: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      pickupPincode: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },

      pickupCountry: {
        allowNull: false,
        type: Sequelize.STRING(2),
        defaultValue: "IN",
      },

      pickupScheduledAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      pickedUpAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      lastTrackedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      "return_shipments",
      ["returnRequestId"],
      {
        name: "return_shipments_return_request_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_shipments",
      ["shiprocketOrderId"],
      {
        name: "return_shipments_shiprocket_order_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_shipments",
      ["shiprocketShipmentId"],
      {
        name: "return_shipments_shiprocket_shipment_id_index",
      }
    );

    await queryInterface.addIndex(
      "return_shipments",
      ["trackingNumber"],
      {
        name: "return_shipments_tracking_number_index",
      }
    );

    await queryInterface.addIndex(
      "return_shipments",
      ["awbNumber"],
      {
        name: "return_shipments_awb_number_index",
      }
    );

    await queryInterface.addIndex(
      "return_shipments",
      ["status"],
      {
        name: "return_shipments_status_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("return_shipments");
  },
};
