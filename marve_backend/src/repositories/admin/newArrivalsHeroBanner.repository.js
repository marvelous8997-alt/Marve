"use strict";

const { NewArrivalsHeroBanner } = require("../../database/models");

/* ========================= FIND BY ID ========================= */

const findById = async (id, transaction) => {
  return await NewArrivalsHeroBanner.findByPk(id, {
    transaction,
  });
};

/* ========================= FIND BY UUID ========================= */

const findByUuid = async (uuid, transaction) => {
  return await NewArrivalsHeroBanner.findOne({
    where: { uuid },
    transaction,
  });
};

/* ========================= FIND SINGLE NEW ARRIVALS HERO BANNER ========================= */

const findByType = async (
  type = "NEW_ARRIVALS_HERO",
  transaction
) => {
  return await NewArrivalsHeroBanner.findOne({
    where: { type },
    order: [["id", "ASC"]],
    transaction,
  });
};

/* ========================= FIND ACTIVE NEW ARRIVALS HERO BANNER ========================= */

const findActiveNewArrivalsHeroBanner = async () => {
  return await NewArrivalsHeroBanner.findOne({
    where: {
      type: "NEW_ARRIVALS_HERO",
      status: "ACTIVE",
    },
    order: [["id", "ASC"]],
  });
};

/* ========================= CREATE INITIAL BANNER ========================= */

// Used only when no New Arrivals Hero Banner exists yet.
const createNewArrivalsHeroBanner = async (payload, transaction) => {
  return await NewArrivalsHeroBanner.create(
    {
      ...payload,
      type: "NEW_ARRIVALS_HERO",
    },
    { transaction }
  );
};

/* ========================= UPDATE EXISTING BANNER ========================= */

const updateNewArrivalsHeroBanner = async (
  banner,
  payload,
  transaction
) => {
  return await banner.update(payload, {
    transaction,
  });
};

/* ========================= UPDATE BANNER STATUS ========================= */

const updateNewArrivalsHeroBannerStatus = async (
  uuid,
  status,
  transaction
) => {
  const banner = await NewArrivalsHeroBanner.findOne({
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
  findActiveNewArrivalsHeroBanner,
  createNewArrivalsHeroBanner,
  updateNewArrivalsHeroBanner,
  updateNewArrivalsHeroBannerStatus,
};