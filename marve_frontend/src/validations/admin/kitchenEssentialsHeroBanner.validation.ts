
import { z } from "zod";

/* =========================
   CONSTANTS
========================= */

export const KITCHEN_ESSENTIALS_HERO_BANNER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
] as const;

export const KITCHEN_ESSENTIALS_HERO_BANNER_TYPES = [
  "KITCHEN_ESSENTIALS_HERO",
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

const kitchenEssentialsHeroBannerImageSchema = z
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

const floatingBottomLabelSchema = z
  .string()
  .trim()
  .min(1, "Please enter the floating bottom label.")
  .max(
    255,
    "Floating bottom label cannot exceed 255 characters."
  );

const bottomLabelSchema = z
  .string()
  .trim()
  .min(1, "Please enter the bottom label.")
  .max(255, "Bottom label cannot exceed 255 characters.");

const kitchenEssentialsHeroBannerStatusSchema = z.enum(
  KITCHEN_ESSENTIALS_HERO_BANNER_STATUSES
);

/* =========================
   SAVE KITCHEN ESSENTIALS HERO BANNER
   Create or update the single banner
========================= */

export const saveKitchenEssentialsHeroBannerSchema = z
  .object({
    type: z
      .enum(KITCHEN_ESSENTIALS_HERO_BANNER_TYPES)
      .optional(),

    eyebrow: eyebrowSchema,
    heading: headingSchema,
    highlighted_heading: highlightedHeadingSchema,
    description: descriptionSchema,

    button_text: buttonTextSchema,
    button_link: buttonLinkSchema,

    floating_label: floatingLabelSchema,
    floating_title: floatingTitleSchema,
    floating_description: floatingDescriptionSchema,
    floating_bottom_label: floatingBottomLabelSchema,

    bottom_label: bottomLabelSchema,

    status: kitchenEssentialsHeroBannerStatusSchema.default("ACTIVE"),

    image: kitchenEssentialsHeroBannerImageSchema,
  })
  .strict();

/* =========================
   UPDATE BANNER STATUS
========================= */

export const updateKitchenEssentialsHeroBannerStatusSchema = z
  .object({
    status: kitchenEssentialsHeroBannerStatusSchema,
  })
  .strict();

/* =========================
   INFERRED TYPES
========================= */

export type SaveKitchenEssentialsHeroBannerFormValues = z.infer<
  typeof saveKitchenEssentialsHeroBannerSchema
>;

export type UpdateKitchenEssentialsHeroBannerStatusFormValues = z.infer<
  typeof updateKitchenEssentialsHeroBannerStatusSchema
>;

export type KitchenEssentialsHeroBannerStatusValue =
  (typeof KITCHEN_ESSENTIALS_HERO_BANNER_STATUSES)[number];

export type KitchenEssentialsHeroBannerTypeValue =
  (typeof KITCHEN_ESSENTIALS_HERO_BANNER_TYPES)[number];
