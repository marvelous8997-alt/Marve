
"use strict";

const { HomeHeroBanner } = require("../../database/models");

/* =========================
   GET ACTIVE HOME HERO BANNER
   Used by the storefront
========================= */

const getActiveHomeHeroBanner = async () => {
  return await HomeHeroBanner.findOne({
    where: {
      type: "HOME_HERO",
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
      "bottom_label",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [["id", "ASC"]],
  });
};

module.exports = {
  getActiveHomeHeroBanner,
};
