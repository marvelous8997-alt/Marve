
"use strict";

const { userOfferRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= HELPERS ========================= */

// Convert Sequelize instance to a plain object
const toPlainObject = (record) => {
  return record && typeof record.toJSON === "function"
    ? record.toJSON()
    : record;
};

// Get local calendar date as YYYY-MM-DD
const getTodayDateKey = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

// Normalize a database date to YYYY-MM-DD
const getDateKey = (value) => {
  if (value == null || value === "") {
    return null;
  }

  // DATE-only strings and ISO date strings
  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);

    if (match) {
      return match[1];
    }
  }

  // Date objects
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

// Calculate offer status using calendar dates
const getOfferDisplayStatus = (coupon) => {
  const today = getTodayDateKey();
  const startDate = getDateKey(coupon.start_date);
  const endDate = getDateKey(coupon.end_date);

  // Expire only after the end calendar date has passed
  if (endDate && endDate < today) {
    return "EXPIRED";
  }

  // Keep manually inactive coupons inactive
  if (coupon.status !== "ACTIVE") {
    return "INACTIVE";
  }

  // Scheduled until its start calendar date
  if (startDate && startDate > today) {
    return "SCHEDULED";
  }

  return "ACTIVE";
};

// Normalize product mappings for the frontend
const normalizeProductMappings = (mappings = []) => {
  return mappings.map((mapping) => {
    const item = toPlainObject(mapping);

    return {
      id: item.id,
      productId: item.product_id ?? item.productId ?? null,
      product: item.product ? toPlainObject(item.product) : null,
    };
  });
};

// Normalize discount offer response
const normalizeDiscountOffer = (record) => {
  const coupon = toPlainObject(record);

  return {
    id: coupon.id,
    uuid: coupon.uuid,
    type: "DISCOUNT",
    code: coupon.code,
    name: coupon.name,
    description: coupon.description ?? null,
    discountType: coupon.discount_type,
    discountValue: Number(coupon.discount_value),
    minimumOrderValue:
      coupon.minimum_order_value == null
        ? null
        : Number(coupon.minimum_order_value),
    maximumDiscount:
      coupon.maximum_discount == null
        ? null
        : Number(coupon.maximum_discount),
    usageLimit: coupon.usage_limit ?? null,
    usageCount: Number(coupon.usage_count ?? 0),
    perCustomerLimit: coupon.per_customer_limit ?? null,
    startDate: coupon.start_date,
    endDate: coupon.end_date,
    status: getOfferDisplayStatus(coupon),
    sortOrder: Number(coupon.sort_order ?? 0),
  };
};

// Normalize BOGO offer response
const normalizeBogoOffer = (record) => {
  const coupon = toPlainObject(record);

  return {
    id: coupon.id,
    uuid: coupon.uuid,
    type: "BOGO",
    code: coupon.code,
    name: coupon.name,
    description: coupon.description ?? null,
    buyQuantity: Number(coupon.buy_quantity),
    getQuantity: Number(coupon.get_quantity),
    minimumOrderValue:
      coupon.minimum_order_value == null
        ? null
        : Number(coupon.minimum_order_value),
    usageLimit: coupon.usage_limit ?? null,
    usageCount: 0,
    perCustomerLimit: coupon.per_customer_limit ?? null,
    startDate: coupon.start_date,
    endDate: coupon.end_date,
    status: getOfferDisplayStatus(coupon),
    sortOrder: Number(coupon.sort_order ?? 0),
    buyProducts: normalizeProductMappings(coupon.buyProducts ?? []),
    getProducts: normalizeProductMappings(coupon.getProducts ?? []),
  };
};

/* ========================= GET OFFERS ========================= */

// Get active discount and BOGO offers for the user panel
const getOffers = async () => {
  try {
    const [discountRecords, bogoRecords] = await Promise.all([
      userOfferRepository.getActiveDiscountOffers(),
      userOfferRepository.getActiveBogoOffers(),
    ]);

    const discountOffers = discountRecords.map(normalizeDiscountOffer);
    const bogoOffers = bogoRecords.map(normalizeBogoOffer);

    // Combine both offer types into one sorted list
    const offers = [...discountOffers, ...bogoOffers].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        String(a.name || "").localeCompare(String(b.name || ""))
    );

    return {
      offers,
      summary: {
        total: offers.length,
        discountCount: discountOffers.length,
        bogoCount: bogoOffers.length,
      },
    };
  } catch (error) {
    logger.error(`Get offers service error: ${error.message}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw error;
  }
};

/* ========================= GET OFFER DETAILS ========================= */

// Get offer details by type and UUID
const getOfferDetails = async (type, uuid) => {
  try {
    const normalizedType = String(type || "").trim().toUpperCase();
    const normalizedUuid = String(uuid || "").trim();

    if (!["DISCOUNT", "BOGO"].includes(normalizedType)) {
      throw new ApiError(400, "Invalid offer type.");
    }

    if (!normalizedUuid) {
      throw new ApiError(400, "Offer UUID is required.");
    }

    const repositoryMethod =
      normalizedType === "DISCOUNT"
        ? userOfferRepository.getActiveDiscountOffers
        : userOfferRepository.getActiveBogoOffers;

    const records = await repositoryMethod();

    const record = records.find(
      (item) => String(item.uuid) === normalizedUuid
    );

    if (!record) {
      throw new ApiError(404, "Offer not found or no longer available.");
    }

    return normalizedType === "DISCOUNT"
      ? normalizeDiscountOffer(record)
      : normalizeBogoOffer(record);
  } catch (error) {
    logger.error(`Get offer details service error: ${error.message}`);
    throw error;
  }
};

/* ========================= EXPORTS ========================= */

module.exports = {
  getOffers,
  getOfferDetails,
};
