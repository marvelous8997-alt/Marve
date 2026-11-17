
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingBanners] = await queryInterface.sequelize.query(
      `SELECT id FROM kitchen_essentials_hero_banners
       WHERE type = 'KITCHEN_ESSENTIALS_HERO'
       LIMIT 1`
    );

    if (existingBanners.length > 0) {
      console.log(
        "Kitchen Essentials Hero Banner already exists. Skipping seed."
      );
      return;
    }

    await queryInterface.bulkInsert(
      "kitchen_essentials_hero_banners",
      [
        {
          uuid: Sequelize.literal("UUID()"),
          type: "KITCHEN_ESSENTIALS_HERO",

          // Replace with the actual Cloudinary URL when available.
          image: "/assets/images/home/home_lifestyle.jpg",

          eyebrow: "The Kitchen Collection",
          heading: "Everything your",
          highlighted_heading: "kitchen needs.",

          description:
            "Thoughtfully chosen essentials designed to make cooking, serving and everyday kitchen moments simpler and more beautiful.",

          button_text: "Explore Collection",
          button_link: "#kitchen-essentials-products",

          floating_label: "Kitchen Edit",
          floating_title: "Cook. Serve. Enjoy.",

          floating_description:
            "Practical pieces and thoughtful details for a kitchen that works beautifully every day.",

          floating_bottom_label: "MARVE Kitchen",
          bottom_label: "MARVE · KITCHEN COLLECTION",

          status: "ACTIVE",

          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    );

    console.log(
      "Kitchen Essentials Hero Banner seeded successfully."
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      "kitchen_essentials_hero_banners",
      {
        type: "KITCHEN_ESSENTIALS_HERO",
      }
    );
  },
};
