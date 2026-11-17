
"use strict";

const {
  userHomeEssentialsHeroBannerRepository,
} = require("../../repositories");

const logger = require("../../utils/winston.util");

/* =========================
   GET ACTIVE HOME ESSENTIALS HERO BANNER
   Used by the storefront
========================= */

const getActiveHomeEssentialsHeroBanner = async () => {
  try {
    const banner =
      await userHomeEssentialsHeroBannerRepository
        .getActiveHomeEssentialsHeroBanner();

    // No active banner is a valid storefront state.
    return banner ? banner.toJSON() : null;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getActiveHomeEssentialsHeroBanner,
};
