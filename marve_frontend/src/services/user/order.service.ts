import {
  createOrderApi,
  getOrdersApi,
  getOrderByIdApi,
  cancelOrderApi,
} from "@/src/api/user/order.api";

import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrdersResponse,
  GetOrdersQuery,
  CancelOrderResponse,
} from "@/src/types/user/order.types";

/* =========================
   Create Order Service
========================= */

export const createOrderService = async (
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  return await createOrderApi(payload);
};

/* =========================
   Get All User Orders Service
========================= */

export const getOrdersService = async (
  params: GetOrdersQuery = {}
): Promise<GetOrdersResponse> => {
  return await getOrdersApi(params);
};

/* =========================
   Get Order By ID Service
========================= */

export const getOrderByIdService = async (
  id: number | string
): Promise<GetOrderResponse> => {
  return await getOrderByIdApi(id);
};

/* =========================
   Cancel Order Service
========================= */

export const cancelOrderService = async (
  id: number | string
): Promise<CancelOrderResponse> => {
  return await cancelOrderApi(id);
};