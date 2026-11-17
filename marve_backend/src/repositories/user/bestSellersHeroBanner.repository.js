
"use strict";

const { BestSellersHeroBanner } = require("../../database/models");

/* =========================
   GET ACTIVE BEST SELLERS HERO BANNER
   Used by the storefront
========================= */

const getActiveBestSellersHeroBanner = async () => {
  return await BestSellersHeroBanner.findOne({
    where: {
      type: "BEST_SELLERS_HERO",
      status: "ACTIVE",
    },
    attributes: [
      "id",
      "uuid",
      "type",
      "image",
      "eyebrow",
      "heading",
      "highlighted_heading",
      "description",
      "rating_text",
      "button_text",
      "button_link",
      "floating_label",
      "floating_title",
      "floating_description",
      "bottom_label",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [["id", "ASC"]],
  });
};

module.exports = {
  getActiveBestSellersHeroBanner,
};
