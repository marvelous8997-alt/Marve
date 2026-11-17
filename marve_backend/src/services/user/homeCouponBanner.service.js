
"use strict";

const {
  userHomeCouponBannerRepository,
} = require("../../repositories");

const logger = require("../../utils/winston.util");

/* =========================
   GET ACTIVE HOME COUPON BANNER
   Used by the storefront
========================= */

const getActiveHomeCouponBanner = async () => {
  try {
    const banner =
      await userHomeCouponBannerRepository.getActiveHomeCouponBanner();

    // No active banner is a valid storefront state.
    return banner ? banner.toJSON() : null;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getActiveHomeCouponBanner,
};
