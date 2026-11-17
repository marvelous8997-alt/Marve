import { z } from "zod";

/* =====================================================
   CONSTANTS
===================================================== */

export const PRODUCT_VARIATION_STATUSES = [
  "ACTIVE",
  "INACTIVE",
] as const;

const MAX_ATTRIBUTE_KEYS = 50;
const MAX_ATTRIBUTE_KEY_LENGTH = 100;
const MAX_ATTRIBUTE_VALUE_LENGTH = 255;
const MAX_VARIATIONS_PER_REQUEST = 100;
const MAX_PRICE = 99999999.99;
const MAX_INTEGER = 4294967295;

/* =====================================================
   COMMON VALIDATION SCHEMAS
===================================================== */

// PRODUCT ID
const productVariationIdSchema = z
  .union([z.number(), z.string()])
  .refine(
    (value) => {
      if (typeof value === "number") {
        return Number.isSafeInteger(value) && value > 0;
      }

      return /^[1-9]\d*$/.test(value.trim());
    },
    "Please select a valid product."
  );

// VARIATION NAME
const variationNameSchema = z
  .string()
  .trim()
  .min(1, "Variation name is required.")
  .max(255, "Variation name cannot exceed 255 characters.");

// VARIATION SKU
const variationSkuSchema = z
  .string()
  .trim()
  .min(1, "Variation SKU is required.")
  .max(100, "SKU cannot exceed 100 characters.");

// VARIATION ATTRIBUTES
const variationAttributesSchema = z
  .record(
    z.string()
      .trim()
      .min(1, "Attribute name cannot be empty.")
      .max(
        MAX_ATTRIBUTE_KEY_LENGTH,
        "Attribute name cannot exceed 100 characters."
      ),
    z.union([
      z.string()
        .trim()
        .min(1, "Attribute value cannot be empty.")
        .max(
          MAX_ATTRIBUTE_VALUE_LENGTH,
          "Attribute value cannot exceed 255 characters."
        ),
      z.number().finite("Attribute value must be a valid number."),
      z.boolean(),
    ])
  )
  .refine(
    (attributes) =>
      Object.keys(attributes).length <= MAX_ATTRIBUTE_KEYS,
    "A maximum of 50 variation attributes is allowed."
  )
  .refine(
    (attributes) => {
      const normalizedKeys = Object.keys(attributes).map(
        (key) => key.trim().toLowerCase()
      );

      return new Set(normalizedKeys).size === normalizedKeys.length;
    },
    "Variation attribute names must be unique."
  );

// PRICE
const variationPriceSchema = z
  .number({
    error: "Please enter a valid variation price.",
  })
  .finite("Variation price must be a finite number.")
  .min(0, "Variation price cannot be negative.")
  .max(MAX_PRICE, "Variation price exceeds the maximum allowed amount.")
  .refine(
    (value) =>
      Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
    "Price can have a maximum of 2 decimal places."
  );

// COMPARE-AT PRICE
const variationCompareAtPriceSchema = z
  .number({
    error: "Please enter a valid comparison price.",
  })
  .finite("Comparison price must be a finite number.")
  .min(0, "Comparison price cannot be negative.")
  .max(
    MAX_PRICE,
    "Comparison price exceeds the maximum allowed amount."
  )
  .refine(
    (value) =>
      Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
    "Comparison price can have a maximum of 2 decimal places."
  )
  .nullable()
  .optional();

// STOCK
const variationStockSchema = z
  .number({
    error: "Please enter a valid stock quantity.",
  })
  .int("Stock must be a whole number.")
  .min(0, "Stock cannot be negative.")
  .max(MAX_INTEGER, "Stock exceeds the allowed limit.");

// SORT ORDER
const variationSortOrderSchema = z
  .number({
    error: "Please enter a valid sort order.",
  })
  .int("Sort order must be a whole number.")
  .min(0, "Sort order cannot be negative.")
  .max(MAX_INTEGER, "Sort order exceeds the allowed limit.");

// STATUS
const variationStatusSchema = z.enum(
  PRODUCT_VARIATION_STATUSES
);

