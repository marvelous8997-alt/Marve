
"use strict";

const { BestSellersHeroBanner } = require("../../database/models");

/* ========================= FIND BY ID ========================= */

const findById = async (id, transaction) => {
  return await BestSellersHeroBanner.findByPk(id, {
    transaction,
  });
};

/* ========================= FIND BY UUID ========================= */

const findByUuid = async (uuid, transaction) => {
  return await BestSellersHeroBanner.findOne({
    where: { uuid },
    transaction,
  });
};

/* ========================= FIND SINGLE BEST SELLERS HERO BANNER ========================= */

const findByType = async (
  type = "BEST_SELLERS_HERO",
  transaction
) => {
  return await BestSellersHeroBanner.findOne({
    where: { type },
    order: [["id", "ASC"]],
    transaction,
  });
};

/* ========================= FIND ACTIVE BEST SELLERS HERO BANNER ========================= */

const findActiveBestSellersHeroBanner = async () => {
  return await BestSellersHeroBanner.findOne({
    where: {
      type: "BEST_SELLERS_HERO",
      status: "ACTIVE",
    },
    order: [["id", "ASC"]],
  });
};

/* ========================= CREATE INITIAL BANNER ========================= */

// Used only when no Best Sellers Hero Banner exists yet.
const createBestSellersHeroBanner = async (payload, transaction) => {
  return await BestSellersHeroBanner.create(
    {
      ...payload,
      type: "BEST_SELLERS_HERO",
    },
    { transaction }
  );
};

/* ========================= UPDATE EXISTING BANNER ========================= */

const updateBestSellersHeroBanner = async (
  banner,
  payload,
  transaction
) => {
  return await banner.update(payload, {
    transaction,
  });
};

/* ========================= UPDATE BANNER STATUS ========================= */

const updateBestSellersHeroBannerStatus = async (
  uuid,
  status,
  transaction
) => {
  const banner = await BestSellersHeroBanner.findOne({
    where: { uuid },
    transaction,
  });

  if (!banner) {
    return null;
  }

  return await banner.update(
    { status },
    { transaction }
  );
};

module.exports = {
  findById,
  findByUuid,
  findByType,
  findActiveBestSellersHeroBanner,
  createBestSellersHeroBanner,
  updateBestSellersHeroBanner,
  updateBestSellersHeroBannerStatus,
};
