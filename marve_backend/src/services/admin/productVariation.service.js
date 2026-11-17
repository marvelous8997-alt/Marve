
"use strict";

const { sequelize } = require("../../database/models");

const {
  adminProductRepository,
  adminProductVariationRepository,
} = require("../../repositories");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// =====================================================
// HELPERS
// =====================================================

const isDuplicateError = (error) =>
  error?.name === "SequelizeUniqueConstraintError";

const isValidId = (value) => {
  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0;
};

const normalizeAttributes = (attributes = {}) => {
  if (
    attributes === null ||
    typeof attributes !== "object" ||
    Array.isArray(attributes)
  ) {
    throw new ApiError(
      400,
      "Variation attributes must be a valid object."
    );
  }

  const normalized = {};

  for (const [rawKey, rawValue] of Object.entries(attributes)) {
    const key = rawKey.trim();

    if (
      typeof rawValue !== "string" &&
      typeof rawValue !== "number" &&
      typeof rawValue !== "boolean"
    ) {
      throw new ApiError(
        400,
        "Variation attribute values must be strings or primitive values."
      );
    }

    const value = String(rawValue).trim();

    // Ignore empty attribute rows from the form.
    if (!key && !value) {
      continue;
    }

    if (!key || !value) {
      throw new ApiError(
        400,
        "Each attribute must have both a name and a value."
      );
    }

    if (
      Object.keys(normalized).some(
        (existingKey) =>
          existingKey.toLowerCase() === key.toLowerCase()
      )
    ) {
      throw new ApiError(
        400,
        "Variation attribute names must be unique."
      );
    }

    normalized[key] = value;
  }

  return normalized;
};

const normalizeStatus = (status) => {
  const normalized = String(status || "ACTIVE").toUpperCase();

  if (!["ACTIVE", "INACTIVE"].includes(normalized)) {
    throw new ApiError(
      400,
      "Variation status must be ACTIVE or INACTIVE."
    );
  }

  return normalized;
};

const normalizeMoney = (value, fieldLabel, allowNull = false) => {
  if (allowNull && (value === undefined || value === null || value === "")) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new ApiError(
      400,
      `${fieldLabel} must be a valid non-negative number.`
    );
  }

  // DECIMAL(10, 2) supports at most 2 decimal places.
  if (Math.round(number * 100) !== Math.round(number * 100)) {
    throw new ApiError(400, `${fieldLabel} is invalid.`);
  }

  if (Math.abs(number * 100 - Math.round(number * 100)) > 0.000001) {
    throw new ApiError(
      400,
      `${fieldLabel} can have a maximum of 2 decimal places.`
    );
  }

  if (number >= 100000000) {
    throw new ApiError(
      400,
      `${fieldLabel} exceeds the maximum allowed amount.`
    );
  }

  return number;
};

const normalizeWholeNumber = (value, fieldLabel, defaultValue = 0) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const number = Number(value);

  if (!Number.isSafeInteger(number) || number < 0) {
    throw new ApiError(
      400,
      `${fieldLabel} must be a non-negative whole number.`
    );
  }

  return number;
};

const ensureProductExists = async (productId, transaction) => {
  if (!isValidId(productId)) {
    throw new ApiError(400, "A valid parent product is required.");
  }

  const product = await adminProductRepository.findById(
    Number(productId),
    transaction
  );

  if (!product) {
    throw new ApiError(404, "Parent product not found.");
  }

  return product;
};

const ensureUniqueSku = async (
  sku,
  excludeId = null,
  transaction
) => {
  const existing = await adminProductVariationRepository.findBySku(
    sku,
    excludeId,
    transaction
  );

  if (existing) {
    throw new ApiError(
      409,
      "Variation SKU already exists."
    );
  }
};

const ensureUniqueName = async (
  name,
  productId,
  excludeId = null,
  transaction
) => {
  const existing = await adminProductVariationRepository.findByName(
    name,
    productId,
    excludeId,
    transaction
  );

  if (existing) {
    throw new ApiError(
      409,
      "Variation name already exists for this product."
    );
  }
};

