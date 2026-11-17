import {
  getPaymentsApi,
  getPaymentApi,
  getPaymentSummaryApi,
  getPaymentStatusCountsApi,
  refundPaymentApi,
} from "@/src/api/admin/payment.api";

import type {
  GetPaymentsRequest,
  GetPaymentsApiResponse,
  GetPaymentApiResponse,
  GetPaymentSummaryApiResponse,
  GetPaymentStatusCountsApiResponse,
  RefundPaymentRequest,
  RefundPaymentApiResponse,
} from "@/src/api/admin/payment.api";

import type { PaymentFilters } from "@/src/types/admin/payment.types";

import {
  getPaymentsSchema,
  getPaymentSchema,
  refundPaymentSchema,
} from "@/src/validations/admin/payment.validation";

import type {
  GetPaymentsFormValues,
  GetPaymentFormValues,
  RefundPaymentFormValues,
} from "@/src/validations/admin/payment.validation";

/* =========================================================
   GET PAYMENTS SERVICE
========================================================= */

export const getPaymentsService = async (
  params: PaymentFilters = {}
): Promise<GetPaymentsApiResponse> => {
  const payload = getPaymentsSchema.parse(params);

  return await getPaymentsApi(
    payload as GetPaymentsRequest
  );
};

/* =========================================================
   GET PAYMENT DETAILS SERVICE
========================================================= */

export const getPaymentDetailsService = async (
  identifier: string
): Promise<GetPaymentApiResponse> => {
  const payload = getPaymentSchema.parse({
    identifier,
  });

  return await getPaymentApi(
    String(payload.identifier)
  );
};

/* =========================================================
   GET PAYMENT SUMMARY SERVICE
========================================================= */

export const getPaymentSummaryService =
  async (): Promise<GetPaymentSummaryApiResponse> => {
    return await getPaymentSummaryApi();
  };

/* =========================================================
   GET PAYMENT STATUS COUNTS SERVICE
========================================================= */

export const getPaymentStatusCountsService =
  async (): Promise<GetPaymentStatusCountsApiResponse> => {
    return await getPaymentStatusCountsApi();
  };

/* =========================================================
   REFUND PAYMENT SERVICE
========================================================= */

export const refundPaymentService = async (
  identifier: string,
  values: RefundPaymentFormValues
): Promise<RefundPaymentApiResponse> => {
  const paymentPayload = getPaymentSchema.parse({
    identifier,
  }) as GetPaymentFormValues;

  const refundPayload = refundPaymentSchema.parse(
    values
  ) as RefundPaymentRequest;

  return await refundPaymentApi(
    String(paymentPayload.identifier),
    refundPayload
  );
};
