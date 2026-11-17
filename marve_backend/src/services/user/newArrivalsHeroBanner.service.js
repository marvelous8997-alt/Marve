"use strict";

const {
  userNewArrivalsHeroBannerRepository,
} = require("../../repositories");

const logger = require("../../utils/winston.util");

/* =========================
   GET ACTIVE NEW ARRIVALS HERO BANNER
   Used by the storefront
========================= */

const getActiveNewArrivalsHeroBanner = async () => {
  try {
    const banner =
      await userNewArrivalsHeroBannerRepository
        .getActiveNewArrivalsHeroBanner();

    // No active banner is a valid storefront state.
    return banner ? banner.toJSON() : null;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getActiveNewArrivalsHeroBanner,
};