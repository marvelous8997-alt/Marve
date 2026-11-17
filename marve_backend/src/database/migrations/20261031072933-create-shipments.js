
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shipments", {
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

      orderId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      // Shiprocket Information
      shiprocketOrderId: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      shiprocketShipmentId: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      // Courier Information
      courierName: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },

      courierCode: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      trackingNumber: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },

      awbNumber: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },

      // Shipment Status
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
        defaultValue: "PENDING",
      },

      // Shipment Dates
      shippedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      estimatedDeliveryAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      deliveredAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      // Additional Information
      notes: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      lastTrackedAt: {
  type: Sequelize.DATE,
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
    // Indexes
    await queryInterface.addIndex("shipments", ["orderId"], {
      name: "shipments_order_id_index",
    });

    await queryInterface.addIndex("shipments", ["shiprocketOrderId"], {
      name: "shipments_shiprocket_order_id_index",
    });

    await queryInterface.addIndex("shipments", ["shiprocketShipmentId"], {
      name: "shipments_shiprocket_shipment_id_index",
    });

    await queryInterface.addIndex("shipments", ["trackingNumber"], {
      name: "shipments_tracking_number_index",
    });

    await queryInterface.addIndex("shipments", ["awbNumber"], {
      name: "shipments_awb_number_index",
    });

    await queryInterface.addIndex("shipments", ["status"], {
      name: "shipments_status_index",
    });

    await queryInterface.addIndex("shipments", ["createdAt"], {
      name: "shipments_created_at_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("shipments");
  },
};
