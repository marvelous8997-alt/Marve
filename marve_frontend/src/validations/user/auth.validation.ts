import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.");

const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+?[1-9]\d{9,14}$/,
    "Please enter a valid phone number."
  );

const identifierSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email or phone number.")
  .refine(
    (value) =>
      emailSchema.safeParse(value).success ||
      phoneSchema.safeParse(value).success,
    {
      message: "Please enter a valid email address or phone number.",
    }
  );

export const sendOtpSchema = z.object({
  identifier: identifierSchema,
  offersOptIn: z.boolean().optional().default(false),
});

export const verifyOtpSchema = z.object({
  identifier: identifierSchema,
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d{6}$/, "OTP must contain only numbers."),
});

export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;