
import axiosInstance from "@/src/lib/axios";

import type {
  Order,
  OrderFilters,
  OrderListResult,
  OrderApiResponse,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  UpdateOrderStatusData,
  UpdatePaymentStatusData,
} from "@/src/types/admin/order.types";

/* =========================================================
   API ENDPOINTS
========================================================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  ORDER: {
    LIST: "/admin/orders/list",

    DETAILS: (uuid: string) =>
      `/admin/orders/list/${encodeURIComponent(uuid)}`,

    STATUS: (uuid: string) =>
      `/admin/orders/status/${encodeURIComponent(uuid)}`,

    PAYMENT_STATUS: (uuid: string) =>
      `/admin/orders/payment-status/${encodeURIComponent(uuid)}`,

CANCEL: (uuid: string) =>
  `/admin/orders/cancel/${encodeURIComponent(uuid)}`,
  },
};

/* =========================================================
   REQUEST TYPES
========================================================= */

export interface GetOrdersRequest extends OrderFilters {
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
}

/* =========================================================
   RESPONSE TYPES
========================================================= */

export type GetOrdersApiResponse = OrderApiResponse<
  OrderListResult | Order[]
>;

export type GetOrderApiResponse = OrderApiResponse<Order>;

export type UpdateOrderStatusApiResponse =
  OrderApiResponse<Order>;

export type UpdatePaymentStatusApiResponse =
  OrderApiResponse<Order>;

export type CancelOrderApiResponse =
  OrderApiResponse<Order>;

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
    if (value !== undefined && value !== null && value !== "") {
      queryParams[key] = value;
    }
  });

  return queryParams;
};

/* =========================================================
   GET ORDERS API
========================================================= */

export const getOrdersApi = async (
  params: GetOrdersRequest = {}
): Promise<GetOrdersApiResponse> => {
  const queryParams = buildQueryParams({
    page: params.page,
    limit: params.limit,
    search: params.search,
    orderNumber: params.orderNumber,
    customer: params.customer,
    phone: params.phone,
    product: params.product,
    orderStatus: params.orderStatus,
    paymentStatus: params.paymentStatus,
    paymentMethod: params.paymentMethod,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response =
    await axiosInstance.get<GetOrdersApiResponse>(
      API.ORDER.LIST,
      {
        params: queryParams,
      }
    );

  return response.data;
};

/* =========================================================
   GET ORDER DETAILS API
========================================================= */

export const getOrderApi = async (
  uuid: string
): Promise<GetOrderApiResponse> => {
  const response =
    await axiosInstance.get<GetOrderApiResponse>(
      API.ORDER.DETAILS(uuid)
    );

  return response.data;
};

/* =========================================================
   UPDATE ORDER STATUS API
========================================================= */

export const updateOrderStatusApi = async (
  uuid: string,
  payload: UpdateOrderStatusRequest
): Promise<UpdateOrderStatusApiResponse> => {
  const requestData: UpdateOrderStatusData = {
    status: payload.status,
  };

  const response =
    await axiosInstance.patch<UpdateOrderStatusApiResponse>(
      API.ORDER.STATUS(uuid),
      requestData
    );

  return response.data;
};

/* =========================================================
   UPDATE PAYMENT STATUS API
========================================================= */

export const updatePaymentStatusApi = async (
  uuid: string,
  payload: UpdatePaymentStatusRequest
): Promise<UpdatePaymentStatusApiResponse> => {
  const requestData: UpdatePaymentStatusData = {
    paymentStatus: payload.paymentStatus,
  };

  const response =
    await axiosInstance.patch<UpdatePaymentStatusApiResponse>(
      API.ORDER.PAYMENT_STATUS(uuid),
      requestData
    );

  return response.data;
};
/* =========================================================
   CANCEL ORDER API
========================================================= */

export const cancelOrderApi = async (
  uuid: string
): Promise<CancelOrderApiResponse> => {
  const response =
    await axiosInstance.patch<CancelOrderApiResponse>(
      API.ORDER.CANCEL(uuid)
    );

  return response.data;
};
/* =========================================================
   EXPORT STATUS TYPES FOR CONVENIENCE
========================================================= */

export type {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
};
