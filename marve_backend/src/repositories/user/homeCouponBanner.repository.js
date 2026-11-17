
"use strict";

const { HomeCouponBanner } = require("../../database/models");

/* =========================
   GET ACTIVE HOME COUPON BANNER
   Used by the storefront
========================= */

const getActiveHomeCouponBanner = async () => {
  return await HomeCouponBanner.findOne({
    where: {
      type: "HOME_COUPON",
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
      "offer_text",
      "discount_value",
      "discount_type",
      "coupon_code",
      "terms_text",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [["id", "ASC"]],
  });
};

module.exports = {
  getActiveHomeCouponBanner,
};
