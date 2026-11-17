
"use strict";

const { sequelize } = require("../../database/models");
const { adminBogoCouponRepository } = require("../../repositories");
const { Product } = require("../../database/models");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// ======================== HELPERS ========================

const normalizeCode = (code) => {
  if (typeof code !== "string") {
    return "";
  }

  return code.trim().toUpperCase().replace(/\s+/g, "");
};

// ======================== COUPON DISPLAY STATUS ========================

const getCouponDisplayStatus = (coupon) => {
  const startDate = new Date(coupon.start_date);
  const endDate = new Date(coupon.end_date);
  const today = new Date();

  // Compare calendar dates so the end date remains valid
  // for the entire selected day.
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (endDate < today) {
    return "EXPIRED";
  }

  if (coupon.status !== "ACTIVE") {
    return "INACTIVE";
  }

  if (startDate > today) {
    return "SCHEDULED";
  }

  return "ACTIVE";
};

const addCouponDisplayStatus = (coupon) => {
  const data =
    typeof coupon.toJSON === "function"
      ? coupon.toJSON()
      : { ...coupon };

  return {
    ...data,
    display_status: getCouponDisplayStatus(data),
  };
};

const validateCouponPayload = (
  payload,
  { isUpdate = false } = {}
) => {
  const data = { ...payload };

  if (!isUpdate || data.code !== undefined) {
    data.code = normalizeCode(data.code);

    if (!data.code) {
      throw new ApiError(400, "BOGO coupon code is required.");
    }

    if (!/^[A-Z0-9_-]+$/.test(data.code)) {
      throw new ApiError(
        400,
        "Coupon code may contain only letters, numbers, hyphens and underscores."
      );
    }
  }

  if (!isUpdate || data.name !== undefined) {
    data.name =
      typeof data.name === "string" ? data.name.trim() : "";

    if (!data.name) {
      throw new ApiError(400, "BOGO coupon name is required.");
    }
  }

  if (data.description !== undefined && data.description !== null) {
    data.description =
      typeof data.description === "string"
        ? data.description.trim()
        : "";

    if (!data.description) {
      data.description = null;
    }
  }

  const quantityFields = ["buy_quantity", "get_quantity"];

  for (const field of quantityFields) {
    if (!isUpdate || data[field] !== undefined) {
      const value = Number(data[field]);

      if (
        !Number.isSafeInteger(value) ||
        value < 1
      ) {
        throw new ApiError(
          400,
          `${field.replace(/_/g, " ")} must be a positive whole number.`
        );
      }

      data[field] = value;
    }
  }

  const numericFields = [
    "minimum_order_value",
    "usage_limit",
    "per_customer_limit",
    "sort_order",
  ];

  for (const field of numericFields) {
    if (data[field] === undefined && isUpdate) {
      continue;
    }

    if (
      data[field] === "" ||
      data[field] === null
    ) {
      if (field === "minimum_order_value") {
        data[field] = 0;
        continue;
      }

      if (
        field === "usage_limit" ||
        field === "per_customer_limit"
      ) {
        data[field] = null;
        continue;
      }

      if (field === "sort_order") {
        data[field] = 0;
        continue;
      }
    }

    if (data[field] === undefined && !isUpdate) {
      if (field === "minimum_order_value") {
        data[field] = 0;
      } else if (
        field === "usage_limit" ||
        field === "per_customer_limit"
      ) {
        data[field] = null;
      } else if (field === "sort_order") {
        data[field] = 0;
      }

      continue;
    }

    if (data[field] === null) {
      continue;
    }

    const value = Number(data[field]);

    if (!Number.isFinite(value) || value < 0) {
      throw new ApiError(
        400,
        `${field.replace(/_/g, " ")} must be a non-negative number.`
      );
    }

    if (
      [
        "usage_limit",
        "per_customer_limit",
        "sort_order",
      ].includes(field) &&
      !Number.isSafeInteger(value)
    ) {
      throw new ApiError(
        400,
        `${field.replace(/_/g, " ")} must be a whole number.`
      );
    }

    data[field] = value;
  }

  if (!isUpdate || data.start_date !== undefined) {
    if (
      !data.start_date ||
      !Number.isFinite(new Date(data.start_date).getTime())
    ) {
      throw new ApiError(
        400,
        "A valid BOGO coupon start date is required."
      );
    }
  }

  if (!isUpdate || data.end_date !== undefined) {
    if (
      !data.end_date ||
      !Number.isFinite(new Date(data.end_date).getTime())
    ) {
      throw new ApiError(
        400,
        "A valid BOGO coupon end date is required."
      );
    }
  }

  if (
    data.status !== undefined &&
    !["ACTIVE", "INACTIVE"].includes(data.status)
  ) {
    throw new ApiError(400, "Invalid BOGO coupon status.");
  }

  return data;
};