const getVariationOrThrow = async (uuid, transaction) => {
  const variation = await adminProductVariationRepository.findByUuid(
    uuid,
    transaction
  );

  if (!variation) {
    throw new ApiError(404, "Product variation not found.");
  }

  return variation;
};

// =====================================================
// CREATE PRODUCT VARIATION
// =====================================================

const createProductVariation = async (payload, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const productId = Number(payload.product_id);

    await ensureProductExists(productId, transaction);

    const name = String(payload.name || "").trim();
    const sku = String(payload.sku || "").trim();

    if (!name) {
      throw new ApiError(400, "Variation name is required.");
    }

    if (name.length > 255) {
      throw new ApiError(
        400,
        "Variation name cannot exceed 255 characters."
      );
    }

    if (!sku) {
      throw new ApiError(400, "Variation SKU is required.");
    }

    if (sku.length > 100) {
      throw new ApiError(
        400,
        "Variation SKU cannot exceed 100 characters."
      );
    }

    const price = normalizeMoney(
      payload.price,
      "Variation price"
    );

    const compareAtPrice = normalizeMoney(
      payload.compare_at_price,
      "Compare-at price",
      true
    );

    if (
      compareAtPrice !== null &&
      compareAtPrice < price
    ) {
      throw new ApiError(
        400,
        "Compare-at price must be greater than or equal to the selling price."
      );
    }

    const attributes = normalizeAttributes(
      payload.attributes ?? {}
    );

    const stock = normalizeWholeNumber(
      payload.stock,
      "Stock"
    );

    const sortOrder = normalizeWholeNumber(
      payload.sort_order,
      "Sort order"
    );

    const status = normalizeStatus(payload.status);

    await ensureUniqueSku(sku, null, transaction);

    await ensureUniqueName(
      name,
      productId,
      null,
      transaction
    );

    const variation =
      await adminProductVariationRepository.createProductVariation(
        {
          product_id: productId,
          name,
          sku,
          attributes,
          price,
          compare_at_price: compareAtPrice,
          stock,
          status,
          sort_order: sortOrder,
          created_by: userId || null,
          updated_by: userId || null,
        },
        transaction
      );

    const uuid = variation.uuid;

    await transaction.commit();

    const savedVariation =
      await adminProductVariationRepository.findByUuid(uuid);

    return savedVariation
      ? savedVariation.toJSON()
      : variation.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);

    if (isDuplicateError(error)) {
      throw new ApiError(
        409,
        "A variation with the same unique SKU already exists."
      );
    }

    throw error;
  }
};


 // =====================================================
 // CREATE MULTIPLE PRODUCT VARIATIONS
 // =====================================================

