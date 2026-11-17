import { z } from "zod";

/* =========================================================
   PAYMENT STATUSES
========================================================= */

export const PAYMENT_STATUSES = [
  "CREATED",
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;

/* =========================================================
   PAYMENT METHODS
========================================================= */

export const PAYMENT_METHODS = [
  "ONLINE",
  "COD",
  "UPI",
  "CARD",
  "NETBANKING",
  "WALLET",
  "EMI",
  "OTHER",
] as const;

/* =========================================================
   PAYMENT PROVIDERS
========================================================= */

export const PAYMENT_PROVIDERS = [
  "RAZORPAY",
  "COD",
] as const;

/* =========================================================
   REFUND REASONS
========================================================= */

export const REFUND_REASONS = [
  "CUSTOMER_REQUEST",
  "ORDER_CANCELLED",
  "PRODUCT_RETURNED",
  "PRODUCT_DAMAGED",
  "DUPLICATE_PAYMENT",
  "PAYMENT_ERROR",
  "OTHER",
] as const;

/* =========================================================
   SORT FIELDS
========================================================= */

export const PAYMENT_SORT_FIELDS = [
  "paymentNumber",
  "amount",
  "status",
  "method",
  "provider",
  "createdAt",
  "updatedAt",
  "capturedAt",
] as const;

export const PAYMENT_SORT_ORDERS = [
  "ASC",
  "DESC",
] as const;

/* =========================================================
   PAYMENT IDENTIFIER
========================================================= */

const paymentIdentifierSchema = z
  .union([
    z.number().int().positive(),
    z.string().trim().min(1, "Payment identifier is required."),
  ])
  .refine(
    (value) =>
      typeof value !== "string" || value.length <= 255,
    "Payment identifier cannot exceed 255 characters."
  );

/* =========================================================
   PAYMENT FILTER SCHEMAS
========================================================= */

const paymentSearchSchema = z
  .string()
  .trim()
  .max(255, "Search cannot exceed 255 characters.")
  .optional()
  .default("");

const paymentStatusSchema = z
  .enum(PAYMENT_STATUSES)
  .optional();

const paymentMethodSchema = z
  .enum(PAYMENT_METHODS)
  .optional();

const paymentProviderSchema = z
  .enum(PAYMENT_PROVIDERS)
  .optional();

const paymentDateSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""));

const paymentSortFieldSchema = z
  .enum(PAYMENT_SORT_FIELDS)
  .optional()
  .default("createdAt");

const paymentSortOrderSchema = z
  .enum(PAYMENT_SORT_ORDERS)
  .optional()
  .default("DESC");

/* =========================================================
   GET PAYMENTS SCHEMA
========================================================= */

export const getPaymentsSchema = z
  .object({
    page: z.coerce
      .number()
      .int("Page must be a whole number.")
      .min(1, "Page must be at least 1.")
      .default(1),

    limit: z.coerce
      .number()
      .int("Limit must be a whole number.")
      .min(1, "Limit must be at least 1.")
      .max(100, "Limit cannot exceed 100.")
      .default(10),

    search: paymentSearchSchema,

    status: paymentStatusSchema,
    method: paymentMethodSchema,
    provider: paymentProviderSchema,

    dateFrom: paymentDateSchema,
    dateTo: paymentDateSchema,

    sortBy: paymentSortFieldSchema,
    sortOrder: paymentSortOrderSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    const isValidDate = (value: string) => {
      if (!value) return true;

      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    };

    if (data.dateFrom && !isValidDate(data.dateFrom)) {
      ctx.addIssue({
        code: "custom",
        path: ["dateFrom"],
        message: "Please enter a valid start date.",
      });
    }

    if (data.dateTo && !isValidDate(data.dateTo)) {
      ctx.addIssue({
        code: "custom",
        path: ["dateTo"],
        message: "Please enter a valid end date.",
      });
    }

    if (
      data.dateFrom &&
      data.dateTo &&
      isValidDate(data.dateFrom) &&
      isValidDate(data.dateTo) &&
      new Date(data.dateFrom) > new Date(data.dateTo)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["dateTo"],
        message: "End date must be after or equal to start date.",
      });
    }
  });

/* =========================================================
   GET PAYMENT DETAILS SCHEMA
========================================================= */

export const getPaymentSchema = z
  .object({
    identifier: paymentIdentifierSchema,
  })
  .strict();

/* =========================================================
   REFUND AMOUNT
========================================================= */

const refundAmountSchema = z
  .number({
    error: "Please enter a valid refund amount.",
  })
  .finite()
  .positive("Refund amount must be greater than zero.")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(String(value)),
    "Refund amount can have a maximum of 2 decimal places."
  );

/* =========================================================
   REFUND PAYMENT SCHEMA
========================================================= */

export const refundPaymentSchema = z
  .object({
    amount: refundAmountSchema,

    reason: z.enum(REFUND_REASONS, {
      error: "Please select a valid refund reason.",
    }),
  })
  .strict();

/* =========================================================
   INFERRED FORM TYPES
========================================================= */

export type GetPaymentsFormValues = z.infer<
  typeof getPaymentsSchema
>;

export type GetPaymentFormValues = z.infer<
  typeof getPaymentSchema
>;

export type RefundPaymentFormValues = z.infer<
  typeof refundPaymentSchema
>;

/* =========================================================
   EXPORTED VALUE TYPES
========================================================= */

export type PaymentStatusValue =
  (typeof PAYMENT_STATUSES)[number];

export type PaymentMethodValue =
  (typeof PAYMENT_METHODS)[number];

export type PaymentProviderValue =
  (typeof PAYMENT_PROVIDERS)[number];

export type RefundReasonValue =
  (typeof REFUND_REASONS)[number];

export type PaymentSortFieldValue =
  (typeof PAYMENT_SORT_FIELDS)[number];

export type PaymentSortOrderValue =
  (typeof PAYMENT_SORT_ORDERS)[number];
