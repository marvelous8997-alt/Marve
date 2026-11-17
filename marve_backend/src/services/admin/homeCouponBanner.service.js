
"use strict";

const { sequelize } = require("../../database/models");

const {
  adminHomeCouponBannerRepository,
} = require("../../repositories");

const {
  uploadToCloudinary,
  deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= CONSTANTS ========================= */

const BANNER_TYPE = "HOME_COUPON";
const BANNER_STATUSES = ["ACTIVE", "INACTIVE"];
const DISCOUNT_TYPES = ["PERCENTAGE", "FIXED"];

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
    ["offer_text", "Offer text"],
    ["coupon_code", "Coupon code"],
    ["terms_text", "Terms and conditions"],
  ];

  for (const [field, label] of requiredFields) {
    if (partial && payload[field] === undefined) {
      continue;
    }

    if (!getTrimmedString(payload[field])) {
      throw new ApiError(400, `${label} is required.`);
    }
  }

  if (!partial || payload.discount_value !== undefined) {
    const discountValue = Number(payload.discount_value);

    if (
      payload.discount_value === "" ||
      payload.discount_value === null ||
      payload.discount_value === undefined ||
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      throw new ApiError(
        400,
        "Discount value must be greater than zero."
      );
    }

    const discountType =
      payload.discount_type === undefined && partial
        ? undefined
        : payload.discount_type || "PERCENTAGE";

    if (
      discountType !== undefined &&
      !DISCOUNT_TYPES.includes(discountType)
    ) {
      throw new ApiError(400, "Invalid discount type.");
    }

    if (
      discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      throw new ApiError(
        400,
        "Percentage discount cannot exceed 100."
      );
    }
  }

  if (
    payload.discount_type !== undefined &&
    !DISCOUNT_TYPES.includes(payload.discount_type)
  ) {
    throw new ApiError(400, "Invalid discount type.");
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
    "offer_text",
    "coupon_code",
    "terms_text",
  ];

  for (const field of stringFields) {
    if (typeof normalized[field] === "string") {
      normalized[field] = normalized[field].trim();
    }
  }

  if (typeof normalized.coupon_code === "string") {
    normalized.coupon_code =
      normalized.coupon_code.toUpperCase();
  }

  if (normalized.discount_value !== undefined) {
    normalized.discount_value = Number(
      normalized.discount_value
    );
  }

  // Banner type is fixed and cannot be changed by the client.
  normalized.type = BANNER_TYPE;

  // Do not allow clients to set the image URL directly.
  // The image is handled by the upload flow below.
  delete normalized.image;
  delete normalized.imageFile;

  return normalized;
};

/* ========================= SAVE SINGLE HOME COUPON BANNER ========================= */

// First save: creates the single record.
// Subsequent saves: update the existing record.
const saveHomeCouponBanner = async (payload, file) => {
  const transaction = await sequelize.transaction();

  let uploadedImage = null;
  let transactionCommitted = false;

  try {
    const normalizedPayload =
      normalizeBannerPayload(payload);

    validateBannerPayload(normalizedPayload);

    const existingBanner =
      await adminHomeCouponBannerRepository.findByType(
        BANNER_TYPE,
        transaction
      );

    const oldImage = existingBanner?.image || null;
    let image = oldImage;

    if (file) {
      const result = await uploadToCloudinary(file, {
        folder: "marve/banners/home-coupon",
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
        await adminHomeCouponBannerRepository.updateHomeCouponBanner(
          existingBanner,
          {
            ...normalizedPayload,
            image,
          },
          transaction
        );
    } else {
      banner =
        await adminHomeCouponBannerRepository.createHomeCouponBanner(
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

    // Delete the old image only after the DB update succeeds.
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

    // Delete a new upload if the database transaction failed.
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

const updateHomeCouponBannerStatus = async (
  uuid,
  status
) => {
  const transaction = await sequelize.transaction();

  try {
    if (!BANNER_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid banner status.");
    }

    const banner =
      await adminHomeCouponBannerRepository.findByUuid(
        uuid,
        transaction
      );

    if (!banner) {
      throw new ApiError(
        404,
        "Home Coupon Banner not found."
      );
    }

    await adminHomeCouponBannerRepository.updateHomeCouponBanner(
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

const getHomeCouponBanner = async (uuid) => {
  const banner =
    await adminHomeCouponBannerRepository.findByUuid(uuid);

  if (!banner) {
    throw new ApiError(
      404,
      "Home Coupon Banner not found."
    );
  }

  return banner.toJSON();
};

/* ========================= GET SINGLE BANNER BY TYPE ========================= */

const getHomeCouponBannerByType = async () => {
  const banner =
    await adminHomeCouponBannerRepository.findByType(
      BANNER_TYPE
    );

  if (!banner) {
    throw new ApiError(
      404,
      "Home Coupon Banner not found."
    );
  }

  return banner.toJSON();
};

/* ========================= GET ACTIVE BANNER ========================= */

const getActiveHomeCouponBanner = async () => {
  const banner =
    await adminHomeCouponBannerRepository.findActiveHomeCouponBanner();

  return banner ? banner.toJSON() : null;
};

module.exports = {
  saveHomeCouponBanner,
  updateHomeCouponBannerStatus,
  getHomeCouponBanner,
  getHomeCouponBannerByType,
  getActiveHomeCouponBanner,
};