const validateDateRange = (startDate, endDate) => {
  if (
    startDate &&
    endDate &&
    new Date(endDate).getTime() <=
      new Date(startDate).getTime()
  ) {
    throw new ApiError(
      400,
      "BOGO coupon end date must be later than its start date."
    );
  }
};

const normalizeProductIds = (productIds, fieldName) => {
  if (!Array.isArray(productIds)) {
    throw new ApiError(
      400,
      `${fieldName} must be an array of product IDs.`
    );
  }

  const normalizedIds = productIds.map((id) => {
    const value = Number(id);

    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new ApiError(
        400,
        `Invalid product ID in ${fieldName}.`
      );
    }

    return value;
  });

  return [...new Set(normalizedIds)];
};

const validateProducts = async (
  productIds,
  fieldName,
  transaction
) => {
  if (!productIds.length) {
    throw new ApiError(
      400,
      `At least one product is required in ${fieldName}.`
    );
  }

  const products = await Product.findAll({
    where: {
      id: productIds,
      status: "ACTIVE",
    },
    attributes: ["id"],
    transaction,
  });

  const foundIds = new Set(
    products.map((product) => Number(product.id))
  );

  const invalidIds = productIds.filter(
    (id) => !foundIds.has(id)
  );

  if (invalidIds.length) {
    throw new ApiError(
      400,
      `One or more products in ${fieldName} do not exist or are inactive.`
    );
  }
};

const checkDuplicateCode = async (
  code,
  currentCouponId = null,
  transaction
) => {
  const existingCoupon =
    await adminBogoCouponRepository.findByCode(
      code,
      transaction
    );

  if (
    existingCoupon &&
    String(existingCoupon.id) !== String(currentCouponId)
  ) {
    throw new ApiError(409, "BOGO coupon code already exists.");
  }
};

const cleanSystemFields = (data) => {
  delete data.id;
  delete data.uuid;
  delete data.created_by;
  delete data.createdAt;
  delete data.updatedAt;

  return data;
};

// ======================== CREATE BOGO COUPON ========================

