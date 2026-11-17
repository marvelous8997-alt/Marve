
"use strict";

const {
  KitchenEssentialsHeroBanner,
} = require("../../database/models");

/* =========================
   GET ACTIVE KITCHEN ESSENTIALS HERO BANNER
   Used by the storefront
========================= */

const getActiveKitchenEssentialsHeroBanner = async () => {
  return await KitchenEssentialsHeroBanner.findOne({
    where: {
      type: "KITCHEN_ESSENTIALS_HERO",
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
      "button_text",
      "button_link",
      "floating_label",
      "floating_title",
      "floating_description",
      "floating_bottom_label",
      "bottom_label",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [["id", "ASC"]],
  });
};

module.exports = {
  getActiveKitchenEssentialsHeroBanner,
};
