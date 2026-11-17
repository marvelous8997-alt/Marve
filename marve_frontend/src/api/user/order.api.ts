import axiosInstance from "@/src/lib/axios";

import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrdersResponse,
  GetOrdersQuery,
  CancelOrderResponse,
} from "@/src/types/user/order.types";

/* =========================
   API Endpoints
========================= */

export const ORDER_API = {
  BASE: "/user/orders",

  CREATE: "/user/orders",

  GET_ALL: "/user/orders",

  GET_BY_ID: (id: number | string) =>
    `/user/orders/${id}`,

  CANCEL: (id: number | string) =>
  `/user/orders/${encodeURIComponent(String(id))}/cancel`,
};

/* =========================
   Create Order API
========================= */

export const createOrderApi = async (
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const response =
    await axiosInstance.post<CreateOrderResponse>(
      ORDER_API.CREATE,
      payload
    );

  return response.data;
};

/* =========================
   Get All User Orders API
========================= */

export const getOrdersApi = async (
  params: GetOrdersQuery = {}
): Promise<GetOrdersResponse> => {
  const response =
    await axiosInstance.get<GetOrdersResponse>(
      ORDER_API.GET_ALL,
      { params }
    );

  return response.data;
};

/* =========================
   Get Order By ID API
========================= */

export const getOrderByIdApi = async (
  id: number | string
): Promise<GetOrderResponse> => {
  const response =
    await axiosInstance.get<GetOrderResponse>(
      ORDER_API.GET_BY_ID(id)
    );

  return response.data;
};

/* =========================
   Cancel Order API
========================= */

export const cancelOrderApi = async (
  id: number | string
): Promise<CancelOrderResponse> => {
  const response =
    await axiosInstance.patch<CancelOrderResponse>(
      ORDER_API.CANCEL(id)
    );

  return response.data;
};