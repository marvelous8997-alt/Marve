
import { z } from "zod";

/* =========================
   Return Reason
========================= */

export const returnReasonSchema = z.enum(
  [
    "SIZE_TOO_SMALL",
    "SIZE_TOO_LARGE",
    "PRODUCT_DAMAGED",
    "WRONG_PRODUCT",
    "PRODUCT_NOT_AS_DESCRIBED",
    "QUALITY_ISSUE",
    "OTHER",
  ],
  {
    message: "Please select a valid return reason.",
  }
);

/* =========================
   Return Request Status
========================= */

export const returnRequestStatusSchema = z.enum(
  [
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
  ],
  {
    message: "Please select a valid return request status.",
  }
);

/* =========================
   Return Item Fields
========================= */

export const createReturnItemSchema = z.object({
  orderItemUuid: z
    .string()
    .trim()
    .uuid("Please select a valid order item."),

  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .positive("Quantity must be greater than zero."),
});

/* =========================
   Create Return Request
========================= */

export const createReturnRequestSchema = z.object({
  orderUuid: z
    .string()
    .trim()
    .uuid("Please select a valid order."),

  reason: returnReasonSchema,

  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters.")
    .optional()
    .or(z.literal("")),

  items: z
    .array(createReturnItemSchema)
    .min(1, "Please select at least one product to return.")
    .refine(
      (items) =>
        new Set(items.map((item) => item.orderItemUuid)).size ===
        items.length,
      "A product cannot be selected more than once."
    ),
});

/* =========================
   Return Request UUID
========================= */

export const returnRequestUuidSchema = z.object({
  uuid: z
    .string()
    .trim()
    .uuid("Please provide a valid return request ID."),
});

/* =========================
   Return Order UUID
========================= */

export const returnOrderUuidSchema = z.object({
  orderUuid: z
    .string()
    .trim()
    .uuid("Please provide a valid order ID."),
});

/* =========================
   Return Request Query
========================= */

export const getReturnRequestsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer.")
    .positive("Page must be greater than zero.")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer.")
    .positive("Limit must be greater than zero.")
    .max(50, "Limit cannot exceed 50.")
    .default(10),

  status: returnRequestStatusSchema.optional(),
});

/* =========================
   Return Shipment ID
========================= */

export const returnShipmentIdSchema = z.object({
  id: z.coerce
    .number()
    .int("Return shipment ID must be an integer.")
    .positive("Return shipment ID must be greater than zero."),
});

/* =========================
   Return Shipment UUID
========================= */

export const returnShipmentUuidSchema = z.object({
  uuid: z
    .string()
    .trim()
    .uuid("Please provide a valid return shipment ID."),
});

/* =========================
   Return Tracking Number
========================= */

export const returnShipmentTrackingNumberSchema = z.object({
  trackingNumber: z
    .string()
    .trim()
    .min(1, "Tracking number is required.")
    .max(150, "Tracking number cannot exceed 150 characters."),
});

/* =========================
   Return Shipment Query
========================= */

export const getReturnShipmentsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(50)
    .default(10),
});

/* =========================
   Return Tracking History Query
========================= */

export const getReturnTrackingHistoryQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(50)
    .default(10),
});

/* =========================
   Form Value Types
========================= */

export type CreateReturnRequestFormValues = z.infer<
  typeof createReturnRequestSchema
>;

export type CreateReturnItemFormValues = z.infer<
  typeof createReturnItemSchema
>;

export type ReturnReasonValue = z.infer<
  typeof returnReasonSchema
>;

export type ReturnRequestStatusValue = z.infer<
  typeof returnRequestStatusSchema
>;

export type GetReturnRequestsQueryValues = z.infer<
  typeof getReturnRequestsQuerySchema
>;

export type GetReturnShipmentsQueryValues = z.infer<
  typeof getReturnShipmentsQuerySchema
>;

export type GetReturnTrackingHistoryQueryValues = z.infer<
  typeof getReturnTrackingHistoryQuerySchema
>;
