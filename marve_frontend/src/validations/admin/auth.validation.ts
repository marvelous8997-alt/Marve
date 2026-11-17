import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .email("Please enter a valid email address.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(1, "Please enter your password.")
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password cannot exceed 128 characters.");

export const adminLoginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z
      .string()
      .trim()
      .min(1, "Refresh token is required."),
  })
  .strict();

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
export type RefreshTokenFormValues = z.infer<typeof refreshTokenSchema>;