const createProductVariations = async (payload, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const productId = Number(
      payload.product_id ?? payload.productId
    );

    await ensureProductExists(productId, transaction);

    const variations = payload.variations;

    if (!Array.isArray(variations) || variations.length === 0) {
      throw new ApiError(
        400,
        "At least one product variation is required."
      );
    }

    if (variations.length > 100) {
      throw new ApiError(
        400,
        "You can create a maximum of 100 variations per request."
      );
    }

    const seenSkus = new Set();
    const seenNames = new Set();

    const preparedVariations = [];

    for (const item of variations) {
      const name = String(item.name || "").trim();
      const sku = String(item.sku || "").trim();

      if (!name) {
        throw new ApiError(400, "Variation name is required.");
      }

      if (name.length > 255) {
        throw new ApiError(
          400,
          "Variation name cannot exceed 255 characters."
        );
      }

      if (!sku) {
        throw new ApiError(400, "Variation SKU is required.");
      }

      if (sku.length > 100) {
        throw new ApiError(
          400,
          "Variation SKU cannot exceed 100 characters."
        );
      }

      const skuKey = sku.toLowerCase();
      const nameKey = name.toLowerCase();

      if (seenSkus.has(skuKey)) {
        throw new ApiError(
          409,
          `Duplicate SKU in request: ${sku}`
        );
      }

      if (seenNames.has(nameKey)) {
        throw new ApiError(
          409,
          `Duplicate variation name in request: ${name}`
        );
      }

      seenSkus.add(skuKey);
      seenNames.add(nameKey);

      const price = normalizeMoney(
        item.price,
        "Variation price"
      );

      const compareAtPrice = normalizeMoney(
        item.compare_at_price ?? item.compareAtPrice,
        "Compare-at price",
        true
      );

      if (
        compareAtPrice !== null &&
        compareAtPrice < price
      ) {
        throw new ApiError(
          400,
          "Compare-at price must be greater than or equal to the selling price."
        );
      }

      const attributes = normalizeAttributes(
        item.attributes ?? {}
      );

      if (Object.keys(attributes).length === 0) {
        throw new ApiError(
          400,
          `At least one attribute is required for variation "${name}".`
        );
      }

      preparedVariations.push({
        product_id: productId,
        name,
        sku,
        attributes,
        price,
        compare_at_price: compareAtPrice,
        stock: normalizeWholeNumber(item.stock, "Stock"),
        status: normalizeStatus(item.status),
        sort_order: normalizeWholeNumber(
          item.sort_order ?? item.sortOrder,
          "Sort order"
        ),
        created_by: userId || null,
        updated_by: userId || null,
      });
    }

    // Check existing database records before bulk insert.
    for (const item of preparedVariations) {
      await ensureUniqueSku(item.sku, null, transaction);

      await ensureUniqueName(
        item.name,
        productId,
        null,
        transaction
      );
    }

    const created =
      await adminProductVariationRepository.bulkCreateProductVariations(
        preparedVariations,
        transaction
      );

    const createdUuids = created.map((item) => item.uuid);

    await transaction.commit();

    // Fetch saved records with their product/admin associations.
    const savedVariations = await Promise.all(
      createdUuids.map((uuid) =>
        adminProductVariationRepository.findByUuid(uuid)
      )
    );

    return savedVariations
      .filter(Boolean)
      .map((variation) => variation.toJSON());
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);

    if (isDuplicateError(error)) {
      throw new ApiError(
        409,
        "A variation with the same unique SKU already exists."
      );
    }

    throw error;
  }
};

// =====================================================
// UPDATE PRODUCT VARIATION
// =====================================================

