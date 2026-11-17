
"use strict";

const { sequelize } = require("../../database/models");
const { adminDiscountCouponRepository } = require("../../repositories");
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
  const getDateKey = (value) => {
    if (!value) return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return [
        value.getFullYear(),
        String(value.getMonth() + 1).padStart(2, "0"),
        String(value.getDate()).padStart(2, "0"),
      ].join("-");
    }

    const valueString = String(value);
    const datePart = valueString.slice(0, 10);

    return /^\d{4}-\d{2}-\d{2}$/.test(datePart)
      ? datePart
      : null;
  };

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const startDate = getDateKey(coupon.start_date);
  const endDate = getDateKey(coupon.end_date);

  if (endDate && endDate < today) {
    return "EXPIRED";
  }

  if (coupon.status !== "ACTIVE") {
    return "INACTIVE";
  }

  if (startDate && startDate > today) {
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

const validateCouponPayload = (payload, { isUpdate = false } = {}) => {
  const data = { ...payload };

  if (!isUpdate || data.code !== undefined) {
    data.code = normalizeCode(data.code);

    if (!data.code) {
      throw new ApiError(400, "Coupon code is required.");
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
      throw new ApiError(400, "Coupon name is required.");
    }
  }

  if (
    !isUpdate ||
    data.discount_type !== undefined ||
    data.discount_value !== undefined
  ) {
    if (
      !["PERCENTAGE", "FIXED"].includes(data.discount_type)
    ) {
      throw new ApiError(400, "Invalid discount type.");
    }

    const value = Number(data.discount_value);

    if (!Number.isFinite(value) || value <= 0) {
      throw new ApiError(
        400,
        "Discount value must be greater than zero."
      );
    }

    if (data.discount_type === "PERCENTAGE" && value > 100) {
      throw new ApiError(
        400,
        "Percentage discount cannot exceed 100."
      );
    }

    data.discount_value = value;

    if (data.discount_type === "FIXED") {
      data.maximum_discount = null;
    }
  }

  const optionalNumericFields = [
    "maximum_discount",
    "minimum_order_value",
    "usage_limit",
    "per_customer_limit",
  ];

  for (const field of optionalNumericFields) {
    if (data[field] === "" || data[field] === undefined) {
      if (data[field] === "") {
        data[field] = null;
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
      ["usage_limit", "per_customer_limit"].includes(field) &&
      !Number.isInteger(value)
    ) {
      throw new ApiError(
        400,
        `${field.replace(/_/g, " ")} must be a whole number.`
      );
    }

    data[field] = value;
  }

  if (
    data.discount_type === "PERCENTAGE" &&
    data.maximum_discount === 0
  ) {
    throw new ApiError(
      400,
      "Maximum discount must be greater than zero or left empty."
    );
  }

  if (data.discount_type === "FIXED") {
    data.maximum_discount = null;
  }

  if (!isUpdate || data.start_date !== undefined) {
    if (!data.start_date || !Number.isFinite(new Date(data.start_date).getTime())) {
      throw new ApiError(400, "A valid coupon start date is required.");
    }
  }

  if (!isUpdate || data.end_date !== undefined) {
    if (!data.end_date || !Number.isFinite(new Date(data.end_date).getTime())) {
      throw new ApiError(400, "A valid coupon end date is required.");
    }
  }

  return data;
};

const validateDateRange = (startDate, endDate) => {
  if (
    startDate &&
    endDate &&
    new Date(endDate).getTime() <= new Date(startDate).getTime()
  ) {
    throw new ApiError(
      400,
      "Coupon end date must be later than its start date."
    );
  }
};

const checkDuplicateCode = async (
  code,
  currentCouponId = null,
  transaction
) => {
  const existingCoupon =
    await adminDiscountCouponRepository.findByCode(code, transaction);

  if (
    existingCoupon &&
    String(existingCoupon.id) !== String(currentCouponId)
  ) {
    throw new ApiError(409, "Coupon code already exists.");
  }
};

// ======================== CREATE DISCOUNT COUPON ========================

const createDiscountCoupon = async (payload, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const data = validateCouponPayload(payload);

    validateDateRange(data.start_date, data.end_date);

    await checkDuplicateCode(data.code, null, transaction);

    // Usage count is controlled by the system, not by the admin form.
    delete data.usage_count;
    delete data.uuid;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    const coupon = await adminDiscountCouponRepository.createDiscountCoupon(
      {
        ...data,
        usage_count: 0,
        created_by: userId || null,
        updated_by: userId || null,
      },
      transaction
    );

    await transaction.commit();

    return addCouponDisplayStatus(coupon);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// ======================== UPDATE DISCOUNT COUPON ========================

const updateDiscountCoupon = async (uuid, payload, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const coupon =
      await adminDiscountCouponRepository.findByUuid(uuid, transaction);

    if (!coupon) {
      throw new ApiError(404, "Discount coupon not found.");
    }

    const data = validateCouponPayload(payload, {
      isUpdate: true,
    });

    const nextDiscountType =
      data.discount_type !== undefined
        ? data.discount_type
        : coupon.discount_type;

    const nextDiscountValue =
      data.discount_value !== undefined
        ? data.discount_value
        : Number(coupon.discount_value);

    if (
      nextDiscountType === "PERCENTAGE" &&
      (!Number.isFinite(nextDiscountValue) ||
        nextDiscountValue <= 0 ||
        nextDiscountValue > 100)
    ) {
      throw new ApiError(400, "Invalid percentage discount value.");
    }

    if (
      nextDiscountType === "FIXED" &&
      data.maximum_discount === undefined
    ) {
      data.maximum_discount = null;
    }

    if (data.code !== undefined) {
      await checkDuplicateCode(data.code, coupon.id, transaction);
    }

    const nextStartDate =
      data.start_date !== undefined
        ? data.start_date
        : coupon.start_date;

    const nextEndDate =
      data.end_date !== undefined
        ? data.end_date
        : coupon.end_date;

    validateDateRange(nextStartDate, nextEndDate);

    // Never accept system-managed fields from the request body.
    delete data.id;
    delete data.uuid;
    delete data.usage_count;
    delete data.created_by;
    delete data.createdAt;
    delete data.updatedAt;

    data.updated_by = userId || null;

    await adminDiscountCouponRepository.updateDiscountCoupon(
      coupon,
      data,
      transaction
    );

    await transaction.commit();

    return addCouponDisplayStatus(coupon);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// ======================== UPDATE STATUS ========================

const updateDiscountCouponStatus = async (uuid, status, userId) => {
  const transaction = await sequelize.transaction();

  try {
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      throw new ApiError(400, "Invalid discount coupon status.");
    }

    const coupon =
      await adminDiscountCouponRepository.findByUuid(uuid, transaction);

    if (!coupon) {
      throw new ApiError(404, "Discount coupon not found.");
    }

    await adminDiscountCouponRepository.updateDiscountCoupon(
      coupon,
      {
        status,
        updated_by: userId || null,
      },
      transaction
    );

    await transaction.commit();

    return addCouponDisplayStatus(coupon);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// ======================== GET SINGLE DISCOUNT COUPON ========================

const getDiscountCoupon = async (uuid) => {
  const coupon =
    await adminDiscountCouponRepository.findByUuid(uuid);

  if (!coupon) {
    throw new ApiError(404, "Discount coupon not found.");
  }

  return addCouponDisplayStatus(coupon);
};

// ======================== GET DISCOUNT COUPON LIST ========================

const getDiscountCoupons = async (query = {}) => {
  const result =
    await adminDiscountCouponRepository.getDiscountCoupons(query);

  return {
    ...result,
    rows: result.rows.map((coupon) =>
      addCouponDisplayStatus(coupon)
    ),
  };
};

// ======================== DELETE DISCOUNT COUPON ========================

const deleteDiscountCoupon = async (uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const coupon =
      await adminDiscountCouponRepository.findByUuid(uuid, transaction);

    if (!coupon) {
      throw new ApiError(404, "Discount coupon not found.");
    }

    await adminDiscountCouponRepository.deleteDiscountCoupon(
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

module.exports = {
  createDiscountCoupon,
  updateDiscountCoupon,
  updateDiscountCouponStatus,
  getDiscountCoupon,
  getDiscountCoupons,
  deleteDiscountCoupon,
};