const createBogoCoupon = async (payload, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const data = validateCouponPayload(payload);

    validateDateRange(data.start_date, data.end_date);

    const buyProductIds = normalizeProductIds(
      payload.buy_product_ids,
      "buy_product_ids"
    );

    const getProductIds = normalizeProductIds(
      payload.get_product_ids,
      "get_product_ids"
    );

    await validateProducts(
      buyProductIds,
      "buy products",
      transaction
    );

    await validateProducts(
      getProductIds,
      "get products",
      transaction
    );

    await checkDuplicateCode(
      data.code,
      null,
      transaction
    );

    delete data.buy_product_ids;
    delete data.get_product_ids;

    cleanSystemFields(data);

    const coupon =
      await adminBogoCouponRepository.createBogoCoupon(
        {
          ...data,
          created_by: userId || null,
          updated_by: userId || null,
        },
        transaction
      );

    await adminBogoCouponRepository.replaceBuyProducts(
      coupon.id,
      buyProductIds,
      transaction
    );

    await adminBogoCouponRepository.replaceGetProducts(
      coupon.id,
      getProductIds,
      transaction
    );

    const result =
      await adminBogoCouponRepository.findByUuidWithProducts(
        coupon.uuid,
        transaction
      );

    await transaction.commit();

    return addCouponDisplayStatus(result);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// ======================== UPDATE BOGO COUPON ========================

const updateBogoCoupon = async (uuid, payload, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const coupon =
      await adminBogoCouponRepository.findByUuid(
        uuid,
        transaction
      );

    if (!coupon) {
      throw new ApiError(404, "BOGO coupon not found.");
    }

    const data = validateCouponPayload(payload, {
      isUpdate: true,
    });

    const nextStartDate =
      data.start_date !== undefined
        ? data.start_date
        : coupon.start_date;

    const nextEndDate =
      data.end_date !== undefined
        ? data.end_date
        : coupon.end_date;

    validateDateRange(nextStartDate, nextEndDate);

    if (data.code !== undefined) {
      await checkDuplicateCode(
        data.code,
        coupon.id,
        transaction
      );
    }

    let buyProductIds;
    let getProductIds;

    if (payload.buy_product_ids !== undefined) {
      buyProductIds = normalizeProductIds(
        payload.buy_product_ids,
        "buy_product_ids"
      );

      await validateProducts(
        buyProductIds,
        "buy products",
        transaction
      );
    }

    if (payload.get_product_ids !== undefined) {
      getProductIds = normalizeProductIds(
        payload.get_product_ids,
        "get_product_ids"
      );

      await validateProducts(
        getProductIds,
        "get products",
        transaction
      );
    }

    delete data.buy_product_ids;
    delete data.get_product_ids;
    delete data.updatedAt;

    delete data.created_by;
    delete data.uuid;
    delete data.id;

    data.updated_by = userId || null;

    await adminBogoCouponRepository.updateBogoCoupon(
      coupon,
      data,
      transaction
    );

    if (buyProductIds !== undefined) {
      await adminBogoCouponRepository.replaceBuyProducts(
        coupon.id,
        buyProductIds,
        transaction
      );
    }

    if (getProductIds !== undefined) {
      await adminBogoCouponRepository.replaceGetProducts(
        coupon.id,
        getProductIds,
        transaction
      );
    }

    const result =
      await adminBogoCouponRepository.findByUuidWithProducts(
        uuid,
        transaction
      );

    await transaction.commit();

    return addCouponDisplayStatus(result);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// ======================== UPDATE STATUS ========================

const updateBogoCouponStatus = async (
  uuid,
  status,
  userId
) => {
  const transaction = await sequelize.transaction();

  try {
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      throw new ApiError(400, "Invalid BOGO coupon status.");
    }

    const coupon =
      await adminBogoCouponRepository.findByUuid(
        uuid,
        transaction
      );

    if (!coupon) {
      throw new ApiError(404, "BOGO coupon not found.");
    }

    await adminBogoCouponRepository.updateBogoCoupon(
      coupon,
      {
        status,
        updated_by: userId || null,
      },
      transaction
    );

    await transaction.commit();

    return coupon.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// ======================== GET SINGLE BOGO COUPON ========================

const getBogoCoupon = async (uuid) => {
  const coupon =
    await adminBogoCouponRepository.findByUuidWithProducts(
      uuid
    );

  if (!coupon) {
    throw new ApiError(404, "BOGO coupon not found.");
  }

  return coupon.toJSON();
};

// ======================== GET BOGO COUPON LIST ========================

const getBogoCoupons = async (query = {}) => {
  const result =
    await adminBogoCouponRepository.getBogoCoupons(query);

  return {
    ...result,
    rows: result.rows.map((coupon) =>
      addCouponDisplayStatus(coupon)
    ),
  };
};

// ======================== DELETE BOGO COUPON ========================

const deleteBogoCoupon = async (uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const coupon =
      await adminBogoCouponRepository.findByUuid(
        uuid,
        transaction
      );

    if (!coupon) {
      throw new ApiError(404, "BOGO coupon not found.");
    }

    await adminBogoCouponRepository.deleteBogoCoupon(
      coupon,
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

// ======================== ACTIVE BOGO COUPONS ========================

const getActiveBogoCouponsForDropdown = async () => {
  return await adminBogoCouponRepository
    .getActiveBogoCouponsForDropdown()
    .then((coupons) =>
      coupons.map((coupon) => coupon.toJSON())
    );
};

module.exports = {
  createBogoCoupon,
  updateBogoCoupon,
  updateBogoCouponStatus,
  getBogoCoupon,
  getBogoCoupons,
  deleteBogoCoupon,
  getActiveBogoCouponsForDropdown,
};