/* =====================================================
   COMPARE-AT PRICE VALIDATION
===================================================== */

const validateCompareAtPrice = (
  data: {
    price?: number;
    compare_at_price?: number | null;
  },
  ctx: z.RefinementCtx
) => {
  if (
    data.price !== undefined &&
    data.compare_at_price != null &&
    data.compare_at_price < data.price
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["compare_at_price"],
      message:
        "Comparison price must be greater than or equal to the selling price.",
    });
  }
};

/* =====================================================
   CREATE PRODUCT VARIATION
===================================================== */

export const createProductVariationSchema = z
  .object({
    product_id: productVariationIdSchema,

    name: variationNameSchema,

    sku: variationSkuSchema,

    attributes: variationAttributesSchema.default({}),

    price: variationPriceSchema,

    compare_at_price: variationCompareAtPriceSchema,

    stock: variationStockSchema.default(0),

    status: variationStatusSchema.default("ACTIVE"),

    sort_order: variationSortOrderSchema.default(0),
  })
  .strict()
  .superRefine(validateCompareAtPrice);

/* =====================================================
   BULK CREATE VARIATION ITEM
===================================================== */

export const bulkProductVariationItemSchema = z
  .object({
    name: variationNameSchema,

    sku: variationSkuSchema,

    attributes: variationAttributesSchema.refine(
      (attributes) => Object.keys(attributes).length >= 1,
      "At least one variation attribute is required."
    ),

    price: variationPriceSchema,

    compare_at_price: variationCompareAtPriceSchema,

    stock: variationStockSchema.default(0),

    status: variationStatusSchema.default("ACTIVE"),

    sort_order: variationSortOrderSchema.default(0),
  })
  .strict()
  .superRefine(validateCompareAtPrice);

/* =====================================================
   BULK CREATE PRODUCT VARIATIONS
===================================================== */

export const bulkCreateProductVariationsSchema = z
  .object({
    product_id: productVariationIdSchema,

    variations: z
      .array(bulkProductVariationItemSchema)
      .min(1, "Add at least one product variation.")
      .max(
        MAX_VARIATIONS_PER_REQUEST,
        "A maximum of 100 variations can be created at once."
      )
      .refine(
        (variations) => {
          const skus = variations.map((variation) =>
            variation.sku.trim().toLowerCase()
          );

          return new Set(skus).size === skus.length;
        },
        "Each variation must have a unique SKU."
      ),
  })
  .strict();

/* =====================================================
   UPDATE PRODUCT VARIATION
===================================================== */

export const updateProductVariationSchema = z
  .object({
    name: variationNameSchema.optional(),

    sku: variationSkuSchema.optional(),

    attributes: variationAttributesSchema.optional(),

    price: variationPriceSchema.optional(),

    compare_at_price: variationCompareAtPriceSchema,

    stock: variationStockSchema.optional(),

    status: variationStatusSchema.optional(),

    sort_order: variationSortOrderSchema.optional(),
  })
  .strict()
  .refine(
    (data) =>
      Object.values(data).some((value) => value !== undefined),
    {
      message: "Please provide at least one field to update.",
    }
  )
  .superRefine(validateCompareAtPrice);

/* =====================================================
   UPDATE PRODUCT VARIATION STATUS
===================================================== */

export const updateProductVariationStatusSchema = z
  .object({
    status: variationStatusSchema,
  })
  .strict();

/* =====================================================
   INFERRED TYPES
===================================================== */

export type CreateProductVariationFormValues = z.infer<
  typeof createProductVariationSchema
>;

export type UpdateProductVariationFormValues = z.infer<
  typeof updateProductVariationSchema
>;

export type UpdateProductVariationStatusFormValues = z.infer<
  typeof updateProductVariationStatusSchema
>;

export type BulkProductVariationItemValues = z.infer<
  typeof bulkProductVariationItemSchema
>;

export type BulkCreateProductVariationsFormValues = z.infer<
  typeof bulkCreateProductVariationsSchema
>;

export type ProductVariationStatusValue =
  (typeof PRODUCT_VARIATION_STATUSES)[number];