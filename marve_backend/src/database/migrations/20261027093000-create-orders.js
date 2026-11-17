"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
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

      orderNumber: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true,
      },

      userId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      checkoutAddressId: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "checkout_addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      // Delivery address snapshot
      deliveryFullName: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      deliveryPhone: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },

      deliveryEmail: {
        allowNull: true,
        type: Sequelize.STRING(191),
      },

      deliveryPincode: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },

      deliveryHouseNumber: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      deliveryAddress: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      deliveryLocality: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      deliveryLandmark: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },

      deliveryCity: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      deliveryState: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      deliveryPincodeCountry: {
        allowNull: false,
        type: Sequelize.STRING(2),
        defaultValue: "IN",
      },

      // Order totals
      currency: {
        allowNull: false,
        type: Sequelize.STRING(3),
        defaultValue: "INR",
      },

      subtotal: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      productDiscount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      couponDiscount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      taxAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      shippingAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      codCharge: {
  allowNull: false,
  type: Sequelize.DECIMAL(12, 2),
  defaultValue: 0,
},

      totalAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      // Coupon snapshot
      couponId: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },

      couponCode: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },

      // Payment selection
      paymentMethod: {
        allowNull: false,
        type: Sequelize.ENUM("ONLINE", "COD"),
      },

      paymentStatus: {
        allowNull: false,
        type: Sequelize.ENUM(
          "PENDING",
          "PROCESSING",
          "PAID",
          "FAILED",
          "CANCELLED",
          "REFUNDED",
          "PARTIALLY_REFUNDED"
        ),
        defaultValue: "PENDING",
      },

      orderStatus: {
        allowNull: false,
        type: Sequelize.ENUM(
          "PENDING_PAYMENT",
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
          "RETURN_REQUESTED",
          "RETURNED"
        ),
        defaultValue: "PENDING_PAYMENT",
      },

      notes: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      placedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      cancelledAt: {
        allowNull: true,
        type: Sequelize.DATE,
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

    await queryInterface.addIndex("orders", ["userId"], {
      name: "orders_user_id_index",
    });

    await queryInterface.addIndex("orders", ["checkoutAddressId"], {
      name: "orders_checkout_address_id_index",
    });

    await queryInterface.addIndex("orders", ["orderStatus"], {
      name: "orders_status_index",
    });

    await queryInterface.addIndex("orders", ["paymentStatus"], {
      name: "orders_payment_status_index",
    });

    await queryInterface.addIndex("orders", ["paymentMethod"], {
      name: "orders_payment_method_index",
    });

    await queryInterface.addIndex("orders", ["createdAt"], {
      name: "orders_created_at_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  },
};