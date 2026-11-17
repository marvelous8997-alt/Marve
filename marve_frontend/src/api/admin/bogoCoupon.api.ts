
import axiosInstance from "@/src/lib/axios";

import type {
  CreateBogoCouponRequest,
  CreateBogoCouponApiResponse,
  GetBogoCouponApiResponse,
  GetBogoCouponsApiResponse,
  GetBogoCouponsParams,
  UpdateBogoCouponRequest,
  UpdateBogoCouponApiResponse,
  UpdateBogoCouponStatusRequest,
  UpdateBogoCouponStatusApiResponse,
  DeleteBogoCouponApiResponse,
  GetActiveBogoCouponsForDropdownApiResponse,
} from "@/src/types/admin/bogoCoupon.types";

/* ========================= API Endpoints ========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  BOGO_COUPON: {
    CREATE: "/admin/bogo-coupons/create",
    LIST: "/admin/bogo-coupons/list",
    DETAILS: (uuid: string) => `/admin/bogo-coupons/list/${uuid}`,
    UPDATE: (uuid: string) => `/admin/bogo-coupons/update/${uuid}`,
    STATUS: (uuid: string) => `/admin/bogo-coupons/status/${uuid}`,
    ACTIVE: "/admin/bogo-coupons/active",
    DELETE: (uuid: string) => `/admin/bogo-coupons/${uuid}`,
  },
};

/* ========================= Payload Mapper ========================= */

const toApiPayload = (
  payload: CreateBogoCouponRequest | UpdateBogoCouponRequest
) => {
  const mapped: Record<string, unknown> = {};

  if (payload.code !== undefined) mapped.code = payload.code;
  if (payload.name !== undefined) mapped.name = payload.name;

  if (payload.description !== undefined) {
    mapped.description = payload.description;
  }

  if (payload.buyQuantity !== undefined) {
    mapped.buy_quantity = payload.buyQuantity;
  }

  if (payload.getQuantity !== undefined) {
    mapped.get_quantity = payload.getQuantity;
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

  if (payload.status !== undefined) {
    mapped.status = payload.status;
  }

  if (payload.sortOrder !== undefined) {
    mapped.sort_order = payload.sortOrder;
  }

  if (payload.buyProductIds !== undefined) {
    mapped.buy_product_ids = payload.buyProductIds.map(Number);
  }

  if (payload.getProductIds !== undefined) {
    mapped.get_product_ids = payload.getProductIds.map(Number);
  }

  return mapped;
};

/* ========================= Create BOGO Coupon API ========================= */

export const createBogoCouponApi = async (
  payload: CreateBogoCouponRequest
): Promise<CreateBogoCouponApiResponse> => {
  const response =
    await axiosInstance.post<CreateBogoCouponApiResponse>(
      API.BOGO_COUPON.CREATE,
      toApiPayload(payload)
    );

  return response.data;
};

/* ========================= Get BOGO Coupon List API ========================= */

export const getBogoCouponsApi = async (
  params: GetBogoCouponsParams = {}
): Promise<GetBogoCouponsApiResponse> => {
  const apiParams: Record<string, unknown> = {
    ...params,
  };

  const response =
    await axiosInstance.get<GetBogoCouponsApiResponse>(
      API.BOGO_COUPON.LIST,
      { params: apiParams }
    );

  return response.data;
};

/* ========================= Get BOGO Coupon Details API ========================= */

export const getBogoCouponApi = async (
  uuid: string
): Promise<GetBogoCouponApiResponse> => {
  const response =
    await axiosInstance.get<GetBogoCouponApiResponse>(
      API.BOGO_COUPON.DETAILS(uuid)
    );

  return response.data;
};

/* ========================= Update BOGO Coupon API ========================= */

export const updateBogoCouponApi = async (
  uuid: string,
  payload: UpdateBogoCouponRequest
): Promise<UpdateBogoCouponApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateBogoCouponApiResponse>(
      API.BOGO_COUPON.UPDATE(uuid),
      toApiPayload(payload)
    );

  return response.data;
};

/* ========================= Update BOGO Coupon Status API ========================= */

export const updateBogoCouponStatusApi = async (
  uuid: string,
  payload: UpdateBogoCouponStatusRequest
): Promise<UpdateBogoCouponStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateBogoCouponStatusApiResponse>(
      API.BOGO_COUPON.STATUS(uuid),
      payload
    );

  return response.data;
};

/* ========================= Get Active BOGO Coupons API ========================= */

export const getActiveBogoCouponsForDropdownApi = async (): Promise<GetActiveBogoCouponsForDropdownApiResponse> => {
  const response =
    await axiosInstance.get<GetActiveBogoCouponsForDropdownApiResponse>(
      API.BOGO_COUPON.ACTIVE
    );

  return response.data;
};

/* ========================= Delete BOGO Coupon API ========================= */

export const deleteBogoCouponApi = async (
  uuid: string
): Promise<DeleteBogoCouponApiResponse> => {
  const response =
    await axiosInstance.delete<DeleteBogoCouponApiResponse>(
      API.BOGO_COUPON.DELETE(uuid)
    );

  return response.data;
};
