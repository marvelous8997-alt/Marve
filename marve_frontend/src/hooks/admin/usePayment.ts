"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  getPaymentsService,
  getPaymentDetailsService,
  getPaymentSummaryService,
  getPaymentStatusCountsService,
  refundPaymentService,
} from "@/src/services/admin/payment.service";

import type {
  Payment,
  PaymentFilters,
  PaymentSummary,
  PaymentStatusCounts,
  PaymentListResult,
  RefundResult,
} from "@/src/types/admin/payment.types";

import type {
  RefundPaymentFormValues,
} from "@/src/validations/admin/payment.validation";

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getPaymentErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your payment details."
    );
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid payment request.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage payments."
      );
    }

    if (status === 404) {
      return serverMessage || "Payment not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "This payment operation conflicts with its current state."
      );
    }

    if (status === 422) {
      return (
        serverMessage ||
        "Please check your payment or refund details."
      );
    }

    if (status === 429) {
      return (
        serverMessage ||
        "Too many requests. Please try again later."
      );
    }

    if (status && status >= 500) {
      return (
        serverMessage ||
        "Something went wrong on the server. Please try again later."
      );
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* =========================================================
   RESPONSE NORMALIZATION
========================================================= */

type PaymentListData = {
  rows?: Payment[];
  payments?: Payment[];
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: {
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

const normalizePaymentList = (
  result: PaymentListResult | Payment[],
  requestedPage: number,
  requestedLimit: number
) => {
  const resultObject: PaymentListData | null =
    Array.isArray(result)
      ? null
      : (result as unknown as PaymentListData);

  const rows: Payment[] = Array.isArray(result)
    ? result
    : Array.isArray(resultObject?.payments)
      ? resultObject.payments
      : Array.isArray(resultObject?.rows)
        ? resultObject.rows
        : [];

  const meta = resultObject?.pagination ?? resultObject;

  const total = Number(
    meta?.total ?? meta?.count ?? rows.length
  );

  const page = Number(
    meta?.page ?? requestedPage
  );

  const limit = Math.max(
    Number(meta?.limit ?? requestedLimit) || 10,
    1
  );

  const safeTotal = Number.isFinite(total)
    ? total
    : rows.length;

  const safePage =
    Number.isFinite(page) && page > 0 ? page : 1;

  const totalPages = Number(
    meta?.totalPages ??
      Math.ceil(safeTotal / limit)
  );

  return {
    rows,
    pagination: {
      count: safeTotal,
      page: safePage,
      limit,
      totalPages: Number.isFinite(totalPages)
        ? totalPages
        : 0,
    },
  };
};

/* =========================================================
   PAYMENT HOOK
========================================================= */

export default function usePayment() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [summary, setSummary] =
    useState<PaymentSummary | null>(null);

  const [statusCounts, setStatusCounts] =
    useState<PaymentStatusCounts | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] =
    useState(false);
  const [isLoadingSummary, setIsLoadingSummary] =
    useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     FETCH PAYMENTS
  ======================================================= */

  const fetchPayments = useCallback(
    async (params: PaymentFilters = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getPaymentsService(params);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch payments."
          );
        }

        const normalized = normalizePaymentList(
          response.data,
          params.page ?? pagination.page,
          params.limit ?? pagination.limit
        );

        setPayments(normalized.rows);
        setPagination(normalized.pagination);

        return normalized;
      } catch (err: unknown) {
        const message = getPaymentErrorMessage(
          err,
          "Unable to fetch payments."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  /* =======================================================
     FETCH PAYMENT DETAILS
  ======================================================= */

  const fetchPaymentDetails = useCallback(
    async (identifier: string) => {
      setIsLoadingDetails(true);
      setError(null);

      try {
        const response =
          await getPaymentDetailsService(identifier);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch payment details."
          );
        }

        setSelectedPayment(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getPaymentErrorMessage(
          err,
          "Unable to fetch payment details."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoadingDetails(false);
      }
    },
    []
  );

  /* =======================================================
     FETCH PAYMENT SUMMARY
  ======================================================= */

  const fetchPaymentSummary = useCallback(async () => {
    setIsLoadingSummary(true);

    try {
      const response = await getPaymentSummaryService();

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to fetch payment summary."
        );
      }

      setSummary(response.data);

      return response.data;
    } catch (err: unknown) {
      const message = getPaymentErrorMessage(
        err,
        "Unable to fetch payment summary."
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  /* =======================================================
     FETCH PAYMENT STATUS COUNTS
  ======================================================= */

  const fetchPaymentStatusCounts =
    useCallback(async () => {
      try {
        const response =
          await getPaymentStatusCountsService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch payment status counts."
          );
        }

        setStatusCounts(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getPaymentErrorMessage(
          err,
          "Unable to fetch payment status counts."
        );

        setError(message);
        toast.error(message);
        throw err;
      }
    }, []);

  /* =======================================================
     REFUND PAYMENT
  ======================================================= */

  const refundPayment = useCallback(
    async (
      identifier: string,
      values: RefundPaymentFormValues
    ) => {
      setIsRefunding(true);
      setError(null);

      try {
        const response = await refundPaymentService(
          identifier,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to process the refund."
          );
        }

        const refundResult: RefundResult = response.data;

        toast.success(
          response.message ||
            "Refund request processed successfully."
        );

        return refundResult;
      } catch (err: unknown) {
        const message = getPaymentErrorMessage(
          err,
          "Unable to process the refund."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsRefunding(false);
      }
    },
    []
  );

  /* =======================================================
     CLEAR SELECTED PAYMENT
  ======================================================= */

  const clearSelectedPayment = useCallback(() => {
    setSelectedPayment(null);
  }, []);

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    payments,
    selectedPayment,
    summary,
    statusCounts,
    pagination,

    isLoading,
    isLoadingDetails,
    isLoadingSummary,
    isRefunding,

    error,

    fetchPayments,
    fetchPaymentDetails,
    fetchPaymentSummary,
    fetchPaymentStatusCounts,
    refundPayment,

    clearSelectedPayment,
    clearError,
  };
}
