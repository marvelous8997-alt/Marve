import { z } from "zod";

export const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const PRODUCT_DIMENSION_UNITS = [
  "mm",
  "cm",
  "m",
  "in",
  "ft",
] as const;

export const PRODUCT_WEIGHT_UNITS = [
  "g",
  "kg",
  "mg",
  "lb",
  "oz",
] as const;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const MAX_IMAGES = 10;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

const productIdSchema = z
  .union([z.number(), z.string()])
  .refine(
    (value) => {
      if (typeof value === "number") {
        return Number.isInteger(value) && value > 0;
      }

      const id = value.trim();
      return /^[1-9]\d*$/.test(id);
    },
    "Please select a valid category or subcategory."
  );

const productNameSchema = z
  .string()
  .trim()
  .min(1, "Please enter a product name.")
  .min(2, "Product name must be at least 2 characters long.")
  .max(255, "Product name cannot exceed 255 characters.");

const productSlugSchema = z
  .string()
  .trim()
  .min(1, "Please enter a product slug.")
  .min(2, "Product slug must be at least 2 characters long.")
  .max(255, "Product slug cannot exceed 255 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers, and single hyphens only."
  );

const productShortDescriptionSchema = z
  .string()
  .trim()
  .max(1000, "Short description cannot exceed 1000 characters.")
  .optional()
  .or(z.literal(""));

const productDescriptionSchema = z
  .string()
  .trim()
  .max(5000, "Description cannot exceed 5000 characters.")
  .optional()
  .or(z.literal(""));

const productSkuSchema = z
  .string()
  .trim()
  .max(100, "SKU cannot exceed 100 characters.")
  .optional()
  .or(z.literal(""));

const productPriceSchema = z
  .number({
    error: "Please enter a valid product price.",
  })
  .finite()
  .min(0, "Price cannot be negative.")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(String(value)),
    "Price can have a maximum of 2 decimal places."
  );

const productCompareAtPriceSchema = z
  .number({
    error: "Please enter a valid comparison price.",
  })
  .finite()
  .min(0, "Comparison price cannot be negative.")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(String(value)),
    "Comparison price can have a maximum of 2 decimal places."
  )
  .nullable()
  .optional();

const productStockSchema = z
  .number({
    error: "Please enter a valid stock quantity.",
  })
  .int("Stock must be a whole number.")
  .min(0, "Stock cannot be negative.");

const productSortOrderSchema = z
  .number({
    error: "Please enter a valid sort order.",
  })
  .int("Sort order must be a whole number.")
  .min(0, "Sort order cannot be negative.");

/* =========================
   Dimensions and Weight
========================= */

// Allows an empty field, null, or a non-negative number.
// Supports up to 2 decimal places for dimensions.
const productDimensionSchema = z
  .union([
    z
      .number({
        error: "Please enter a valid dimension.",
      })
      .finite()
      .min(0, "Dimension cannot be negative.")
      .refine(
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value)),
        "Dimension can have a maximum of 2 decimal places."
      ),
    z.literal(""),
    z.null(),
  ])
  .optional();

// Supports up to 3 decimal places for weight.
const productWeightSchema = z
  .union([
    z
      .number({
        error: "Please enter a valid weight.",
      })
      .finite()
      .min(0, "Weight cannot be negative.")
      .refine(
        (value) => /^\d+(\.\d{1,3})?$/.test(String(value)),
        "Weight can have a maximum of 3 decimal places."
      ),
    z.literal(""),
    z.null(),
  ])
  .optional();

const productDimensionUnitSchema = z
  .enum(PRODUCT_DIMENSION_UNITS, {
    error: "Please select a valid dimension unit.",
  })
  .optional()
  .default("cm");

const productWeightUnitSchema = z
  .enum(PRODUCT_WEIGHT_UNITS, {
    error: "Please select a valid weight unit.",
  })
  .optional()
  .default("kg");

const productStatusSchema = z.enum(PRODUCT_STATUSES);

const productBooleanSchema = z.boolean();

const productImageFileSchema = z
  .instanceof(File, {
    message: "Please select a valid image file.",
  })
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    "Each image must be 10 MB or less."
  )
  .refine(
    (file) =>
      ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
      ),
    "Only JPG, PNG and WEBP images are allowed."
  );

