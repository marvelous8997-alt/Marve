
import {
  getOrdersApi,
  getOrderApi,
  updateOrderStatusApi,
  updatePaymentStatusApi,
  cancelOrderApi,
} from "@/src/api/admin/order.api";
import type {
  GetOrdersRequest,
  GetOrdersApiResponse,
  GetOrderApiResponse,
  UpdateOrderStatusApiResponse,
  UpdatePaymentStatusApiResponse,
  CancelOrderApiResponse,
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
} from "@/src/api/admin/order.api";

import type {
  Order,
  OrderFilters,
  OrderListResult,
  OrderPagination,
  OrderApiResponse,
} from "@/src/types/admin/order.types";

/* =========================================================
   RESPONSE NORMALIZATION HELPERS
========================================================= */

const normalizePagination = (
  pagination?: Partial<OrderPagination> | null,
  fallback?: {
    page?: number;
    limit?: number;
    total?: number;
  }
): OrderPagination => {
  const page = Number(pagination?.page ?? fallback?.page ?? 1);
  const limit = Number(pagination?.limit ?? fallback?.limit ?? 10);
  const total = Number(pagination?.total ?? fallback?.total ?? 0);

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


const normalizeOrderList = (
  response: GetOrdersApiResponse,
  params: GetOrdersRequest = {}
): OrderListResult => {
  const data = response.data;

  if (Array.isArray(data)) {
    return {
      orders: data,
      pagination: normalizePagination(undefined, {
        page: params.page,
        limit: params.limit,
        total: data.length,
      }),
    };
  }

  const result = data as OrderListResult & {
    rows?: Order[];
    orders?: Order[];
    data?: Order[];
    pagination?: Partial<OrderPagination>;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };

  // Backend Sequelize result uses "rows".
  const orders = Array.isArray(result.rows)
    ? result.rows
    : Array.isArray(result.orders)
      ? result.orders
      : Array.isArray(result.data)
        ? result.data
        : [];

  // Backend returns "count"; frontend pagination uses "total".
  const total = Number(result.total ?? result.count ?? orders.length);

  return {
    orders,
    pagination: normalizePagination(
      result.pagination ?? {
        total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      {
        page: params.page,
        limit: params.limit,
        total,
      }
    ),
  };
};


/* =========================================================
   GET ORDERS SERVICE
========================================================= */

export const getOrdersService = async (
  params: OrderFilters = {}
): Promise<OrderListResult> => {
  const response = await getOrdersApi(params);

  return normalizeOrderList(response, params);
};

/* =========================================================
   GET ORDER DETAILS SERVICE
========================================================= */

export const getOrderDetailsService = async (
  uuid: string
): Promise<Order> => {
  const response: GetOrderApiResponse = await getOrderApi(uuid);

  return response.data;
};

/* =========================================================
   UPDATE ORDER STATUS SERVICE
========================================================= */

export const updateOrderStatusService = async (
  uuid: string,
  values: UpdateOrderStatusRequest
): Promise<UpdateOrderStatusApiResponse> => {
  return await updateOrderStatusApi(uuid, values);
};

/* =========================================================
   UPDATE PAYMENT STATUS SERVICE
========================================================= */

export const updatePaymentStatusService = async (
  uuid: string,
  values: UpdatePaymentStatusRequest
): Promise<UpdatePaymentStatusApiResponse> => {
  return await updatePaymentStatusApi(uuid, values);
};

/* =========================================================
   CANCEL ORDER SERVICE
========================================================= */

export const cancelOrderService = async (
  uuid: string
): Promise<CancelOrderApiResponse> => {
  return await cancelOrderApi(uuid);
};

/* =========================================================
   REFRESH ORDER DETAILS SERVICE
========================================================= */

export const refreshOrderDetailsService = async (
  uuid: string
): Promise<Order> => {
  return await getOrderDetailsService(uuid);
};

/* =========================================================
   EXPORT TYPES FOR CONVENIENCE
========================================================= */

export type {
  Order,
  OrderFilters,
  OrderListResult,
  OrderPagination,
};
