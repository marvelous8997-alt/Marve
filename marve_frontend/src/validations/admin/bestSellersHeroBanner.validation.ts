
import { z } from "zod";

/* =========================
   CONSTANTS
========================= */

export const BEST_SELLERS_HERO_BANNER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
] as const;

export const BEST_SELLERS_HERO_BANNER_TYPES = [
  "BEST_SELLERS_HERO",
] as const;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/* =========================
   IMAGE VALIDATION
========================= */

const bestSellersHeroBannerImageSchema = z
  .instanceof(File, {
    message: "Please select a valid banner image.",
  })
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    "Banner image size must be 10 MB or less."
  )
  .refine(
    (file) =>
      ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
      ),
    "Banner image must be JPG, PNG, or WebP."
  )
  .nullable()
  .optional();

/* =========================
   TEXT FIELD VALIDATIONS
========================= */

const eyebrowSchema = z
  .string()
  .trim()
  .min(1, "Please enter the eyebrow text.")
  .max(255, "Eyebrow text cannot exceed 255 characters.");

const headingSchema = z
  .string()
  .trim()
  .min(1, "Please enter the banner heading.")
  .max(255, "Heading cannot exceed 255 characters.");

const highlightedHeadingSchema = z
  .string()
  .trim()
  .min(1, "Please enter the highlighted heading.")
  .max(
    255,
    "Highlighted heading cannot exceed 255 characters."
  );

const descriptionSchema = z
  .string()
  .trim()
  .min(1, "Please enter the banner description.")
  .max(5000, "Description cannot exceed 5000 characters.");

const ratingTextSchema = z
  .string()
  .trim()
  .min(1, "Please enter the rating text.")
  .max(255, "Rating text cannot exceed 255 characters.");

const buttonTextSchema = z
  .string()
  .trim()
  .min(1, "Please enter the button text.")
  .max(100, "Button text cannot exceed 100 characters.");

const buttonLinkSchema = z
  .string()
  .trim()
  .min(1, "Please enter the button link.")
  .max(2048, "Button link cannot exceed 2048 characters.");

const floatingLabelSchema = z
  .string()
  .trim()
  .min(1, "Please enter the floating label.")
  .max(255, "Floating label cannot exceed 255 characters.");

const floatingTitleSchema = z
  .string()
  .trim()
  .min(1, "Please enter the floating title.")
  .max(255, "Floating title cannot exceed 255 characters.");

const floatingDescriptionSchema = z
  .string()
  .trim()
  .min(1, "Please enter the floating description.")
  .max(
    5000,
    "Floating description cannot exceed 5000 characters."
  );

const bottomLabelSchema = z
  .string()
  .trim()
  .min(1, "Please enter the bottom label.")
  .max(255, "Bottom label cannot exceed 255 characters.");

const bestSellersHeroBannerStatusSchema = z.enum(
  BEST_SELLERS_HERO_BANNER_STATUSES
);

/* =========================
   SAVE BEST SELLERS HERO BANNER
   Create or update the single banner
========================= */

export const saveBestSellersHeroBannerSchema = z
  .object({
    type: z
      .enum(BEST_SELLERS_HERO_BANNER_TYPES)
      .optional(),

    eyebrow: eyebrowSchema,
    heading: headingSchema,
    highlighted_heading: highlightedHeadingSchema,
    description: descriptionSchema,

    rating_text: ratingTextSchema,

    button_text: buttonTextSchema,
    button_link: buttonLinkSchema,

    floating_label: floatingLabelSchema,
    floating_title: floatingTitleSchema,
    floating_description: floatingDescriptionSchema,

    bottom_label: bottomLabelSchema,

    status: bestSellersHeroBannerStatusSchema.default("ACTIVE"),

    image: bestSellersHeroBannerImageSchema,
  })
  .strict();

/* =========================
   UPDATE BANNER STATUS
========================= */

export const updateBestSellersHeroBannerStatusSchema = z
  .object({
    status: bestSellersHeroBannerStatusSchema,
  })
  .strict();

/* =========================
   INFERRED TYPES
========================= */

export type SaveBestSellersHeroBannerFormValues = z.infer<
  typeof saveBestSellersHeroBannerSchema
>;

export type UpdateBestSellersHeroBannerStatusFormValues = z.infer<
  typeof updateBestSellersHeroBannerStatusSchema
>;

export type BestSellersHeroBannerStatusValue =
  (typeof BEST_SELLERS_HERO_BANNER_STATUSES)[number];

export type BestSellersHeroBannerTypeValue =
  (typeof BEST_SELLERS_HERO_BANNER_TYPES)[number];
