
import {
  getCustomersApi,
  getCustomerApi,
  updateCustomerStatusApi,
  getCustomerStatusCountsApi,
} from "@/src/api/admin/customer.api";

import type {
  GetCustomersRequest,
  GetCustomersApiResponse,
  GetCustomerApiResponse,
  UpdateCustomerStatusApiResponse,
  GetCustomerStatusCountsApiResponse,
  UpdateCustomerStatusRequest,
} from "@/src/api/admin/customer.api";

import type {
  Customer,
  CustomerFilters,
  CustomerListResult,
  CustomerPagination,
  CustomerStatusCounts,
} from "@/src/types/admin/customer.types";

/* =========================================================
   RESPONSE NORMALIZATION HELPERS
========================================================= */

const normalizePagination = (
  pagination?: Partial<CustomerPagination> | null,
  fallback?: {
    page?: number;
    limit?: number;
    total?: number;
  }
): CustomerPagination => {
  const page = Number(
    pagination?.page ?? fallback?.page ?? 1
  );

  const limit = Number(
    pagination?.limit ?? fallback?.limit ?? 8
  );

  const count = Number(
    pagination?.count ?? fallback?.total ?? 0
  );

  return {
    count,
    page,
    limit,
    totalPages: Number(
      pagination?.totalPages ??
        Math.ceil(count / Math.max(limit, 1))
    ),
  };
};

/* =========================================================
   NORMALIZE CUSTOMER LIST
========================================================= */

const normalizeCustomerList = (
  response: GetCustomersApiResponse,
  params: GetCustomersRequest = {}
): CustomerListResult => {
  const data = response.data;

  if (Array.isArray(data)) {
    return {
      rows: data,
      count: data.length,
      page: Number(params.page ?? 1),
      limit: Number(params.limit ?? 8),
      totalPages: Math.ceil(
        data.length / Math.max(Number(params.limit ?? 8), 1)
      ),
    };
  }

  const result = data as CustomerListResult & {
    rows?: Customer[];
    customers?: Customer[];
    data?: Customer[];
    pagination?: Partial<CustomerPagination>;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };

  const customers = Array.isArray(result.rows)
    ? result.rows
    : Array.isArray(result.customers)
      ? result.customers
      : Array.isArray(result.data)
        ? result.data
        : [];

  const count = Number(
    result.count ?? result.total ?? customers.length
  );

  const pagination = normalizePagination(
    result.pagination ?? {
      count,
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
    rows: customers,
    count: pagination.count,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: pagination.totalPages,
  };
};

/* =========================================================
   GET CUSTOMERS SERVICE
========================================================= */

export const getCustomersService = async (
  params: CustomerFilters = {}
): Promise<CustomerListResult> => {
  const requestParams: GetCustomersRequest = {
    ...params,
    page: params.page ?? 1,
    limit: params.limit ?? 8,
  };

  const response = await getCustomersApi(requestParams);

  return normalizeCustomerList(response, requestParams);
};

/* =========================================================
   GET CUSTOMER DETAILS SERVICE
========================================================= */

export const getCustomerDetailsService = async (
  id: string | number
): Promise<Customer> => {
  const response: GetCustomerApiResponse =
    await getCustomerApi(id);

  return response.data;
};

/* =========================================================
   UPDATE CUSTOMER STATUS SERVICE
========================================================= */

export const updateCustomerStatusService = async (
  id: string | number,
  values: UpdateCustomerStatusRequest
): Promise<UpdateCustomerStatusApiResponse> => {
  return await updateCustomerStatusApi(id, values);
};

/* =========================================================
   GET CUSTOMER STATUS COUNTS SERVICE
========================================================= */

export const getCustomerStatusCountsService =
  async (): Promise<CustomerStatusCounts> => {
    const response: GetCustomerStatusCountsApiResponse =
      await getCustomerStatusCountsApi();

    return response.data;
  };

/* =========================================================
   REFRESH CUSTOMER DETAILS SERVICE
========================================================= */

export const refreshCustomerDetailsService = async (
  id: string | number
): Promise<Customer> => {
  return await getCustomerDetailsService(id);
};

/* =========================================================
   EXPORT TYPES FOR CONVENIENCE
========================================================= */

export type {
  Customer,
  CustomerFilters,
  CustomerListResult,
  CustomerPagination,
  CustomerStatusCounts,
};
