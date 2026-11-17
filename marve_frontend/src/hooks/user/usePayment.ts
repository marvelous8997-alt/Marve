"use client";

import {
  useState,
  useCallback,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  createPaymentOrderService,
  verifyPaymentService,
  getPaymentByIdService,
} from "@/src/services/user/payment.service";

import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderData,
  VerifyPaymentRequest,
  VerifyPaymentData,
  PaymentDetails,
} from "@/src/types/user/payment.types";

/* =========================
   Error Message Handler
========================= */

const getPaymentErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Please check your payment details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in to continue with payment.";
    }

    if (status === 403) {
      return serverMessage || "You are not allowed to perform this payment.";
    }

    if (status === 404) {
      return serverMessage || "Order or payment was not found.";
    }

    if (status === 409) {
      return serverMessage || "This payment conflicts with an existing request.";
    }

    if (status === 429) {
      return serverMessage || "Too many requests. Please try again later.";
    }

    if (status && status >= 500) {
      return "A server error occurred. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* =========================
   Payment Hook
========================= */

export default function usePayment() {
  const [paymentOrder, setPaymentOrder] =
    useState<CreatePaymentOrderData | null>(null);

  const [payment, setPayment] =
    useState<PaymentDetails | null>(null);

  const [verification, setVerification] =
    useState<VerifyPaymentData | null>(null);

  const [isCreatingOrder, setIsCreatingOrder] =
    useState(false);

  const [isVerifyingPayment, setIsVerifyingPayment] =
    useState(false);

  const [isFetchingPayment, setIsFetchingPayment] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Create Razorpay Order
  ========================= */

  const createPaymentOrder = useCallback(
    async (payload: CreatePaymentOrderRequest) => {
      setIsCreatingOrder(true);
      setError(null);
      setPaymentOrder(null);
      setVerification(null);

      try {
        const response = await createPaymentOrderService(payload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create payment order."
          );
        }

        setPaymentOrder(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getPaymentErrorMessage(
          err,
          "Unable to create payment order. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsCreatingOrder(false);
      }
    },
    []
  );

  /* =========================
     Verify Razorpay Payment
  ========================= */

  const verifyPayment = useCallback(
    async (payload: VerifyPaymentRequest) => {
      setIsVerifyingPayment(true);
      setError(null);
      setVerification(null);

      try {
        const response = await verifyPaymentService(payload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to verify payment."
          );
        }

      const verifiedPayment = response.data;

      // Never treat an unverified response as payment success.
      if (verifiedPayment.verified !== true) {
        throw new Error(
          "Payment verification is not confirmed by the server."
        );
      }

      setVerification(verifiedPayment);

        toast.success(
          response.message || "Payment verified successfully."
        );

        return verifiedPayment;
      } catch (err: unknown) {
        const message = getPaymentErrorMessage(
          err,
          "Payment verification failed. Please contact support if money was deducted."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsVerifyingPayment(false);
      }
    },
    []
  );

  /* =========================
     Get Payment By ID
  ========================= */

  const fetchPaymentById = useCallback(
    async (id: number | string) => {
      setIsFetchingPayment(true);
      setError(null);
      setPayment(null);

      try {
        const response = await getPaymentByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch payment details."
          );
        }

        setPayment(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getPaymentErrorMessage(
          err,
          "Unable to fetch payment details. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingPayment(false);
      }
    },
    []
  );

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Reset Payment State
  ========================= */

  const resetPayment = useCallback(() => {
    setPaymentOrder(null);
    setPayment(null);
    setVerification(null);
    setError(null);
  }, []);

  /* =========================
     Return Hook Values
  ========================= */

  return {
    paymentOrder,
    payment,
    verification,

    isCreatingOrder,
    isVerifyingPayment,
    isFetchingPayment,

    error,

    createPaymentOrder,
    verifyPayment,
    fetchPaymentById,

    clearError,
    resetPayment,
  };
}