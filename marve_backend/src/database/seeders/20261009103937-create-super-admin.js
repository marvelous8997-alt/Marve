'use strict';

require("dotenv").config();

const bcrypt = require("bcryptjs");
const logger = require("../../utils/winston.util");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const adminName = process.env.DEFAULT_ADMIN_NAME;

  // Validate required environment variables
  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error(
      "DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, and DEFAULT_ADMIN_NAME must be configured in .env"
    );
  }

  const normalizedEmail = adminEmail.trim().toLowerCase();

  // Check whether the admin already exists
  const [existingAdmin] = await queryInterface.sequelize.query(
    `SELECT id FROM admins WHERE email = :email LIMIT 1`,
    {
      replacements: {
        email: normalizedEmail,
      },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  if (existingAdmin) {
    logger.warn("Super Admin already exists. Seeder skipped.");
    return;
  }

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Create Super Admin
  await queryInterface.bulkInsert("admins", [
    {
      name: adminName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      lastLoginAt: null,
      passwordChangedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  logger.info("Super Admin created successfully.");
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error(
        "DEFAULT_ADMIN_EMAIL must be configured to revert the Super Admin seeder."
      );
    }

    const normalizedEmail = adminEmail.trim().toLowerCase();

    await queryInterface.bulkDelete("admins", {
      email: normalizedEmail,
      role: "SUPER_ADMIN",
    });

    logger.info("Super Admin seed reverted successfully.");
  }
};
