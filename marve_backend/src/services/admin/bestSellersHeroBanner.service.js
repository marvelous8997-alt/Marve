
"use strict";

const { sequelize } = require("../../database/models");

const {
  adminBestSellersHeroBannerRepository,
} = require("../../repositories");

const {
  uploadToCloudinary,
  deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= CONSTANTS ========================= */

const BANNER_TYPE = "BEST_SELLERS_HERO";
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
    ["rating_text", "Rating text"],
    ["button_text", "Button text"],
    ["button_link", "Button link"],
    ["floating_label", "Floating label"],
    ["floating_title", "Floating title"],
    ["floating_description", "Floating description"],
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
    "rating_text",
    "button_text",
    "button_link",
    "floating_label",
    "floating_title",
    "floating_description",
    "bottom_label",
  ];

  for (const field of stringFields) {
    if (typeof normalized[field] === "string") {
      normalized[field] = normalized[field].trim();
    }
  }

  // Banner type is fixed and cannot be changed by the client.
  normalized.type = BANNER_TYPE;

  // Image is managed through the upload flow.
  delete normalized.image;
  delete normalized.imageFile;

  return normalized;
};

/* ========================= SAVE SINGLE BEST SELLERS HERO BANNER ========================= */

// First save creates the banner.
// Subsequent saves update the existing banner.
const saveBestSellersHeroBanner = async (payload, file) => {
  const transaction = await sequelize.transaction();

  let uploadedImage = null;
  let transactionCommitted = false;

  try {
    const normalizedPayload = normalizeBannerPayload(payload);

    validateBannerPayload(normalizedPayload);

    const existingBanner =
      await adminBestSellersHeroBannerRepository.findByType(
        BANNER_TYPE,
        transaction
      );

    const oldImage = existingBanner?.image || null;
    let image = oldImage;

    if (file) {
      const result = await uploadToCloudinary(file, {
        folder: "marve/banners/best-sellers-hero",
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
        await adminBestSellersHeroBannerRepository.updateBestSellersHeroBanner(
          existingBanner,
          {
            ...normalizedPayload,
            image,
          },
          transaction
        );
    } else {
      banner =
        await adminBestSellersHeroBannerRepository.createBestSellersHeroBanner(
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

    // Delete the previous Cloudinary image only after DB success.
    if (
      uploadedImage &&
      oldImage &&
      oldImage !== uploadedImage
    ) {
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

    // Clean up the newly uploaded image if the DB operation failed.
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

const updateBestSellersHeroBannerStatus = async (
  uuid,
  status
) => {
  const transaction = await sequelize.transaction();

  try {
    if (!BANNER_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid banner status.");
    }

    const banner =
      await adminBestSellersHeroBannerRepository.findByUuid(
        uuid,
        transaction
      );

    if (!banner) {
      throw new ApiError(
        404,
        "Best Sellers Hero Banner not found."
      );
    }

    await adminBestSellersHeroBannerRepository.updateBestSellersHeroBanner(
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

/* ========================= GET BANNER BY UUID ========================= */

const getBestSellersHeroBanner = async (uuid) => {
  const banner =
    await adminBestSellersHeroBannerRepository.findByUuid(uuid);

  if (!banner) {
    throw new ApiError(
      404,
      "Best Sellers Hero Banner not found."
    );
  }

  return banner.toJSON();
};

/* ========================= GET BANNER BY TYPE ========================= */

const getBestSellersHeroBannerByType = async () => {
  const banner =
    await adminBestSellersHeroBannerRepository.findByType(
      BANNER_TYPE
    );

  if (!banner) {
    throw new ApiError(
      404,
      "Best Sellers Hero Banner not found."
    );
  }

  return banner.toJSON();
};

/* ========================= GET ACTIVE BANNER ========================= */

const getActiveBestSellersHeroBanner = async () => {
  const banner =
    await adminBestSellersHeroBannerRepository.findActiveBestSellersHeroBanner();

  return banner ? banner.toJSON() : null;
};

module.exports = {
  saveBestSellersHeroBanner,
  updateBestSellersHeroBannerStatus,
  getBestSellersHeroBanner,
  getBestSellersHeroBannerByType,
  getActiveBestSellersHeroBanner,
};
