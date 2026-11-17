import { z } from "zod";

/* =========================
   Address Type
========================= */

export const checkoutAddressTypeSchema = z.enum(
  ["HOME", "FRIENDS", "WORK", "OTHER"],
  {
    message: "Please select a valid address type.",
  }
);

/* =========================
   Common Address Fields
========================= */

const checkoutAddressFields = {
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters long.")
    .max(150, "Full name cannot exceed 150 characters."),

phone: z
  .string()
  .trim()
  .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(191, "Email address cannot exceed 191 characters.")
    .transform((value) => value.toLowerCase())
    .optional()
    .or(z.literal("")),

  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Pincode must contain exactly 6 digits."),

  houseNumber: z
    .string()
    .trim()
    .min(1, "House number is required.")
    .max(150, "House number cannot exceed 150 characters."),

  address: z
    .string()
    .trim()
    .min(1, "Address is required.")
    .max(255, "Address cannot exceed 255 characters."),

  locality: z
    .string()
    .trim()
    .min(1, "Locality is required.")
    .max(150, "Locality cannot exceed 150 characters."),

  landmark: z
    .string()
    .trim()
    .max(150, "Landmark cannot exceed 150 characters.")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(100, "City cannot exceed 100 characters."),

  state: z
    .string()
    .trim()
    .min(1, "State is required.")
    .max(100, "State cannot exceed 100 characters."),

  addressType: checkoutAddressTypeSchema,

  isDefault: z.boolean().default(false),

  latitude: z
    .number()
    .min(-90, "Latitude cannot be less than -90.")
    .max(90, "Latitude cannot exceed 90.")
    .nullable()
    .optional(),

  longitude: z
    .number()
    .min(-180, "Longitude cannot be less than -180.")
    .max(180, "Longitude cannot exceed 180.")
    .nullable()
    .optional(),
};

/* =========================
   Create Checkout Address
========================= */

export const createCheckoutAddressSchema = z.object({
  ...checkoutAddressFields,
});

/* =========================
   Update Checkout Address
========================= */

export const updateCheckoutAddressSchema = z
  .object({
    fullName: checkoutAddressFields.fullName.optional(),
    phone: checkoutAddressFields.phone.optional(),
    email: checkoutAddressFields.email,

    pincode: checkoutAddressFields.pincode.optional(),
    houseNumber: checkoutAddressFields.houseNumber.optional(),
    address: checkoutAddressFields.address.optional(),
    locality: checkoutAddressFields.locality.optional(),
    landmark: checkoutAddressFields.landmark,

    city: checkoutAddressFields.city.optional(),
    state: checkoutAddressFields.state.optional(),

    addressType: checkoutAddressTypeSchema.optional(),
    isDefault: z.boolean().optional(),

    latitude: checkoutAddressFields.latitude,
    longitude: checkoutAddressFields.longitude,
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Please provide at least one field to update."
  );

/* =========================
   Checkout Address ID
========================= */

export const checkoutAddressIdSchema = z.object({
  id: z.coerce
    .number()
    .int("Address ID must be an integer.")
    .positive("Address ID must be greater than zero."),
});

/* =========================
   Form Value Types
========================= */

export type CreateCheckoutAddressFormValues = z.infer<
  typeof createCheckoutAddressSchema
>;

export type UpdateCheckoutAddressFormValues = z.infer<
  typeof updateCheckoutAddressSchema
>;

export type CheckoutAddressTypeValue = z.infer<
  typeof checkoutAddressTypeSchema
>;