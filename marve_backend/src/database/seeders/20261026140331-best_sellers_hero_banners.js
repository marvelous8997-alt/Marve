"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingBanners] = await queryInterface.sequelize.query(
      `SELECT id
       FROM best_sellers_hero_banners
       WHERE type = 'BEST_SELLERS_HERO'
       LIMIT 1`
    );

    if (existingBanners.length > 0) {
      console.log(
        "Best Sellers Hero Banner already exists. Skipping seed."
      );
      return;
    }

    await queryInterface.bulkInsert("best_sellers_hero_banners", [
      {
        uuid: Sequelize.literal("UUID()"),
        type: "BEST_SELLERS_HERO",

        // Replace with the actual Cloudinary URL when available.
        image: "/assets/images/home/home_lifestyle.jpg",

        eyebrow: "Customer Favourites",
        heading: "The pieces",
        highlighted_heading: "everyone loves.",

        description:
          "Discover the pieces our customers love most — timeless essentials chosen again and again for everyday living.",

        rating_text: "Loved by MARVE customers",

        button_text: "Shop Bestsellers",
        button_link: "#bestsellers-products",

        floating_label: "Most Loved",
        floating_title: "Tried. Loved. Chosen.",

        floating_description:
          "The pieces customers keep coming back for — beautiful, practical and made for everyday living.",

        bottom_label: "MARVE · BESTSELLING COLLECTION",

        status: "ACTIVE",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("Best Sellers Hero Banner seeded successfully.");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("best_sellers_hero_banners", {
      type: "BEST_SELLERS_HERO",
    });
  },
};