
import { z } from "zod";

/* ========================= Constants ========================= */

export const BOGO_COUPON_STATUSES = [
  "ACTIVE",
  "INACTIVE",
] as const;

/* ========================= Base Schemas ========================= */

const couponCodeSchema = z
  .string()
  .trim()
  .min(1, "Please enter a coupon code.")
  .min(2, "Coupon code must be at least 2 characters long.")
  .max(50, "Coupon code cannot exceed 50 characters.")
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "Coupon code can contain letters, numbers, hyphens, and underscores only."
  )
  .transform((value) => value.toUpperCase());

const couponNameSchema = z
  .string()
  .trim()
  .min(1, "Please enter a coupon name.")
  .min(2, "Coupon name must be at least 2 characters long.")
  .max(150, "Coupon name cannot exceed 150 characters.");

const couponDescriptionSchema = z
  .string()
  .trim()
  .max(5000, "Description cannot exceed 5000 characters.")
  .optional()
  .or(z.literal(""));

const positiveIntegerSchema = z
  .number({
    error: "Please enter a valid whole number.",
  })
  .int("Value must be a whole number.")
  .positive("Value must be greater than zero.")
  .max(2147483647, "Value is too large.");

const optionalNonNegativeAmountSchema = z
  .number({
    error: "Please enter a valid amount.",
  })
  .finite("Amount must be a valid number.")
  .min(0, "Amount cannot be negative.")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(String(value)),
    "Amount can have up to 2 decimal places."
  )
  .nullable()
  .optional();

const optionalPositiveIntegerSchema = positiveIntegerSchema
  .nullable()
  .optional();

const couponDateSchema = z
  .string()
  .trim()
  .min(1, "Please select a date and time.")
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Please enter a valid date and time."
  );

const couponStatusSchema = z.enum(BOGO_COUPON_STATUSES);

const sortOrderSchema = z
  .number({
    error: "Please enter a valid sort order.",
  })
  .int("Sort order must be a whole number.")
  .min(0, "Sort order cannot be negative.")
  .max(2147483647, "Sort order is too large.");

const productIdsSchema = z
  .array(
    z.union([
      z.number().int().positive(),
      z
        .string()
        .trim()
        .regex(
            /^[1-9]\d*$/,
            "Please select valid products."
          )
        .transform(Number),
    ])
  )
  .min(1, "Please select at least one product.")
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "Duplicate product selections are not allowed."
  );

/* ========================= Shared Coupon Fields ========================= */

const sharedCouponFields = {
  code: couponCodeSchema,
  name: couponNameSchema,
  description: couponDescriptionSchema,

  buyQuantity: positiveIntegerSchema,
  getQuantity: positiveIntegerSchema,

  minimumOrderValue: optionalNonNegativeAmountSchema,

  usageLimit: optionalPositiveIntegerSchema,
  perCustomerLimit: optionalPositiveIntegerSchema,

  startDate: couponDateSchema,
  endDate: couponDateSchema,

  status: couponStatusSchema,
  sortOrder: sortOrderSchema,
};

/* ========================= Create BOGO Coupon ========================= */

export const createBogoCouponSchema = z
  .object({
    ...sharedCouponFields,

    status: couponStatusSchema.default("ACTIVE"),
    sortOrder: sortOrderSchema.default(0),

    buyProductIds: productIdsSchema,
    getProductIds: productIdsSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (Date.parse(data.endDate) <= Date.parse(data.startDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be later than start date.",
      });
    }

    const overlappingProducts = data.buyProductIds.filter((id) =>
      data.getProductIds.includes(id)
    );

    if (overlappingProducts.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["getProductIds"],
        message:
          "The same product cannot be selected in both Buy Products and Get Products.",
      });
    }
  });

/* ========================= Update BOGO Coupon ========================= */

export const updateBogoCouponSchema = z
  .object({
    code: couponCodeSchema.optional(),
    name: couponNameSchema.optional(),
    description: couponDescriptionSchema,

    buyQuantity: positiveIntegerSchema.optional(),
    getQuantity: positiveIntegerSchema.optional(),

    minimumOrderValue: optionalNonNegativeAmountSchema,

    usageLimit: optionalPositiveIntegerSchema,
    perCustomerLimit: optionalPositiveIntegerSchema,

    startDate: couponDateSchema.optional(),
    endDate: couponDateSchema.optional(),

    status: couponStatusSchema.optional(),
    sortOrder: sortOrderSchema.optional(),

    buyProductIds: productIdsSchema.optional(),
    getProductIds: productIdsSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Please provide at least one field to update.",
    }
  )
  .superRefine((data, ctx) => {
    if (
      data.startDate !== undefined &&
      data.endDate !== undefined &&
      Date.parse(data.endDate) <= Date.parse(data.startDate)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be later than start date.",
      });
    }

    if (
      data.buyProductIds !== undefined &&
      data.getProductIds !== undefined
    ) {
      const overlappingProducts = data.buyProductIds.filter((id) =>
        data.getProductIds!.includes(id)
      );

      if (overlappingProducts.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["getProductIds"],
          message:
            "The same product cannot be selected in both Buy Products and Get Products.",
        });
      }
    }
  });

/* ========================= Update Coupon Status ========================= */

export const updateBogoCouponStatusSchema = z
  .object({
    status: couponStatusSchema,
  })
  .strict();

/* ========================= Inferred Types ========================= */

export type CreateBogoCouponFormValues = z.infer<
  typeof createBogoCouponSchema
>;

export type UpdateBogoCouponFormValues = z.infer<
  typeof updateBogoCouponSchema
>;

export type UpdateBogoCouponStatusFormValues = z.infer<
  typeof updateBogoCouponStatusSchema
>;

export type BogoCouponStatusValue =
  (typeof BOGO_COUPON_STATUSES)[number];
