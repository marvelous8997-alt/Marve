
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingBanners] = await queryInterface.sequelize.query(
      `SELECT id FROM home_essentials_hero_banners
       WHERE type = 'HOME_ESSENTIALS_HERO'
       LIMIT 1`
    );

    if (existingBanners.length > 0) {
      console.log(
        "Home Essentials Hero Banner already exists. Skipping seed."
      );
      return;
    }

    await queryInterface.bulkInsert("home_essentials_hero_banners", [
      {
        uuid: Sequelize.literal("UUID()"),
        type: "HOME_ESSENTIALS_HERO",

        // Replace with the actual Cloudinary image URL when available.
        image: "/assets/images/home/home_lifestyle.jpg",

        eyebrow: "The Home Collection",
        heading: "Beautiful essentials",
        highlighted_heading: "for every corner.",
        description:
          "Thoughtfully chosen essentials designed to bring comfort, warmth and effortless style to every corner of your home.",

        button_text: "Explore Collection",
        button_link: "#home-essentials-products",

        floating_label: "Home Edit",
        floating_title: "Live. Relax. Enjoy.",
        floating_description:
          "Beautifully practical pieces and thoughtful details for a home that feels warm, comfortable and effortlessly yours.",

        bottom_label: "MARVE · HOME COLLECTION",

        status: "ACTIVE",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("Home Essentials Hero Banner seeded successfully.");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("home_essentials_hero_banners", {
      type: "HOME_ESSENTIALS_HERO",
    });
  },
};
