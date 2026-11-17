
"use strict";

const { HomeCouponBanner } = require("../../database/models");

/* ========================= FIND BY ID ========================= */

const findById = async (id, transaction) => {
  return await HomeCouponBanner.findByPk(id, {
    transaction,
  });
};

/* ========================= FIND BY UUID ========================= */

const findByUuid = async (uuid, transaction) => {
  return await HomeCouponBanner.findOne({
    where: { uuid },
    transaction,
  });
};

/* ========================= FIND SINGLE HOME COUPON BANNER ========================= */

const findByType = async (type = "HOME_COUPON", transaction) => {
  return await HomeCouponBanner.findOne({
    where: { type },
    order: [["id", "ASC"]],
    transaction,
  });
};

/* ========================= FIND ACTIVE HOME COUPON BANNER ========================= */

const findActiveHomeCouponBanner = async () => {
  return await HomeCouponBanner.findOne({
    where: {
      type: "HOME_COUPON",
      status: "ACTIVE",
    },
    order: [["id", "ASC"]],
  });
};

/* ========================= CREATE INITIAL BANNER ========================= */

// Used only when no Home Coupon Banner exists yet.
const createHomeCouponBanner = async (payload, transaction) => {
  return await HomeCouponBanner.create(
    {
      ...payload,
      type: "HOME_COUPON",
    },
    { transaction }
  );
};

/* ========================= UPDATE EXISTING BANNER ========================= */

const updateHomeCouponBanner = async (
  banner,
  payload,
  transaction
) => {
  return await banner.update(payload, {
    transaction,
  });
};

/* ========================= UPDATE BANNER STATUS ========================= */

const updateHomeCouponBannerStatus = async (
  uuid,
  status,
  transaction
) => {
  const banner = await HomeCouponBanner.findOne({
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
  findActiveHomeCouponBanner,
  createHomeCouponBanner,
  updateHomeCouponBanner,
  updateHomeCouponBannerStatus,
};