const productImagesSchema = z
  .array(productImageFileSchema)
  .max(MAX_IMAGES, "You can upload a maximum of 10 product images.")
  .optional()
  .default([]);

const productVideoSchema = z
  .instanceof(File, {
    message: "Please select a valid video file.",
  })
  .refine(
    (file) => file.size <= MAX_VIDEO_SIZE,
    "Product video must be 50 MB or less."
  )
  .refine(
    (file) =>
      ALLOWED_VIDEO_TYPES.includes(
        file.type as (typeof ALLOWED_VIDEO_TYPES)[number]
      ),
    "Only MP4, WEBM and MOV videos are allowed."
  )
  .nullable()
  .optional();

/* =========================
   Create Product Schema
========================= */

export const createProductSchema = z
  .object({
    category_id: productIdSchema,
    subcategory_id: productIdSchema,
    name: productNameSchema,
    slug: productSlugSchema,
    short_description: productShortDescriptionSchema,
    description: productDescriptionSchema,
    sku: productSkuSchema,
    price: productPriceSchema,
    compare_at_price: productCompareAtPriceSchema,
    stock: productStockSchema.default(0),

    // Product dimensions and weight
    height: productDimensionSchema,
    width: productDimensionSchema,
    length: productDimensionSchema,
    weight: productWeightSchema,
    dimension_unit: productDimensionUnitSchema,
    weight_unit: productWeightUnitSchema,

    status: productStatusSchema.default("ACTIVE"),
    featured: productBooleanSchema.default(false),
    is_new_arrival: productBooleanSchema.default(false),
    is_bestseller: productBooleanSchema.default(false),
    is_sale: productBooleanSchema.default(false),
    is_offer: productBooleanSchema.default(false),
    is_gift: productBooleanSchema.default(false),
    sort_order: productSortOrderSchema.default(0),
    images: productImagesSchema,
    video: productVideoSchema,
    image_manifest: z.string().optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.compare_at_price == null ||
      data.compare_at_price >= data.price,
    {
      message:
        "Comparison price must be greater than or equal to the selling price.",
      path: ["compare_at_price"],
    }
  );

/* =========================
   Update Product Schema
========================= */

export const updateProductSchema = z
  .object({
    category_id: productIdSchema.optional(),
    subcategory_id: productIdSchema.optional(),
    name: productNameSchema.optional(),
    slug: productSlugSchema.optional(),
    short_description: productShortDescriptionSchema,
    description: productDescriptionSchema,
    sku: productSkuSchema,
    price: productPriceSchema.optional(),
    compare_at_price: productCompareAtPriceSchema,
    stock: productStockSchema.optional(),

    // Product dimensions and weight
    height: productDimensionSchema,
    width: productDimensionSchema,
    length: productDimensionSchema,
    weight: productWeightSchema,
    dimension_unit: productDimensionUnitSchema,
    weight_unit: productWeightUnitSchema,

    status: productStatusSchema.optional(),
    featured: productBooleanSchema.optional(),
    is_new_arrival: productBooleanSchema.optional(),
    is_bestseller: productBooleanSchema.optional(),
    is_sale: productBooleanSchema.optional(),
    is_offer: productBooleanSchema.optional(),
    is_gift: productBooleanSchema.optional(),
    sort_order: productSortOrderSchema.optional(),
    images: productImagesSchema,
    video: productVideoSchema,
    image_manifest: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Please provide at least one field to update.",
    }
  )
  .refine(
    (data) =>
      data.price === undefined ||
      data.compare_at_price == null ||
      data.compare_at_price >= data.price,
    {
      message:
        "Comparison price must be greater than or equal to the selling price.",
      path: ["compare_at_price"],
    }
  );

/* =========================
   Other Schemas and Types
========================= */

export const updateProductStatusSchema = z
  .object({
    status: productStatusSchema,
  })
  .strict();

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
export type UpdateProductStatusFormValues = z.infer<
  typeof updateProductStatusSchema
>;

export type ProductStatusValue = (typeof PRODUCT_STATUSES)[number];

export type ProductDimensionUnitValue =
  (typeof PRODUCT_DIMENSION_UNITS)[number];

export type ProductWeightUnitValue =
  (typeof PRODUCT_WEIGHT_UNITS)[number];