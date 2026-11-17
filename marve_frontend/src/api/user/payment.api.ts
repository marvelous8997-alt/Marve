import axiosInstance from "@/src/lib/axios";

import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  GetPaymentResponse,
} from "@/src/types/user/payment.types";

/* =========================
   API Endpoints
========================= */

export const PAYMENT_API = {
  BASE: "/user/payments",

  CREATE_ORDER: "/user/payments/create-order",

  VERIFY: "/user/payments/verify",

  GET_BY_ID: (id: number | string) =>
    `/user/payments/${id}`,
};

/* =========================
   Create Razorpay Order API
========================= */

export const createPaymentOrderApi = async (
  payload: CreatePaymentOrderRequest
): Promise<CreatePaymentOrderResponse> => {
  const response =
    await axiosInstance.post<CreatePaymentOrderResponse>(
      PAYMENT_API.CREATE_ORDER,
      payload
    );

  return response.data;
};

/* =========================
   Verify Razorpay Payment API
========================= */

export const verifyPaymentApi = async (
  payload: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> => {
  const response =
    await axiosInstance.post<VerifyPaymentResponse>(
      PAYMENT_API.VERIFY,
      payload
    );

  return response.data;
};

/* =========================
   Get Payment By ID API
========================= */

export const getPaymentByIdApi = async (
  id: number | string
): Promise<GetPaymentResponse> => {
  const response =
    await axiosInstance.get<GetPaymentResponse>(
      PAYMENT_API.GET_BY_ID(id)
    );

  return response.data;
};