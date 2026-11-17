
import axiosInstance from "@/src/lib/axios";

import type {
  Customer,
  CustomerFilters,
  CustomerListResult,
  CustomerApiResponse,
  CustomerStatus,
  CustomerStatusCounts,
  UpdateCustomerStatusData,
} from "@/src/types/admin/customer.types";

/* =========================================================
   API ENDPOINTS
========================================================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  CUSTOMER: {
    LIST: "/admin/customers/list",

    DETAILS: (id: string | number) =>
      `/admin/customers/list/${encodeURIComponent(String(id))}`,

    STATUS: (id: string | number) =>
      `/admin/customers/status/${encodeURIComponent(String(id))}`,

    STATUS_COUNTS: "/admin/customers/status-counts",

  },
};

/* =========================================================
   REQUEST TYPES
========================================================= */

export interface GetCustomersRequest extends CustomerFilters {
  page?: number;
  limit?: number;
}

export interface UpdateCustomerStatusRequest {
  status: CustomerStatus;
}

/* =========================================================
   RESPONSE TYPES
========================================================= */

export type GetCustomersApiResponse =
  CustomerApiResponse<CustomerListResult>;

export type GetCustomerApiResponse =
  CustomerApiResponse<Customer>;

export type UpdateCustomerStatusApiResponse =
  CustomerApiResponse<Customer>;

export type GetCustomerStatusCountsApiResponse =
  CustomerApiResponse<CustomerStatusCounts>;

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
   GET CUSTOMERS API
========================================================= */

export const getCustomersApi = async (
  params: GetCustomersRequest = {}
): Promise<GetCustomersApiResponse> => {
  const queryParams = buildQueryParams({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response =
    await axiosInstance.get<GetCustomersApiResponse>(
      API.CUSTOMER.LIST,
      {
        params: queryParams,
      }
    );

  return response.data;
};

/* =========================================================
   GET CUSTOMER DETAILS API
========================================================= */

export const getCustomerApi = async (
  id: string | number
): Promise<GetCustomerApiResponse> => {
  const response =
    await axiosInstance.get<GetCustomerApiResponse>(
      API.CUSTOMER.DETAILS(id)
    );

  return response.data;
};

/* =========================================================
   UPDATE CUSTOMER STATUS API
========================================================= */

export const updateCustomerStatusApi = async (
  id: string | number,
  payload: UpdateCustomerStatusRequest
): Promise<UpdateCustomerStatusApiResponse> => {
  const requestData: UpdateCustomerStatusData = {
    status: payload.status,
  };

  const response =
    await axiosInstance.patch<UpdateCustomerStatusApiResponse>(
      API.CUSTOMER.STATUS(id),
      requestData
    );

  return response.data;
};

/* =========================================================
   GET CUSTOMER STATUS COUNTS API
========================================================= */

export const getCustomerStatusCountsApi =
  async (): Promise<GetCustomerStatusCountsApiResponse> => {
    const response =
      await axiosInstance.get<GetCustomerStatusCountsApiResponse>(
        API.CUSTOMER.STATUS_COUNTS
      );

    return response.data;
  };

/* =========================================================
   EXPORT TYPES FOR CONVENIENCE
========================================================= */

export type {
  CustomerStatus,
  CustomerStatusCounts,
};
