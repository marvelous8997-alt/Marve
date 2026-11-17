
import axiosInstance from "@/src/lib/axios";

import type {
  ReturnRequest,
  ReturnRequestFilters,
  ReturnRequestListResult,
  ReturnRequestApiResponse,
  ReturnRequestStatusCounts,
  ApproveReturnRequestPayload,
  RejectReturnRequestPayload,
  RetryReturnPickupResponse,
  RefreshReturnTrackingResponse,
} from "@/src/types/admin/returnRequest.types";

/* =========================================================
   API ENDPOINTS
========================================================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  RETURN_REQUEST: {
    LIST: "/admin/return-requests/list",

    DETAILS: (identifier: string) =>
      `/admin/return-requests/list/${encodeURIComponent(identifier)}`,

    APPROVE: (identifier: string) =>
      `/admin/return-requests/approve/${encodeURIComponent(identifier)}`,

    REJECT: (identifier: string) =>
      `/admin/return-requests/reject/${encodeURIComponent(identifier)}`,

    STATUS_COUNTS: "/admin/return-requests/status-counts",

    RETRY_PICKUP: (identifier: string) =>
      `/admin/return-requests/retry-pickup/${encodeURIComponent(identifier)}`,

    REFRESH_TRACKING: (identifier: string) =>
      `/admin/return-requests/refresh-tracking/${encodeURIComponent(identifier)}`,
  },
};

/* =========================================================
   REQUEST TYPES
========================================================= */

export interface GetReturnRequestsRequest
  extends ReturnRequestFilters {
  page?: number;
  limit?: number;
}

/* =========================================================
   RESPONSE TYPES
========================================================= */

export type GetReturnRequestsApiResponse =
  ReturnRequestApiResponse<
    ReturnRequestListResult | ReturnRequest[]
  >;

export type GetReturnRequestApiResponse =
  ReturnRequestApiResponse<ReturnRequest>;

export type ApproveReturnRequestApiResponse =
  ReturnRequestApiResponse<ReturnRequest>;

export type RejectReturnRequestApiResponse =
  ReturnRequestApiResponse<ReturnRequest>;

export type GetReturnStatusCountsApiResponse =
  ReturnRequestApiResponse<ReturnRequestStatusCounts>;

export type RetryReturnPickupApiResponse =
  ReturnRequestApiResponse<RetryReturnPickupResponse>;

export type RefreshReturnTrackingApiResponse =
  ReturnRequestApiResponse<ReturnRequest>;
/* =========================================================
   QUERY PARAMETER HELPER
========================================================= */

const buildQueryParams = (
  params: Record<
    string,
    string | number | boolean | undefined | null
  >
): Record<string, string | number | boolean> => {
  const queryParams: Record<
    string,
    string | number | boolean
  > = {};

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      queryParams[key] = value;
    }
  });

  return queryParams;
};

/* =========================================================
   GET RETURN REQUESTS API
========================================================= */

export const getReturnRequestsApi = async (
  params: GetReturnRequestsRequest = {}
): Promise<GetReturnRequestsApiResponse> => {
  const queryParams = buildQueryParams({
    page: params.page,
    limit: params.limit,
    search: params.search,
    returnNumber: params.returnNumber,
    orderNumber: params.orderNumber,
    customer: params.customer,
    email: params.email,
    phone: params.phone,
    status: params.status,
    reason: params.reason,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response =
    await axiosInstance.get<GetReturnRequestsApiResponse>(
      API.RETURN_REQUEST.LIST,
      {
        params: queryParams,
      }
    );

  return response.data;
};

/* =========================================================
   GET RETURN REQUEST DETAILS API
========================================================= */

export const getReturnRequestApi = async (
  identifier: string
): Promise<GetReturnRequestApiResponse> => {
  const response =
    await axiosInstance.get<GetReturnRequestApiResponse>(
      API.RETURN_REQUEST.DETAILS(identifier)
    );

  return response.data;
};

/* =========================================================
   APPROVE RETURN REQUEST API
========================================================= */

export const approveReturnRequestApi = async (
  identifier: string,
  payload: ApproveReturnRequestPayload = {}
): Promise<ApproveReturnRequestApiResponse> => {
  const response =
    await axiosInstance.patch<ApproveReturnRequestApiResponse>(
      API.RETURN_REQUEST.APPROVE(identifier),
      {
        adminNote: payload.adminNote,
      }
    );

  return response.data;
};

/* =========================================================
   REJECT RETURN REQUEST API
========================================================= */

export const rejectReturnRequestApi = async (
  identifier: string,
  payload: RejectReturnRequestPayload
): Promise<RejectReturnRequestApiResponse> => {
  const response =
    await axiosInstance.patch<RejectReturnRequestApiResponse>(
      API.RETURN_REQUEST.REJECT(identifier),
      {
        rejectionReason: payload.rejectionReason,
        adminNote: payload.adminNote,
      }
    );

  return response.data;
};

/* =========================================================
   RETRY RETURN PICKUP API
========================================================= */

export const retryReturnPickupApi = async (
  identifier: string
): Promise<RetryReturnPickupApiResponse> => {
  const response =
    await axiosInstance.post<RetryReturnPickupApiResponse>(
      API.RETURN_REQUEST.RETRY_PICKUP(identifier)
    );

  return response.data;
};

/* =========================================================
   REFRESH RETURN TRACKING API
========================================================= */

export const refreshReturnTrackingApi = async (
  identifier: string
): Promise<RefreshReturnTrackingApiResponse> => {
  const response =
    await axiosInstance.post<RefreshReturnTrackingApiResponse>(
      API.RETURN_REQUEST.REFRESH_TRACKING(identifier),
      {}
    );

  return response.data;
};

/* =========================================================
   GET RETURN REQUEST STATUS COUNTS API
========================================================= */

export const getReturnStatusCountsApi =
  async (): Promise<GetReturnStatusCountsApiResponse> => {
    const response =
      await axiosInstance.get<GetReturnStatusCountsApiResponse>(
        API.RETURN_REQUEST.STATUS_COUNTS
      );

    return response.data;
  };

/* =========================================================
   EXPORT RETURN REQUEST TYPES FOR CONVENIENCE
========================================================= */

export type {
  ReturnRequest,
  ReturnRequestStatus,
  ReturnReason,
  ReturnItem,
  ReturnShipment,
  ReturnTrackingEvent,
  ReturnRefund,
  ReturnRequestFilters,
  ReturnRequestStatusCounts,
  ApproveReturnRequestPayload,
  RejectReturnRequestPayload,
  RetryReturnPickupResponse,
  RefreshReturnTrackingResponse,
} from "@/src/types/admin/returnRequest.types";
