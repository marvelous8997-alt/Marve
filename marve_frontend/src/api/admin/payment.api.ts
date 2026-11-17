import axiosInstance from "@/src/lib/axios";

import type {
  Payment,
  PaymentFilters,
  PaymentListResult,
  PaymentApiResponse,
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
  PaymentSummary,
  PaymentStatusCounts,
  RefundPaymentData,
  RefundResult,
} from "@/src/types/admin/payment.types";

/* =========================================================
   API ENDPOINTS
========================================================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  PAYMENT: {
    LIST: "/admin/payments/list",

    DETAILS: (uuid: string) =>
      `/admin/payments/list/${encodeURIComponent(uuid)}`,

    SUMMARY: "/admin/payments/summary",

    STATUS_COUNTS: "/admin/payments/status-counts",

    REFUND: (uuid: string) =>
      `/admin/payments/refund/${encodeURIComponent(uuid)}`,
  },
};

/* =========================================================
   REQUEST TYPES
========================================================= */

export interface GetPaymentsRequest extends PaymentFilters {
  page?: number;
  limit?: number;
}

export interface RefundPaymentRequest extends RefundPaymentData {}

/* =========================================================
   RESPONSE TYPES
========================================================= */

export type GetPaymentsApiResponse = PaymentApiResponse<
  PaymentListResult | Payment[]
>;

export type GetPaymentApiResponse = PaymentApiResponse<Payment>;

export type GetPaymentSummaryApiResponse =
  PaymentApiResponse<PaymentSummary>;

export type GetPaymentStatusCountsApiResponse =
  PaymentApiResponse<PaymentStatusCounts>;

export type RefundPaymentApiResponse =
  PaymentApiResponse<RefundResult>;

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
   GET PAYMENTS API
========================================================= */

export const getPaymentsApi = async (
  params: GetPaymentsRequest = {}
): Promise<GetPaymentsApiResponse> => {
  const queryParams = buildQueryParams({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    method: params.method,
    provider: params.provider,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response =
    await axiosInstance.get<GetPaymentsApiResponse>(
      API.PAYMENT.LIST,
      {
        params: queryParams,
      }
    );

  return response.data;
};

/* =========================================================
   GET PAYMENT DETAILS API
========================================================= */

export const getPaymentApi = async (
  uuid: string
): Promise<GetPaymentApiResponse> => {
  const response =
    await axiosInstance.get<GetPaymentApiResponse>(
      API.PAYMENT.DETAILS(uuid)
    );

  return response.data;
};

/* =========================================================
   GET PAYMENT SUMMARY API
========================================================= */

export const getPaymentSummaryApi =
  async (): Promise<GetPaymentSummaryApiResponse> => {
    const response =
      await axiosInstance.get<GetPaymentSummaryApiResponse>(
        API.PAYMENT.SUMMARY
      );

    return response.data;
  };

/* =========================================================
   GET PAYMENT STATUS COUNTS API
========================================================= */

export const getPaymentStatusCountsApi =
  async (): Promise<GetPaymentStatusCountsApiResponse> => {
    const response =
      await axiosInstance.get<GetPaymentStatusCountsApiResponse>(
        API.PAYMENT.STATUS_COUNTS
      );

    return response.data;
  };

/* =========================================================
   REFUND PAYMENT API
========================================================= */

export const refundPaymentApi = async (
  uuid: string,
  payload: RefundPaymentRequest
): Promise<RefundPaymentApiResponse> => {
  const requestData: RefundPaymentData = {
    amount: payload.amount,
    reason: payload.reason,
  };

  const response =
    await axiosInstance.post<RefundPaymentApiResponse>(
      API.PAYMENT.REFUND(uuid),
      requestData
    );

  return response.data;
};

/* =========================================================
   EXPORT TYPES FOR CONVENIENCE
========================================================= */

export type {
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
};
