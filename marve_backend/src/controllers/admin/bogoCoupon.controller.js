
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const { adminBogoCouponService } = require("../../services");

const {
  createBogoCouponSchema,
  updateBogoCouponSchema,
  updateBogoCouponStatusSchema,
} = require("../../validations/admin/bogoCoupon.validation");

// ======================== CREATE BOGO COUPON ========================

const createBogoCoupon = asyncHandler(async (req, res) => {
  const { error, value } = createBogoCouponSchema.validate(req.body, {
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

  const coupon = await adminBogoCouponService.createBogoCoupon(
    value,
    req.user.id
  );

  return ResponseHelper.success(
    res,
    "BOGO coupon created successfully.",
    coupon,
    201
  );
});

// ======================== GET BOGO COUPON LIST ========================

const getBogoCoupons = asyncHandler(async (req, res) => {
  const result = await adminBogoCouponService.getBogoCoupons({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
    status: req.query.status,
    sortBy: req.query.sortBy || "sort_order",
    sortOrder: req.query.sortOrder || "ASC",
  });

  return ResponseHelper.success(
    res,
    "BOGO coupons fetched successfully.",
    result
  );
});

// ======================== GET BOGO COUPON DETAILS ========================

const getBogoCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminBogoCouponService.getBogoCoupon(
    req.params.uuid
  );

  return ResponseHelper.success(
    res,
    "BOGO coupon fetched successfully.",
    coupon
  );
});

// ======================== UPDATE BOGO COUPON ========================

const updateBogoCoupon = asyncHandler(async (req, res) => {
  const { error, value } = updateBogoCouponSchema.validate(req.body, {
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

  const coupon = await adminBogoCouponService.updateBogoCoupon(
    req.params.uuid,
    value,
    req.user.id
  );

  return ResponseHelper.success(
    res,
    "BOGO coupon updated successfully.",
    coupon
  );
});

// ======================== UPDATE BOGO COUPON STATUS ========================

const updateBogoCouponStatus = asyncHandler(async (req, res) => {
  const { error, value } = updateBogoCouponStatusSchema.validate(
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
    await adminBogoCouponService.updateBogoCouponStatus(
      req.params.uuid,
      value.status,
      req.user.id
    );

  return ResponseHelper.success(
    res,
    "BOGO coupon status updated successfully.",
    coupon
  );
});

// ======================== GET ACTIVE BOGO COUPONS ========================

const getActiveBogoCouponsForDropdown = asyncHandler(
  async (req, res) => {
    const coupons =
      await adminBogoCouponService.getActiveBogoCouponsForDropdown();

    return ResponseHelper.success(
      res,
      "Active BOGO coupons fetched successfully.",
      coupons
    );
  }
);

// ======================== DELETE BOGO COUPON ========================

const deleteBogoCoupon = asyncHandler(async (req, res) => {
  await adminBogoCouponService.deleteBogoCoupon(req.params.uuid);

  return ResponseHelper.success(
    res,
    "BOGO coupon deleted successfully."
  );
});

module.exports = {
  createBogoCoupon,
  getBogoCoupons,
  getBogoCoupon,
  updateBogoCoupon,
  updateBogoCouponStatus,
  getActiveBogoCouponsForDropdown,
  deleteBogoCoupon,
};