const updateProductVariation = async (
  uuid,
  payload,
  userId
) => {
  const transaction = await sequelize.transaction();

  try {
    const variation = await getVariationOrThrow(
      uuid,
      transaction
    );

    const data = {};

    // Variations cannot be reassigned to another product.
    if (payload.product_id !== undefined) {
      if (
        String(payload.product_id) !==
        String(variation.product_id)
      ) {
        throw new ApiError(
          400,
          "A variation cannot be reassigned to another product."
        );
      }
    }

    const nextName =
      payload.name !== undefined
        ? String(payload.name).trim()
        : variation.name;

    const nextSku =
      payload.sku !== undefined
        ? String(payload.sku).trim()
        : variation.sku;

    if (!nextName) {
      throw new ApiError(400, "Variation name is required.");
    }

    if (nextName.length > 255) {
      throw new ApiError(
        400,
        "Variation name cannot exceed 255 characters."
      );
    }

    if (!nextSku) {
      throw new ApiError(400, "Variation SKU is required.");
    }

    if (nextSku.length > 100) {
      throw new ApiError(
        400,
        "Variation SKU cannot exceed 100 characters."
      );
    }

    if (payload.name !== undefined) {
      data.name = nextName;
    }

    if (payload.sku !== undefined) {
      data.sku = nextSku;
    }

    if (
      payload.name !== undefined &&
      nextName !== variation.name
    ) {
      await ensureUniqueName(
        nextName,
        variation.product_id,
        variation.id,
        transaction
      );
    }

    if (
      payload.sku !== undefined &&
      nextSku !== variation.sku
    ) {
      await ensureUniqueSku(
        nextSku,
        variation.id,
        transaction
      );
    }

    const nextPrice =
      payload.price !== undefined
        ? normalizeMoney(payload.price, "Variation price")
        : Number(variation.price);

    const nextCompareAtPrice =
      payload.compare_at_price !== undefined
        ? normalizeMoney(
            payload.compare_at_price,
            "Compare-at price",
            true
          )
        : variation.compare_at_price == null
          ? null
          : Number(variation.compare_at_price);

    if (
      nextCompareAtPrice !== null &&
      nextCompareAtPrice < nextPrice
    ) {
      throw new ApiError(
        400,
        "Compare-at price must be greater than or equal to the selling price."
      );
    }

    if (payload.price !== undefined) {
      data.price = nextPrice;
    }

    if (payload.compare_at_price !== undefined) {
      data.compare_at_price = nextCompareAtPrice;
    }

    if (payload.attributes !== undefined) {
      data.attributes = normalizeAttributes(
        payload.attributes
      );
    }

    if (payload.stock !== undefined) {
      data.stock = normalizeWholeNumber(
        payload.stock,
        "Stock"
      );
    }

    if (payload.sort_order !== undefined) {
      data.sort_order = normalizeWholeNumber(
        payload.sort_order,
        "Sort order"
      );
    }

    if (payload.status !== undefined) {
      data.status = normalizeStatus(payload.status);
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError(
        400,
        "Please provide at least one field to update."
      );
    }

    data.updated_by = userId || null;

    await adminProductVariationRepository.updateProductVariation(
      variation,
      data,
      transaction
    );

    await transaction.commit();

    const updatedVariation =
      await adminProductVariationRepository.findByUuid(uuid);

    return updatedVariation
      ? updatedVariation.toJSON()
      : variation.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);

    if (isDuplicateError(error)) {
      throw new ApiError(
        409,
        "Variation SKU already exists."
      );
    }

    throw error;
  }
};

// =====================================================
// GET SINGLE PRODUCT VARIATION
// =====================================================

const getProductVariation = async (uuid) => {
  const variation =
    await adminProductVariationRepository.findByUuid(uuid);

  if (!variation) {
    throw new ApiError(404, "Product variation not found.");
  }

  return variation.toJSON();
};

// =====================================================
// GET PRODUCT VARIATIONS
// =====================================================

const getProductVariations = async (query) => {
  const productId =
    query.product_id ?? query.productId;

  await ensureProductExists(productId);

  const status =
    query.status && query.status !== "ALL"
      ? normalizeStatus(query.status)
      : undefined;

  const result =
    await adminProductVariationRepository.getProductVariations({
      productId: Number(productId),
      page: query.page,
      limit: query.limit,
      search: query.search,
      status,
      sortBy: query.sortBy ?? "sort_order",
      sortOrder: query.sortOrder ?? "ASC",
    });

  return {
    count: result.count,
    rows: result.rows.map((variation) =>
      variation.toJSON()
    ),
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
};

// =====================================================
// UPDATE PRODUCT VARIATION STATUS
// =====================================================

const updateProductVariationStatus = async (
  uuid,
  status,
  userId
) => {
  const normalizedStatus = normalizeStatus(status);
  const transaction = await sequelize.transaction();

  try {
    const variation = await getVariationOrThrow(
      uuid,
      transaction
    );

    await adminProductVariationRepository.updateProductVariation(
      variation,
      {
        status: normalizedStatus,
        updated_by: userId || null,
      },
      transaction
    );

    await transaction.commit();

    const updatedVariation =
      await adminProductVariationRepository.findByUuid(uuid);

    return updatedVariation
      ? updatedVariation.toJSON()
      : variation.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// =====================================================
// DELETE PRODUCT VARIATION
// =====================================================

const deleteProductVariation = async (uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const variation = await getVariationOrThrow(
      uuid,
      transaction
    );

    await adminProductVariationRepository.deleteProductVariation(
      variation,
      transaction
    );

    await transaction.commit();

    return true;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createProductVariation,
  createProductVariations,
  updateProductVariation,
  getProductVariation,
  getProductVariations,
  updateProductVariationStatus,
  deleteProductVariation,
};