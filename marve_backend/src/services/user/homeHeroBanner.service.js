
"use strict";

const {
  userHomeHeroBannerRepository,
} = require("../../repositories");

const logger = require("../../utils/winston.util");

/* =========================
   GET ACTIVE HOME HERO BANNER
   Used by the storefront
========================= */

const getActiveHomeHeroBanner = async () => {
  try {
    const banner =
      await userHomeHeroBannerRepository.getActiveHomeHeroBanner();

    // No active banner is a valid storefront state.
    return banner ? banner.toJSON() : null;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getActiveHomeHeroBanner,
};
