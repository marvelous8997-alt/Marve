"use strict";

const { NewArrivalsHeroBanner } = require("../../database/models");

/* =========================
   GET ACTIVE NEW ARRIVALS HERO BANNER
   Used by the storefront
========================= */

const getActiveNewArrivalsHeroBanner = async () => {
  return await NewArrivalsHeroBanner.findOne({
    where: {
      type: "NEW_ARRIVALS_HERO",
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
  getActiveNewArrivalsHeroBanner,
};