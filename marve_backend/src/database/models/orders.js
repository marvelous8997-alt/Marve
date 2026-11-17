"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Order.belongsTo(models.CheckoutAddress, {
        foreignKey: "checkoutAddressId",
        as: "checkoutAddress",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "items",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Order.hasMany(models.Payment, {
        foreignKey: "orderId",
        as: "payments",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
      Order.hasMany(models.Shipment, {
  foreignKey: "orderId",
  as: "shipments",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

// Return Requests
Order.hasMany(models.ReturnRequest, {
  foreignKey: "orderId",
  as: "returnRequests",
});
    }
  }

  Order.init(
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

      orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
        set(value) {
          this.setDataValue(
            "orderNumber",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      checkoutAddressId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      // Delivery address snapshot
      deliveryFullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 150],
        },
        set(value) {
          this.setDataValue(
            "deliveryFullName",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      deliveryPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 20],
        },
        set(value) {
          this.setDataValue(
            "deliveryPhone",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      deliveryEmail: {
        type: DataTypes.STRING(191),
        allowNull: true,
        validate: {
          isEmail(value) {
            if (
              value &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
              throw new Error("Please provide a valid delivery email.");
            }
          },
          len: [5, 191],
        },
        set(value) {
          this.setDataValue(
            "deliveryEmail",
            typeof value === "string" && value.trim()
              ? value.trim().toLowerCase()
              : null
          );
        },
      },

      deliveryPincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 10],
        },
        set(value) {
          this.setDataValue(
            "deliveryPincode",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      deliveryHouseNumber: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 150],
        },
        set(value) {
          this.setDataValue(
            "deliveryHouseNumber",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      deliveryAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
        set(value) {
          this.setDataValue(
            "deliveryAddress",
            typeof value === "string" ? value.trim() : value
          );
        },
      },

      deliveryLocality: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 150],
        },
      },

      deliveryLandmark: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          len: [0, 150],
        },
      },

      deliveryCity: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },

      deliveryState: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },

      deliveryPincodeCountry: {
        type: DataTypes.STRING(2),
        allowNull: false,
        defaultValue: "IN",
        validate: {
          len: [2, 2],
        },
        set(value) {
          this.setDataValue(
            "deliveryPincodeCountry",
            typeof value === "string" ? value.trim().toUpperCase() : value
          );
        },
      },

      // Order totals
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "INR",
        validate: {
          len: [3, 3],
        },
        set(value) {
          this.setDataValue(
            "currency",
            typeof value === "string" ? value.trim().toUpperCase() : value
          );
        },
      },

      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      productDiscount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      couponDiscount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      taxAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      shippingAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      codCharge: {
  type: DataTypes.DECIMAL(12, 2),
  allowNull: false,
  defaultValue: 0,
  validate: { min: 0 },
},
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },

      // Coupon snapshot
      couponId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      couponCode: {
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value) {
          this.setDataValue(
            "couponCode",
            typeof value === "string" && value.trim()
              ? value.trim().toUpperCase()
              : null
          );
        },
      },

      paymentMethod: {
        type: DataTypes.ENUM("ONLINE", "COD"),
        allowNull: false,
      },

      paymentStatus: {
        type: DataTypes.ENUM(
          "PENDING",
          "PROCESSING",
          "PAID",
          "FAILED",
          "CANCELLED",
          "REFUNDED",
          "PARTIALLY_REFUNDED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      orderStatus: {
        type: DataTypes.ENUM(
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
        allowNull: false,
        defaultValue: "PENDING_PAYMENT",
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      placedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
      indexes: [
        {
          name: "orders_user_id_index",
          fields: ["userId"],
        },
        {
          name: "orders_checkout_address_id_index",
          fields: ["checkoutAddressId"],
        },
        {
          name: "orders_order_status_index",
          fields: ["orderStatus"],
        },
        {
          name: "orders_payment_status_index",
          fields: ["paymentStatus"],
        },
        {
          name: "orders_payment_method_index",
          fields: ["paymentMethod"],
        },
        {
          name: "orders_created_at_index",
          fields: ["createdAt"],
        },
      ],
    }
  );

  return Order;
};