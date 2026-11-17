
"use strict";

const { HomeHeroBanner } = require("../../database/models");

/* ========================= FIND BY ID ========================= */

const findById = async (id, transaction) => {
  return await HomeHeroBanner.findByPk(id, {
    transaction,
  });
};

/* ========================= FIND BY UUID ========================= */

const findByUuid = async (uuid, transaction) => {
  return await HomeHeroBanner.findOne({
    where: { uuid },
    transaction,
  });
};

/* ========================= FIND SINGLE HOME HERO BANNER ========================= */

const findByType = async (type = "HOME_HERO", transaction) => {
  return await HomeHeroBanner.findOne({
    where: { type },
    order: [["id", "ASC"]],
    transaction,
  });
};

/* ========================= FIND ACTIVE HOME HERO BANNER ========================= */

const findActiveHomeHeroBanner = async () => {
  return await HomeHeroBanner.findOne({
    where: {
      type: "HOME_HERO",
      status: "ACTIVE",
    },
  });
};

/* ========================= CREATE INITIAL BANNER ========================= */

// Used only when no Home Hero Banner exists yet.
const createHomeHeroBanner = async (payload, transaction) => {
  return await HomeHeroBanner.create(
    {
      ...payload,
      type: "HOME_HERO",
    },
    { transaction }
  );
};

/* ========================= UPDATE EXISTING BANNER ========================= */

const updateHomeHeroBanner = async (
  banner,
  payload,
  transaction
) => {
  return await banner.update(payload, {
    transaction,
  });
};

/* ========================= UPDATE BANNER STATUS ========================= */

const updateHomeHeroBannerStatus = async (
  uuid,
  status,
  transaction
) => {
  const banner = await HomeHeroBanner.findOne({
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
  findActiveHomeHeroBanner,
  createHomeHeroBanner,
  updateHomeHeroBanner,
  updateHomeHeroBannerStatus,
};
