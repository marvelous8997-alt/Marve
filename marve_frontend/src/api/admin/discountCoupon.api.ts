
import axiosInstance from "@/src/lib/axios";

import type {
  CreateDiscountCouponRequest,
  CreateDiscountCouponApiResponse,
  GetDiscountCouponApiResponse,
  GetDiscountCouponsApiResponse,
  GetDiscountCouponsParams,
  UpdateDiscountCouponRequest,
  UpdateDiscountCouponApiResponse,
  UpdateDiscountCouponStatusRequest,
  UpdateDiscountCouponStatusApiResponse,
  DeleteDiscountCouponApiResponse,
} from "@/src/types/admin/discountCoupon.types";

/* ========================= API Endpoints ========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  DISCOUNT_COUPON: {
    CREATE: "/admin/discount-coupons/create",
    LIST: "/admin/discount-coupons/list",
    DETAILS: (uuid: string) => `/admin/discount-coupons/list/${uuid}`,
    UPDATE: (uuid: string) => `/admin/discount-coupons/update/${uuid}`,
    STATUS: (uuid: string) => `/admin/discount-coupons/status/${uuid}`,
    DELETE: (uuid: string) => `/admin/discount-coupons/${uuid}`,
  },
};

/* ========================= Payload Mapper ========================= */

const toApiPayload = (
  payload:
    | CreateDiscountCouponRequest
    | UpdateDiscountCouponRequest
) => {
  const mapped: Record<string, unknown> = {};

  if (payload.code !== undefined) mapped.code = payload.code;
  if (payload.name !== undefined) mapped.name = payload.name;
  if (payload.description !== undefined) {
    mapped.description = payload.description;
  }

  if (payload.discountType !== undefined) {
    mapped.discount_type = payload.discountType;
  }
  if (payload.discountValue !== undefined) {
    mapped.discount_value = payload.discountValue;
  }

  if (payload.maximumDiscount !== undefined) {
    mapped.maximum_discount = payload.maximumDiscount;
  }
  if (payload.minimumOrderValue !== undefined) {
    mapped.minimum_order_value = payload.minimumOrderValue;
  }

  if (payload.usageLimit !== undefined) {
    mapped.usage_limit = payload.usageLimit;
  }
  if (payload.perCustomerLimit !== undefined) {
    mapped.per_customer_limit = payload.perCustomerLimit;
  }

  if (payload.startDate !== undefined) {
    mapped.start_date = payload.startDate;
  }
  if (payload.endDate !== undefined) {
    mapped.end_date = payload.endDate;
  }

  if (payload.status !== undefined) mapped.status = payload.status;
  if (payload.sortOrder !== undefined) {
    mapped.sort_order = payload.sortOrder;
  }

  return mapped;
};

/* ========================= Create Coupon API ========================= */

export const createDiscountCouponApi = async (
  payload: CreateDiscountCouponRequest
): Promise<CreateDiscountCouponApiResponse> => {
  const response =
    await axiosInstance.post<CreateDiscountCouponApiResponse>(
      API.DISCOUNT_COUPON.CREATE,
      toApiPayload(payload)
    );

  return response.data;
};

/* ========================= Get Coupon List API ========================= */

export const getDiscountCouponsApi = async (
  params: GetDiscountCouponsParams = {}
): Promise<GetDiscountCouponsApiResponse> => {
  const apiParams: Record<string, unknown> = {
    ...params,
  };

  if (params.discountType !== undefined) {
    apiParams.discountType = params.discountType;
  }

  const response =
    await axiosInstance.get<GetDiscountCouponsApiResponse>(
      API.DISCOUNT_COUPON.LIST,
      { params: apiParams }
    );

  return response.data;
};

/* ========================= Get Coupon Details API ========================= */

export const getDiscountCouponApi = async (
  uuid: string
): Promise<GetDiscountCouponApiResponse> => {
  const response =
    await axiosInstance.get<GetDiscountCouponApiResponse>(
      API.DISCOUNT_COUPON.DETAILS(uuid)
    );

  return response.data;
};

/* ========================= Update Coupon API ========================= */

export const updateDiscountCouponApi = async (
  uuid: string,
  payload: UpdateDiscountCouponRequest
): Promise<UpdateDiscountCouponApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateDiscountCouponApiResponse>(
      API.DISCOUNT_COUPON.UPDATE(uuid),
      toApiPayload(payload)
    );

  return response.data;
};

/* ========================= Update Coupon Status API ========================= */

export const updateDiscountCouponStatusApi = async (
  uuid: string,
  payload: UpdateDiscountCouponStatusRequest
): Promise<UpdateDiscountCouponStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateDiscountCouponStatusApiResponse>(
      API.DISCOUNT_COUPON.STATUS(uuid),
      payload
    );

  return response.data;
};

/* ========================= Delete Coupon API ========================= */

export const deleteDiscountCouponApi = async (
  uuid: string
): Promise<DeleteDiscountCouponApiResponse> => {
  const response =
    await axiosInstance.delete<DeleteDiscountCouponApiResponse>(
      API.DISCOUNT_COUPON.DELETE(uuid)
    );

  return response.data;
};
