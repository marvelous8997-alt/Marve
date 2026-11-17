import {
  createPaymentOrderApi,
  verifyPaymentApi,
  getPaymentByIdApi,
} from "@/src/api/user/payment.api";

import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  GetPaymentResponse,
} from "@/src/types/user/payment.types";

/* =========================
   Create Payment Order Service
========================= */

export const createPaymentOrderService = async (
  payload: CreatePaymentOrderRequest
): Promise<CreatePaymentOrderResponse> => {
  return await createPaymentOrderApi(payload);
};

/* =========================
   Verify Payment Service
========================= */

export const verifyPaymentService = async (
  payload: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> => {
  return await verifyPaymentApi(payload);
};

/* =========================
   Get Payment By ID Service
========================= */

export const getPaymentByIdService = async (
  id: number | string
): Promise<GetPaymentResponse> => {
  return await getPaymentByIdApi(id);
};