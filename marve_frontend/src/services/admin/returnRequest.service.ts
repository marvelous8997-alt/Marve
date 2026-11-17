import {
  getReturnRequestsApi,
  getReturnRequestApi,
  approveReturnRequestApi,
  rejectReturnRequestApi,
  retryReturnPickupApi,
  refreshReturnTrackingApi,
  getReturnStatusCountsApi,
} from "@/src/api/admin/returnRequest.api";

import type {
  GetReturnRequestsRequest,
  GetReturnRequestsApiResponse,
  GetReturnRequestApiResponse,
  ApproveReturnRequestApiResponse,
  RejectReturnRequestApiResponse,
  RetryReturnPickupApiResponse,
  RefreshReturnTrackingApiResponse,
  GetReturnStatusCountsApiResponse,
} from "@/src/api/admin/returnRequest.api";

import type {
  ReturnRequest,
  ReturnRequestFilters,
  ReturnRequestListResult,
  ReturnRequestPagination,
  ReturnRequestStatusCounts,
  ApproveReturnRequestPayload,
  RejectReturnRequestPayload,
  RetryReturnPickupResponse
} from "@/src/types/admin/returnRequest.types";

/* =========================================================
   RESPONSE NORMALIZATION HELPERS
========================================================= */

const normalizePagination = (
  pagination?: Partial<ReturnRequestPagination> | null,
  fallback?: {
    page?: number;
    limit?: number;
    total?: number;
  }
): ReturnRequestPagination => {
  const page = Number(
    pagination?.page ?? fallback?.page ?? 1
  );

  const limit = Number(
    pagination?.limit ?? fallback?.limit ?? 10
  );

  const total = Number(
    pagination?.total ?? fallback?.total ?? 0
  );

  return {
    page,
    limit,
    total,
    totalPages: Number(
      pagination?.totalPages ??
        Math.ceil(total / Math.max(limit, 1))
    ),
  };
};

/* =========================================================
   NORMALIZE RETURN REQUEST LIST
========================================================= */

const normalizeReturnRequestList = (
  response: GetReturnRequestsApiResponse,
  params: GetReturnRequestsRequest = {}
): ReturnRequestListResult => {
  const data = response.data;

  if (Array.isArray(data)) {
    return {
      rows: data,
      count: data.length,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: Math.ceil(
        data.length / Math.max(params.limit ?? 10, 1)
      ),
    };
  }

  const result = data as ReturnRequestListResult & {
    rows?: ReturnRequest[];
    returnRequests?: ReturnRequest[];
    data?: ReturnRequest[];
    pagination?: Partial<ReturnRequestPagination>;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };

  const rows = Array.isArray(result.rows)
    ? result.rows
    : Array.isArray(result.returnRequests)
      ? result.returnRequests
      : Array.isArray(result.data)
        ? result.data
        : [];

  const count = Number(
    result.count ?? result.total ?? rows.length
  );

  const pagination = normalizePagination(
    result.pagination ?? {
      total: count,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
    {
      page: params.page,
      limit: params.limit,
      total: count,
    }
  );

  return {
    rows,
    count: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: pagination.totalPages,
  };
};

/* =========================================================
   GET RETURN REQUESTS SERVICE
========================================================= */

export const getReturnRequestsService = async (
  params: ReturnRequestFilters = {}
): Promise<ReturnRequestListResult> => {
  const response = await getReturnRequestsApi(params);

  return normalizeReturnRequestList(response, params);
};

/* =========================================================
   GET RETURN REQUEST DETAILS SERVICE
========================================================= */

export const getReturnRequestDetailsService = async (
  uuid: string
): Promise<ReturnRequest> => {
  const response: GetReturnRequestApiResponse =
    await getReturnRequestApi(uuid);

  return response.data;
};

/* =========================================================
   APPROVE RETURN REQUEST SERVICE
========================================================= */

export const approveReturnRequestService = async (
  uuid: string,
  values: ApproveReturnRequestPayload = {}
): Promise<ApproveReturnRequestApiResponse> => {
  return approveReturnRequestApi(uuid, values);
};

/* =========================================================
   REJECT RETURN REQUEST SERVICE
========================================================= */

export const rejectReturnRequestService = async (
  uuid: string,
  values: RejectReturnRequestPayload
): Promise<RejectReturnRequestApiResponse> => {
  return rejectReturnRequestApi(uuid, values);
};

/* =========================================================
   RETRY RETURN PICKUP SERVICE
========================================================= */

export const retryReturnPickupService = async (
  uuid: string
): Promise<RetryReturnPickupApiResponse> => {
  return retryReturnPickupApi(uuid);
};

/* =========================================================
   REFRESH RETURN TRACKING SERVICE
========================================================= */

export const refreshReturnTrackingService = async (
  uuid: string
): Promise<ReturnRequest> => {
  const response: RefreshReturnTrackingApiResponse =
    await refreshReturnTrackingApi(uuid);

  return response.data;
};

/* =========================================================
   GET RETURN REQUEST STATUS COUNTS SERVICE
========================================================= */

export const getReturnStatusCountsService =
  async (): Promise<ReturnRequestStatusCounts> => {
    const response: GetReturnStatusCountsApiResponse =
      await getReturnStatusCountsApi();

    return response.data;
  };

/* =========================================================
   REFRESH RETURN REQUEST DETAILS SERVICE
========================================================= */

export const refreshReturnRequestDetailsService = async (
  uuid: string
): Promise<ReturnRequest> => {
  return getReturnRequestDetailsService(uuid);
};

/* =========================================================
   EXPORT TYPES FOR CONVENIENCE
========================================================= */

export type {
  ReturnRequest,
  ReturnRequestFilters,
  ReturnRequestListResult,
  ReturnRequestPagination,
  ReturnRequestStatusCounts,
  ApproveReturnRequestPayload,
  RejectReturnRequestPayload,
  RetryReturnPickupResponse,
  GetReturnRequestsRequest,
};