
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingBanners] = await queryInterface.sequelize.query(
      `SELECT id FROM home_coupon_banners WHERE type = 'HOME_COUPON' LIMIT 1`
    );

    // Prevent duplicate Home Coupon Banner records.
    if (existingBanners.length > 0) {
      console.log("Home Coupon Banner already exists. Skipping seed.");
      return;
    }

    await queryInterface.bulkInsert("home_coupon_banners", [
      {
        uuid: Sequelize.literal("UUID()"),
        type: "HOME_COUPON",

        // Replace with the actual Cloudinary image URL when available.
        image: "/assets/images/home/home_lifestyle.jpg",

        eyebrow: "A little something for you",
        heading: "Make your home",
        highlighted_heading: "a little more beautiful.",
        description:
          "Enjoy an exclusive offer on your next MARVE purchase. Bring thoughtful essentials into your everyday spaces.",

        button_text: "Shop the collection",
        button_link: "/products",

        offer_text: "Get 10% OFF on your first order",
        discount_value: 10.00,
        discount_type: "PERCENTAGE",
        coupon_code: "MARVE10",

        terms_text:
          "*Offer valid on eligible products. Terms & conditions apply.",

        status: "ACTIVE",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("Home Coupon Banner seeded successfully.");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("home_coupon_banners", {
      type: "HOME_COUPON",
    });
  },
};
