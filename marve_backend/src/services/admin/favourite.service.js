
"use strict";

const {
  adminFavouriteRepository,
} = require("../../repositories");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= Helpers ========================= */

// Accept numeric database ID or UUID.
const findFavouriteByIdentifier = async (identifier) => {
  if (
    identifier === undefined ||
    identifier === null ||
    String(identifier).trim() === ""
  ) {
    throw new ApiError(
      400,
      "Favourite ID or UUID is required."
    );
  }

  const value = String(identifier).trim();
  const isNumericId = /^\d+$/.test(value);

  return isNumericId
    ? await adminFavouriteRepository.findById(Number(value))
    : await adminFavouriteRepository.findByUuid(value);
};

// Map a database favourite record to the admin frontend format.
const mapFavourite = (favourite) => {
  const data =
    typeof favourite.toJSON === "function"
      ? favourite.toJSON()
      : favourite;

  const customer =
    data.user || data.customer || {};

  const product = data.product || {};

  const category =
    product.category || {};

  const images = Array.isArray(product.images)
    ? product.images
    : [];

  const primaryImage =
    images.find((image) => image.is_primary) ||
    images.find((image) => image.isPrimary) ||
    images[0];

  const firstName = customer.firstName || "";
  const lastName = customer.lastName || "";

  const customerName = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: data.id,
    uuid: data.uuid,

    customerId: customer.id ?? data.user_id ?? data.customer_id ?? null,
    customerName: customerName || "Unnamed Customer",
    customerEmail: customer.email || "",
    customerPhone: customer.phone || "",

    productId: product.id ?? data.product_id ?? null,
    productName: product.name || "Product unavailable",
    productImage:
      primaryImage?.image_url ||
      primaryImage?.imageUrl ||
      primaryImage?.url ||
      null,
    productSku: product.sku || "",
    category: category.name || "",
    categorySlug: category.slug || "",
    price: Number(product.price ?? 0),

    createdAt: data.createdAt || data.created_at || null,
    updatedAt: data.updatedAt || data.updated_at || null,
  };
};

/* ========================= GET SINGLE FAVOURITE ========================= */

const getFavourite = async (identifier) => {
  try {
    const favourite =
      await findFavouriteByIdentifier(identifier);

    if (!favourite) {
      throw new ApiError(404, "Favourite not found.");
    }

    return mapFavourite(favourite);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

/* ========================= GET FAVOURITES LIST ========================= */

const getFavourites = async (query = {}) => {
  try {
    const {
      page = 1,
      limit = 8,
      search = "",
      category,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = query;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1
    ) {
      throw new ApiError(
        400,
        "Page must be a positive integer."
      );
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      throw new ApiError(
        400,
        "Limit must be between 1 and 100."
      );
    }

    const allowedCategories = [
      "KITCHEN",
      "DINING",
      "STORAGE",
      "HOME_DECOR",
      "COFFEE_TEA",
      "CLEANING",
    ];

    if (
      category &&
      category !== "ALL" &&
      !allowedCategories.includes(category)
    ) {
      throw new ApiError(
        400,
        "Invalid favourite category."
      );
    }

    const result =
      await adminFavouriteRepository.getFavourites({
        page: parsedPage,
        limit: parsedLimit,
        search: String(search || "").trim(),
        category:
          category && category !== "ALL"
            ? category
            : undefined,
        sortBy,
        sortOrder,
      });

    return {
      ...result,
      rows: result.rows.map(mapFavourite),
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

/* ========================= EXPORTS ========================= */

module.exports = {
  getFavourite,
  getFavourites,
};
