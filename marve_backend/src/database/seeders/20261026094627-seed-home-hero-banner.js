"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingBanners] = await queryInterface.sequelize.query(
      `SELECT id FROM home_hero_banners WHERE type = 'HOME_HERO' LIMIT 1`
    );

    // Prevent duplicate Home Hero Banner records.
    if (existingBanners.length > 0) {
      console.log("Home Hero Banner already exists. Skipping seed.");
      return;
    }

    await queryInterface.bulkInsert("home_hero_banners", [
      {
        uuid: Sequelize.literal("UUID()"),
        type: "HOME_HERO",

        // Replace this with your actual Cloudinary image URL.
        image: "/assets/images/home/home_lifestyle.jpg",

        eyebrow: "Thoughtfully made for your home",
        heading: "Make space for",
        highlighted_heading: "beautiful living.",
        description:
          "Discover thoughtfully designed essentials that bring comfort, warmth, and timeless style to your everyday living.",
        button_text: "Explore collection",
        button_link: "/common/products",
        bottom_label: "MARVE Home & Kitchen",

        status: "ACTIVE",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("Home Hero Banner seeded successfully.");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("home_hero_banners", {
      type: "HOME_HERO",
    });
  },
};