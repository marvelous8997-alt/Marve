
"use strict";

const {
  userKitchenEssentialsHeroBannerRepository,
} = require("../../repositories");

const logger = require("../../utils/winston.util");

/* =========================
   GET ACTIVE KITCHEN ESSENTIALS HERO BANNER
   Used by the storefront
========================= */

const getActiveKitchenEssentialsHeroBanner = async () => {
  try {
    const banner =
      await userKitchenEssentialsHeroBannerRepository
        .getActiveKitchenEssentialsHeroBanner();

    // No active banner is a valid storefront state.
    return banner ? banner.toJSON() : null;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getActiveKitchenEssentialsHeroBanner,
};
