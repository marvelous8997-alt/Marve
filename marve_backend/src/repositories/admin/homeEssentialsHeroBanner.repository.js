
"use strict";

const { HomeEssentialsHeroBanner } = require("../../database/models");

/* ========================= FIND BY ID ========================= */

const findById = async (id, transaction) => {
  return await HomeEssentialsHeroBanner.findByPk(id, {
    transaction,
  });
};

/* ========================= FIND BY UUID ========================= */

const findByUuid = async (uuid, transaction) => {
  return await HomeEssentialsHeroBanner.findOne({
    where: { uuid },
    transaction,
  });
};

/* ========================= FIND SINGLE HOME ESSENTIALS HERO BANNER ========================= */

const findByType = async (
  type = "HOME_ESSENTIALS_HERO",
  transaction
) => {
  return await HomeEssentialsHeroBanner.findOne({
    where: { type },
    order: [["id", "ASC"]],
    transaction,
  });
};

/* ========================= FIND ACTIVE HOME ESSENTIALS HERO BANNER ========================= */

const findActiveHomeEssentialsHeroBanner = async () => {
  return await HomeEssentialsHeroBanner.findOne({
    where: {
      type: "HOME_ESSENTIALS_HERO",
      status: "ACTIVE",
    },
    order: [["id", "ASC"]],
  });
};

/* ========================= CREATE INITIAL BANNER ========================= */

// Used only when no Home Essentials Hero Banner exists yet.
const createHomeEssentialsHeroBanner = async (
  payload,
  transaction
) => {
  return await HomeEssentialsHeroBanner.create(
    {
      ...payload,
      type: "HOME_ESSENTIALS_HERO",
    },
    { transaction }
  );
};

/* ========================= UPDATE EXISTING BANNER ========================= */

const updateHomeEssentialsHeroBanner = async (
  banner,
  payload,
  transaction
) => {
  return await banner.update(payload, {
    transaction,
  });
};

/* ========================= UPDATE BANNER STATUS ========================= */

const updateHomeEssentialsHeroBannerStatus = async (
  uuid,
  status,
  transaction
) => {
  const banner = await HomeEssentialsHeroBanner.findOne({
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
  findActiveHomeEssentialsHeroBanner,
  createHomeEssentialsHeroBanner,
  updateHomeEssentialsHeroBanner,
  updateHomeEssentialsHeroBannerStatus,
};
