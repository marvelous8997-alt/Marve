
"use strict";

const { sequelize } = require("../../database/models");
const {
  adminHomeHeroBannerRepository,
} = require("../../repositories");

const {
  uploadToCloudinary,
  deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= CONSTANTS ========================= */

const BANNER_TYPE = "HOME_HERO";
const BANNER_STATUSES = ["ACTIVE", "INACTIVE"];

/* ========================= HELPERS ========================= */

const getTrimmedString = (value) =>
  typeof value === "string" ? value.trim() : "";

const validateBannerPayload = (
  payload,
  { partial = false } = {}
) => {
  const requiredFields = [
    ["eyebrow", "Eyebrow text"],
    ["heading", "Heading"],
    ["highlighted_heading", "Highlighted heading"],
    ["description", "Description"],
    ["button_text", "Button text"],
    ["button_link", "Button link"],
    ["bottom_label", "Bottom label"],
  ];

  for (const [field, label] of requiredFields) {
    if (partial && payload[field] === undefined) {
      continue;
    }

    if (!getTrimmedString(payload[field])) {
      throw new ApiError(400, `${label} is required.`);
    }
  }

  if (
    payload.status !== undefined &&
    !BANNER_STATUSES.includes(payload.status)
  ) {
    throw new ApiError(400, "Invalid banner status.");
  }

  if (
    payload.type !== undefined &&
    payload.type !== BANNER_TYPE
  ) {
    throw new ApiError(400, "Invalid banner type.");
  }
};

const normalizeBannerPayload = (payload) => {
  const normalized = { ...payload };

  const stringFields = [
    "eyebrow",
    "heading",
    "highlighted_heading",
    "description",
    "button_text",
    "button_link",
    "bottom_label",
  ];

  for (const field of stringFields) {
    if (typeof normalized[field] === "string") {
      normalized[field] = normalized[field].trim();
    }
  }

  // Banner type is fixed and cannot be changed by the client.
  normalized.type = BANNER_TYPE;

  return normalized;
};

/* ========================= SAVE SINGLE HOME HERO BANNER ========================= */

// First save: creates the single record.
// Subsequent saves: update the existing record.
const saveHomeHeroBanner = async (payload, file) => {
  const transaction = await sequelize.transaction();

  let uploadedImage = null;
  let transactionCommitted = false;

  try {
    const normalizedPayload = normalizeBannerPayload(payload);

    validateBannerPayload(normalizedPayload);

    const existingBanner =
      await adminHomeHeroBannerRepository.findByType(
        BANNER_TYPE,
        transaction
      );

    const oldImage = existingBanner?.image || null;
    let image = oldImage;

    if (file) {
      const result = await uploadToCloudinary(file, {
        folder: "marve/banners/home-hero",
        resourceType: "image",
      });

      uploadedImage = result.secure_url;
      image = uploadedImage;
    }

    if (!image) {
      throw new ApiError(400, "Banner image is required.");
    }

    let banner;

    if (existingBanner) {
      banner =
        await adminHomeHeroBannerRepository.updateHomeHeroBanner(
          existingBanner,
          {
            ...normalizedPayload,
            image,
          },
          transaction
        );
    } else {
      banner =
        await adminHomeHeroBannerRepository.createHomeHeroBanner(
          {
            ...normalizedPayload,
            image,
            status: normalizedPayload.status || "ACTIVE",
          },
          transaction
        );
    }

    await transaction.commit();
    transactionCommitted = true;

    // Remove old Cloudinary image only after the database update succeeds.
    if (uploadedImage && oldImage && oldImage !== uploadedImage) {
      try {
        await deleteCloudinaryFile(oldImage, "image");
      } catch (cleanupError) {
        logger.error(cleanupError);
      }
    }

    return banner.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    // Clean up a new upload only when the database transaction failed.
    if (!transactionCommitted && uploadedImage) {
      try {
        await deleteCloudinaryFile(uploadedImage, "image");
      } catch (cleanupError) {
        logger.error(cleanupError);
      }
    }

    logger.error(error);
    throw error;
  }
};

/* ========================= UPDATE BANNER STATUS ========================= */

const updateHomeHeroBannerStatus = async (uuid, status) => {
  const transaction = await sequelize.transaction();

  try {
    if (!BANNER_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid banner status.");
    }

    const banner =
      await adminHomeHeroBannerRepository.findByUuid(
        uuid,
        transaction
      );

    if (!banner) {
      throw new ApiError(404, "Home Hero Banner not found.");
    }

    await adminHomeHeroBannerRepository.updateHomeHeroBanner(
      banner,
      { status },
      transaction
    );

    await transaction.commit();

    return banner.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

/* ========================= GET SINGLE BANNER BY UUID ========================= */

const getHomeHeroBanner = async (uuid) => {
  const banner =
    await adminHomeHeroBannerRepository.findByUuid(uuid);

  if (!banner) {
    throw new ApiError(404, "Home Hero Banner not found.");
  }

  return banner.toJSON();
};

/* ========================= GET SINGLE BANNER BY TYPE ========================= */

const getHomeHeroBannerByType = async () => {
  const banner =
    await adminHomeHeroBannerRepository.findByType(BANNER_TYPE);

  if (!banner) {
    throw new ApiError(404, "Home Hero Banner not found.");
  }

  return banner.toJSON();
};

/* ========================= GET ACTIVE BANNER ========================= */

const getActiveHomeHeroBanner = async () => {
  const banner =
    await adminHomeHeroBannerRepository.findActiveHomeHeroBanner();

  return banner ? banner.toJSON() : null;
};

module.exports = {
  saveHomeHeroBanner,
  updateHomeHeroBannerStatus,
  getHomeHeroBanner,
  getHomeHeroBannerByType,
  getActiveHomeHeroBanner,
};
