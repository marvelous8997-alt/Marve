
import { z } from "zod";

/* =========================================================
   RETURN REQUEST STATUS & REASON
========================================================= */

export const RETURN_REQUEST_STATUSES = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "RECEIVED",
  "INSPECTING",
  "REFUND_APPROVED",
  "REFUND_INITIATED",
  "REFUNDED",
  "CANCELLED",
] as const;

export const RETURN_REASONS = [
  "SIZE_TOO_SMALL",
  "SIZE_TOO_LARGE",
  "PRODUCT_DAMAGED",
  "WRONG_PRODUCT",
  "PRODUCT_NOT_AS_DESCRIBED",
  "QUALITY_ISSUE",
  "OTHER",
] as const;

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_ADMIN_NOTE_LENGTH = 1000;
const MAX_REJECTION_REASON_LENGTH = 1000;

/* =========================================================
   ADMIN NOTE
========================================================= */

const adminNoteSchema = z
  .string()
  .trim()
  .max(
    MAX_ADMIN_NOTE_LENGTH,
    `Admin note cannot exceed ${MAX_ADMIN_NOTE_LENGTH} characters.`
  )
  .nullable()
  .optional();

/* =========================================================
   REJECTION REASON
========================================================= */

const rejectionReasonSchema = z
  .string()
  .trim()
  .min(3, "Rejection reason must contain at least 3 characters.")
  .max(
    MAX_REJECTION_REASON_LENGTH,
    `Rejection reason cannot exceed ${MAX_REJECTION_REASON_LENGTH} characters.`
  );

/* =========================================================
   RETURN REQUEST UUID
========================================================= */

const returnRequestIdentifierSchema = z
  .string()
  .trim()
  .uuid("Please provide a valid return request UUID.");

/* =========================================================
   RETURN REQUEST STATUS
========================================================= */

const returnRequestStatusSchema = z.enum(
  RETURN_REQUEST_STATUSES,
  {
    error: "Please select a valid return request status.",
  }
);

/* =========================================================
   RETURN REASON
========================================================= */

const returnReasonSchema = z.enum(
  RETURN_REASONS,
  {
    error: "Please select a valid return reason.",
  }
);

/* =========================================================
   APPROVE RETURN REQUEST SCHEMA
========================================================= */

export const approveReturnRequestSchema = z
  .object({
    adminNote: adminNoteSchema,
  })
  .strict();

/* =========================================================
   REJECT RETURN REQUEST SCHEMA
========================================================= */

export const rejectReturnRequestSchema = z
  .object({
    rejectionReason: rejectionReasonSchema,

    adminNote: adminNoteSchema,
  })
  .strict();

/* =========================================================
   RETURN REQUEST FILTER SCHEMA
========================================================= */

export const returnRequestFilterSchema = z
  .object({
    search: z.string().trim().max(255).optional(),

    returnNumber: z.string().trim().max(100).optional(),

    orderNumber: z.string().trim().max(100).optional(),

    customer: z.string().trim().max(255).optional(),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .or(z.literal(""))
      .optional(),

    phone: z.string().trim().max(30).optional(),

    status: returnRequestStatusSchema.optional(),

    reason: returnReasonSchema.optional(),

    dateFrom: z.string().optional(),

    dateTo: z.string().optional(),

    sortBy: z.string().optional(),

    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  })
  .strict();

/* =========================================================
   OTHER SCHEMAS AND TYPES
========================================================= */

export type ApproveReturnRequestFormValues = z.infer<
  typeof approveReturnRequestSchema
>;

export type RejectReturnRequestFormValues = z.infer<
  typeof rejectReturnRequestSchema
>;

export type ReturnRequestFilterValues = z.infer<
  typeof returnRequestFilterSchema
>;

export type ReturnRequestStatusValue =
  (typeof RETURN_REQUEST_STATUSES)[number];

export type ReturnReasonValue =
  (typeof RETURN_REASONS)[number];

export type ReturnRequestIdentifierValue = z.infer<
  typeof returnRequestIdentifierSchema
>;
