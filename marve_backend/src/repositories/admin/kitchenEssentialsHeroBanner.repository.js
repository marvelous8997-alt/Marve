
"use strict";

const { KitchenEssentialsHeroBanner } = require("../../database/models");

/* ========================= FIND BY ID ========================= */

const findById = async (id, transaction) => {
  return await KitchenEssentialsHeroBanner.findByPk(id, {
    transaction,
  });
};

/* ========================= FIND BY UUID ========================= */

const findByUuid = async (uuid, transaction) => {
  return await KitchenEssentialsHeroBanner.findOne({
    where: { uuid },
    transaction,
  });
};

/* ========================= FIND SINGLE KITCHEN ESSENTIALS HERO BANNER ========================= */

const findByType = async (
  type = "KITCHEN_ESSENTIALS_HERO",
  transaction
) => {
  return await KitchenEssentialsHeroBanner.findOne({
    where: { type },
    order: [["id", "ASC"]],
    transaction,
  });
};

/* ========================= FIND ACTIVE KITCHEN ESSENTIALS HERO BANNER ========================= */

const findActiveKitchenEssentialsHeroBanner = async () => {
  return await KitchenEssentialsHeroBanner.findOne({
    where: {
      type: "KITCHEN_ESSENTIALS_HERO",
      status: "ACTIVE",
    },
    order: [["id", "ASC"]],
  });
};

/* ========================= CREATE INITIAL BANNER ========================= */

// Used only when no Kitchen Essentials Hero Banner exists yet.
const createKitchenEssentialsHeroBanner = async (
  payload,
  transaction
) => {
  return await KitchenEssentialsHeroBanner.create(
    {
      ...payload,
      type: "KITCHEN_ESSENTIALS_HERO",
    },
    { transaction }
  );
};

/* ========================= UPDATE EXISTING BANNER ========================= */

const updateKitchenEssentialsHeroBanner = async (
  banner,
  payload,
  transaction
) => {
  return await banner.update(payload, {
    transaction,
  });
};

/* ========================= UPDATE BANNER STATUS ========================= */

const updateKitchenEssentialsHeroBannerStatus = async (
  uuid,
  status,
  transaction
) => {
  const banner = await KitchenEssentialsHeroBanner.findOne({
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
  findActiveKitchenEssentialsHeroBanner,
  createKitchenEssentialsHeroBanner,
  updateKitchenEssentialsHeroBanner,
  updateKitchenEssentialsHeroBannerStatus,
};
