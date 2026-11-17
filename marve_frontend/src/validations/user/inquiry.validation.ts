
import { z } from "zod";

export const createInquirySchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long.")
    .max(100, "First name cannot exceed 100 characters."),

  lastName: z
    .string()
    .trim()
    .max(100, "Last name cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email address cannot exceed 255 characters.")
    .transform((value) => value.toLowerCase()),

phone: z
  .string()
  .trim()
  .max(30, "Phone number cannot exceed 30 characters.")
  .refine(
    (value) => {
      if (!value) return true;

      const normalizedPhone = value.replace(/[\s()-]/g, "");

      return /^\+?[0-9]+$/.test(normalizedPhone) &&
        normalizedPhone.replace(/\D/g, "").length >= 10 &&
        normalizedPhone.replace(/\D/g, "").length <= 15;
    },
    "Please enter a valid phone number."
  )
  .optional()
  .or(z.literal("")),

  subject: z
    .enum(["ORDER", "PRODUCT", "DELIVERY", "RETURN", "OTHER"], {
      message: "Please select a valid inquiry subject.",
    }),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long.")
    .max(5000, "Message cannot exceed 5000 characters."),
});

export type CreateInquiryFormValues = z.infer<
  typeof createInquirySchema
>;
