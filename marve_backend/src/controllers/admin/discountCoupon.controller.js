
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminDiscountCouponService } = require("../../services");

const {
  createDiscountCouponSchema,
  updateDiscountCouponSchema,
  updateDiscountCouponStatusSchema,
} = require("../../validations/admin/discountCoupon.validation");

// ======================== CREATE DISCOUNT COUPON ========================

const createDiscountCoupon = asyncHandler(async (req, res) => {
  const { error, value } = createDiscountCouponSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const coupon = await adminDiscountCouponService.createDiscountCoupon(
    value,
    req.user.id
  );

  return ResponseHelper.success(
    res,
    "Discount coupon created successfully.",
    coupon,
    201
  );
});

// ======================== GET DISCOUNT COUPON LIST ========================

const getDiscountCoupons = asyncHandler(async (req, res) => {
  const result = await adminDiscountCouponService.getDiscountCoupons({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
    status: req.query.status,
    discountType: req.query.discountType,
    sortBy: req.query.sortBy || "sort_order",
    sortOrder: req.query.sortOrder || "ASC",
  });

  return ResponseHelper.success(
    res,
    "Discount coupons fetched successfully.",
    result
  );
});

// ======================== GET DISCOUNT COUPON DETAILS ========================

const getDiscountCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminDiscountCouponService.getDiscountCoupon(
    req.params.uuid
  );

  return ResponseHelper.success(
    res,
    "Discount coupon fetched successfully.",
    coupon
  );
});

// ======================== UPDATE DISCOUNT COUPON ========================

const updateDiscountCoupon = asyncHandler(async (req, res) => {
  const { error, value } = updateDiscountCouponSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const coupon = await adminDiscountCouponService.updateDiscountCoupon(
    req.params.uuid,
    value,
    req.user.id
  );

  return ResponseHelper.success(
    res,
    "Discount coupon updated successfully.",
    coupon
  );
});

// ======================== UPDATE DISCOUNT COUPON STATUS ========================

const updateDiscountCouponStatus = asyncHandler(async (req, res) => {
  const { error, value } = updateDiscountCouponStatusSchema.validate(
    req.body,
    {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    }
  );

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const coupon =
    await adminDiscountCouponService.updateDiscountCouponStatus(
      req.params.uuid,
      value.status,
      req.user.id
    );

  return ResponseHelper.success(
    res,
    "Discount coupon status updated successfully.",
    coupon
  );
});

// ======================== DELETE DISCOUNT COUPON ========================

const deleteDiscountCoupon = asyncHandler(async (req, res) => {
  await adminDiscountCouponService.deleteDiscountCoupon(req.params.uuid);

  return ResponseHelper.success(
    res,
    "Discount coupon deleted successfully."
  );
});

module.exports = {
  createDiscountCoupon,
  getDiscountCoupons,
  getDiscountCoupon,
  updateDiscountCoupon,
  updateDiscountCouponStatus,
  deleteDiscountCoupon,
};
