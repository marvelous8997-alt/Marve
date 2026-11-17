
import { z } from "zod";

/* =========================
   CONSTANTS
========================= */

export const HOME_COUPON_BANNER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
] as const;

export const HOME_COUPON_BANNER_TYPES = ["HOME_COUPON"] as const;

export const HOME_COUPON_DISCOUNT_TYPES = [
  "PERCENTAGE",
  "FIXED",
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

const homeCouponBannerImageSchema = z
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

const offerTextSchema = z
  .string()
  .trim()
  .min(1, "Please enter the offer text.")
  .max(255, "Offer text cannot exceed 255 characters.");

const discountValueSchema = z
  .number({
    error: "Please enter a valid discount value.",
  })
  .finite("Discount value must be a valid number.")
  .positive("Discount value must be greater than 0.");

const discountTypeSchema = z.enum(
  HOME_COUPON_DISCOUNT_TYPES,
  {
    error: "Please select a valid discount type.",
  }
);

const couponCodeSchema = z
  .string()
  .trim()
  .min(1, "Please enter the coupon code.")
  .max(100, "Coupon code cannot exceed 100 characters.")
  .transform((value) => value.toUpperCase());

const termsTextSchema = z
  .string()
  .trim()
  .min(1, "Please enter the terms and conditions.")
  .max(
    5000,
    "Terms and conditions cannot exceed 5000 characters."
  );

const homeCouponBannerStatusSchema = z.enum(
  HOME_COUPON_BANNER_STATUSES
);

/* =========================
   SAVE HOME COUPON BANNER
   Create or update the single banner
========================= */

export const saveHomeCouponBannerSchema = z
  .object({
    type: z
      .enum(HOME_COUPON_BANNER_TYPES)
      .optional(),

    eyebrow: eyebrowSchema,
    heading: headingSchema,
    highlighted_heading: highlightedHeadingSchema,
    description: descriptionSchema,

    button_text: buttonTextSchema,
    button_link: buttonLinkSchema,

    offer_text: offerTextSchema,
    discount_value: discountValueSchema,
    discount_type: discountTypeSchema,
    coupon_code: couponCodeSchema,
    terms_text: termsTextSchema,

    status: homeCouponBannerStatusSchema.default("ACTIVE"),

    image: homeCouponBannerImageSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.discount_type === "PERCENTAGE" &&
      data.discount_value > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discount_value"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }
  });

/* =========================
   UPDATE BANNER STATUS
========================= */

export const updateHomeCouponBannerStatusSchema = z
  .object({
    status: homeCouponBannerStatusSchema,
  })
  .strict();

/* =========================
   INFERRED TYPES
========================= */

export type SaveHomeCouponBannerFormValues = z.infer<
  typeof saveHomeCouponBannerSchema
>;

export type UpdateHomeCouponBannerStatusFormValues = z.infer<
  typeof updateHomeCouponBannerStatusSchema
>;

export type HomeCouponBannerStatusValue =
  (typeof HOME_COUPON_BANNER_STATUSES)[number];

export type HomeCouponBannerTypeValue =
  (typeof HOME_COUPON_BANNER_TYPES)[number];

export type HomeCouponDiscountTypeValue =
  (typeof HOME_COUPON_DISCOUNT_TYPES)[number];
