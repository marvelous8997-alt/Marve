
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("checkout_addresses", {
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

      userId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      fullName: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      phone: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },

      email: {
        allowNull: true,
        type: Sequelize.STRING(191),
      },

      pincode: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },

      houseNumber: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      address: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      locality: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      landmark: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },

      city: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      state: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },

      addressType: {
        allowNull: false,
        type: Sequelize.ENUM("HOME", "FRIENDS", "WORK", "OTHER"),
        defaultValue: "HOME",
      },

      isDefault: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      latitude: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 7),
      },

      longitude: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 7),
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

    await queryInterface.addIndex("checkout_addresses", ["userId"], {
      name: "checkout_addresses_user_id_index",
    });

    await queryInterface.addIndex(
      "checkout_addresses",
      ["userId", "isDefault"],
      {
        name: "checkout_addresses_default_index",
      }
    );

    await queryInterface.addIndex("checkout_addresses", ["pincode"], {
      name: "checkout_addresses_pincode_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("checkout_addresses");
  },
};
