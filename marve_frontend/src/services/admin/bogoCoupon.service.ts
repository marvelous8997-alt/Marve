
import {
  createBogoCouponApi,
  getBogoCouponsApi,
  getBogoCouponApi,
  updateBogoCouponApi,
  updateBogoCouponStatusApi,
  getActiveBogoCouponsForDropdownApi,
  deleteBogoCouponApi,
} from "@/src/api/admin/bogoCoupon.api";

import {
  createBogoCouponSchema,
  updateBogoCouponSchema,
  updateBogoCouponStatusSchema,
} from "@/src/validations/admin/bogoCoupon.validation";

import type {
  CreateBogoCouponFormValues,
  UpdateBogoCouponFormValues,
  UpdateBogoCouponStatusFormValues,
} from "@/src/validations/admin/bogoCoupon.validation";

import type {
  CreateBogoCouponApiResponse,
  GetBogoCouponApiResponse,
  GetBogoCouponsApiResponse,
  GetBogoCouponsParams,
  UpdateBogoCouponApiResponse,
  UpdateBogoCouponStatusApiResponse,
  DeleteBogoCouponApiResponse,
  GetActiveBogoCouponsForDropdownApiResponse,
} from "@/src/types/admin/bogoCoupon.types";

/* ========================= Create BOGO Coupon ========================= */

export const createBogoCouponService = async (
  values: CreateBogoCouponFormValues
): Promise<CreateBogoCouponApiResponse> => {
  const payload = createBogoCouponSchema.parse(values);

  return await createBogoCouponApi(payload);
};

/* ========================= Get BOGO Coupons ========================= */

export const getBogoCouponsService = async (
  params: GetBogoCouponsParams = {}
): Promise<GetBogoCouponsApiResponse> => {
  return await getBogoCouponsApi(params);
};

/* ========================= Get BOGO Coupon Details ========================= */

export const getBogoCouponDetailsService = async (
  uuid: string
): Promise<GetBogoCouponApiResponse> => {
  return await getBogoCouponApi(uuid);
};

/* ========================= Update BOGO Coupon ========================= */

export const updateBogoCouponService = async (
  uuid: string,
  values: UpdateBogoCouponFormValues
): Promise<UpdateBogoCouponApiResponse> => {
  const payload = updateBogoCouponSchema.parse(values);

  return await updateBogoCouponApi(uuid, payload);
};

/* ========================= Update BOGO Coupon Status ========================= */

export const updateBogoCouponStatusService = async (
  uuid: string,
  values: UpdateBogoCouponStatusFormValues
): Promise<UpdateBogoCouponStatusApiResponse> => {
  const payload = updateBogoCouponStatusSchema.parse(values);

  return await updateBogoCouponStatusApi(uuid, payload);
};

/* ========================= Get Active BOGO Coupons ========================= */

export const getActiveBogoCouponsForDropdownService =
  async (): Promise<GetActiveBogoCouponsForDropdownApiResponse> => {
    return await getActiveBogoCouponsForDropdownApi();
  };

/* ========================= Delete BOGO Coupon ========================= */

export const deleteBogoCouponService = async (
  uuid: string
): Promise<DeleteBogoCouponApiResponse> => {
  return await deleteBogoCouponApi(uuid);
};
