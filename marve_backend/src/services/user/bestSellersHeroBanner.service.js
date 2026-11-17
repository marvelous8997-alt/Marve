
"use strict";

const {
  userBestSellersHeroBannerRepository,
} = require("../../repositories");

const logger = require("../../utils/winston.util");

/* =========================
   GET ACTIVE BEST SELLERS HERO BANNER
   Used by the storefront
========================= */

const getActiveBestSellersHeroBanner = async () => {
  try {
    const banner =
      await userBestSellersHeroBannerRepository
        .getActiveBestSellersHeroBanner();

    // No active banner is a valid storefront state.
    return banner ? banner.toJSON() : null;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getActiveBestSellersHeroBanner,
};
