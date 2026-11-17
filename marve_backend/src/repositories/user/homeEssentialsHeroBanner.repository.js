
"use strict";

const { HomeEssentialsHeroBanner } = require("../../database/models");

/* =========================
   GET ACTIVE HOME ESSENTIALS HERO BANNER
   Used by the storefront
========================= */

const getActiveHomeEssentialsHeroBanner = async () => {
  return await HomeEssentialsHeroBanner.findOne({
    where: {
      type: "HOME_ESSENTIALS_HERO",
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
      "bottom_label",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [["id", "ASC"]],
  });
};

module.exports = {
  getActiveHomeEssentialsHeroBanner,
};
