
import {
  createDiscountCouponApi,
  getDiscountCouponsApi,
  getDiscountCouponApi,
  updateDiscountCouponApi,
  updateDiscountCouponStatusApi,
  deleteDiscountCouponApi,
} from "@/src/api/admin/discountCoupon.api";

import {
  createDiscountCouponSchema,
  updateDiscountCouponSchema,
  updateDiscountCouponStatusSchema,
} from "@/src/validations/admin/discountCoupon.validation";

import type {
  CreateDiscountCouponFormValues,
  UpdateDiscountCouponFormValues,
  UpdateDiscountCouponStatusFormValues,
} from "@/src/validations/admin/discountCoupon.validation";

import type {
  CreateDiscountCouponApiResponse,
  GetDiscountCouponApiResponse,
  GetDiscountCouponsApiResponse,
  GetDiscountCouponsParams,
  UpdateDiscountCouponApiResponse,
  UpdateDiscountCouponStatusApiResponse,
  DeleteDiscountCouponApiResponse,
} from "@/src/types/admin/discountCoupon.types";

/* ========================= Create Discount Coupon ========================= */

export const createDiscountCouponService = async (
  values: CreateDiscountCouponFormValues
): Promise<CreateDiscountCouponApiResponse> => {
  const payload = createDiscountCouponSchema.parse(values);

  return await createDiscountCouponApi(payload);
};

/* ========================= Get Discount Coupons ========================= */

export const getDiscountCouponsService = async (
  params: GetDiscountCouponsParams = {}
): Promise<GetDiscountCouponsApiResponse> => {
  return await getDiscountCouponsApi(params);
};

/* ========================= Get Discount Coupon Details ========================= */

export const getDiscountCouponDetailsService = async (
  uuid: string
): Promise<GetDiscountCouponApiResponse> => {
  return await getDiscountCouponApi(uuid);
};

/* ========================= Update Discount Coupon ========================= */

export const updateDiscountCouponService = async (
  uuid: string,
  values: UpdateDiscountCouponFormValues
): Promise<UpdateDiscountCouponApiResponse> => {
  const payload = updateDiscountCouponSchema.parse(values);

  return await updateDiscountCouponApi(uuid, payload);
};

/* ========================= Update Discount Coupon Status ========================= */

export const updateDiscountCouponStatusService = async (
  uuid: string,
  values: UpdateDiscountCouponStatusFormValues
): Promise<UpdateDiscountCouponStatusApiResponse> => {
  const payload = updateDiscountCouponStatusSchema.parse(values);

  return await updateDiscountCouponStatusApi(uuid, payload);
};

/* ========================= Delete Discount Coupon ========================= */

export const deleteDiscountCouponService = async (
  uuid: string
): Promise<DeleteDiscountCouponApiResponse> => {
  return await deleteDiscountCouponApi(uuid);
};
