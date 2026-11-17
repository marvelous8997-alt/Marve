"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingBanners] = await queryInterface.sequelize.query(
      `SELECT id FROM new_arrivals_hero_banners
       WHERE type = 'NEW_ARRIVALS_HERO'
       LIMIT 1`
    );

    if (existingBanners.length > 0) {
      console.log(
        "New Arrivals Hero Banner already exists. Skipping seed."
      );
      return;
    }

    await queryInterface.bulkInsert("new_arrivals_hero_banners", [
      {
        uuid: Sequelize.literal("UUID()"),
        type: "NEW_ARRIVALS_HERO",

        // Replace with the actual Cloudinary image URL when available.
        image: "/assets/images/home/home_lifestyle.jpg",

        eyebrow: "Just Arrived",
        heading: "Discover something",
        highlighted_heading: "beautifully new.",
        description:
          "Explore the latest additions to MARVE, thoughtfully selected to bring elegance and style into your everyday spaces.",

        button_text: "Explore New Arrivals",
        button_link: "/new-arrivals",

        floating_label: "Fresh Finds",
        floating_title: "New Season. New Style.",
        floating_description:
          "Discover thoughtfully chosen pieces designed to make everyday living more beautiful.",

        bottom_label: "Thoughtfully curated for your home",

        status: "ACTIVE",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("New Arrivals Hero Banner seeded successfully.");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("new_arrivals_hero_banners", {
      type: "NEW_ARRIVALS_HERO",
    });
  },
};