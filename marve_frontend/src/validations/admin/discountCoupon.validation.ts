
import { z } from "zod";

/* ========================= Constants ========================= */

export const DISCOUNT_COUPON_STATUSES = [
  "ACTIVE",
  "INACTIVE",
] as const;

export const DISCOUNT_TYPES = [
  "PERCENTAGE",
  "FIXED",
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

const discountTypeSchema = z.enum(DISCOUNT_TYPES);

const discountValueSchema = z
  .number({
    error: "Please enter a valid discount value.",
  })
  .positive("Discount value must be greater than zero.")
  .refine(
    (value) => Number.isFinite(value) && /^\d+(\.\d{1,2})?$/.test(String(value)),
    "Discount value can have up to 2 decimal places."
  );

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

const optionalPositiveIntegerSchema = z
  .number({
    error: "Please enter a valid whole number.",
  })
  .int("Value must be a whole number.")
  .positive("Value must be greater than zero.")
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

const couponStatusSchema = z.enum(DISCOUNT_COUPON_STATUSES);

const sortOrderSchema = z
  .number()
  .int("Sort order must be a whole number.")
  .min(0, "Sort order cannot be negative.");

/* ========================= Create Coupon ========================= */

export const createDiscountCouponSchema = z
  .object({
    code: couponCodeSchema,
    name: couponNameSchema,
    description: couponDescriptionSchema,

    discountType: discountTypeSchema,
    discountValue: discountValueSchema,

    maximumDiscount: optionalNonNegativeAmountSchema,
    minimumOrderValue: optionalNonNegativeAmountSchema,

    usageLimit: optionalPositiveIntegerSchema,
    perCustomerLimit: optionalPositiveIntegerSchema,

    startDate: couponDateSchema,
    endDate: couponDateSchema,

    status: couponStatusSchema.default("ACTIVE"),
    sortOrder: sortOrderSchema.default(0),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.discountType === "PERCENTAGE" &&
      data.discountValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }

    if (
      data.discountType === "FIXED" &&
      data.maximumDiscount != null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maximumDiscount"],
        message: "Maximum discount is only applicable to percentage discounts.",
      });
    }

    if (
      Date.parse(data.endDate) <= Date.parse(data.startDate)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be later than start date.",
      });
    }
  });

/* ========================= Update Coupon ========================= */

export const updateDiscountCouponSchema = z
  .object({
    code: couponCodeSchema.optional(),
    name: couponNameSchema.optional(),
    description: couponDescriptionSchema,

    discountType: discountTypeSchema.optional(),
    discountValue: discountValueSchema.optional(),

    maximumDiscount: optionalNonNegativeAmountSchema,
    minimumOrderValue: optionalNonNegativeAmountSchema,

    usageLimit: optionalPositiveIntegerSchema,
    perCustomerLimit: optionalPositiveIntegerSchema,

    startDate: couponDateSchema.optional(),
    endDate: couponDateSchema.optional(),

    status: couponStatusSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
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
      data.discountType === "PERCENTAGE" &&
      data.discountValue !== undefined &&
      data.discountValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }

    if (
      data.discountType === "FIXED" &&
      data.maximumDiscount != null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maximumDiscount"],
        message: "Maximum discount is only applicable to percentage discounts.",
      });
    }

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
  });

/* ========================= Update Coupon Status ========================= */

export const updateDiscountCouponStatusSchema = z
  .object({
    status: couponStatusSchema,
  })
  .strict();

/* ========================= Inferred Types ========================= */

export type CreateDiscountCouponFormValues = z.infer<
  typeof createDiscountCouponSchema
>;

export type UpdateDiscountCouponFormValues = z.infer<
  typeof updateDiscountCouponSchema
>;

export type UpdateDiscountCouponStatusFormValues = z.infer<
  typeof updateDiscountCouponStatusSchema
>;

export type DiscountCouponStatusValue =
  (typeof DISCOUNT_COUPON_STATUSES)[number];

export type DiscountTypeValue = (typeof DISCOUNT_TYPES)[number];
