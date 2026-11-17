import {
  sendOtpApi,
  verifyOtpApi,
} from "@/src/api/user/auth.api";
import {
  sendOtpSchema,
  verifyOtpSchema,
} from "@/src/validations/user/auth.validation";
import type {
  SendOtpFormValues,
  VerifyOtpFormValues,
} from "@/src/validations/user/auth.validation";
import type {
  SendOtpApiResponse,
  VerifyOtpApiResponse,
} from "@/src/types/user/auth.types";

export const sendOtpService = async (
  values: SendOtpFormValues
): Promise<SendOtpApiResponse> => {
  const payload = sendOtpSchema.parse(values);
  return await sendOtpApi(payload);
};

export const verifyOtpService = async (
  values: VerifyOtpFormValues
): Promise<VerifyOtpApiResponse> => {
  const payload = verifyOtpSchema.parse(values);
  return await verifyOtpApi(payload);
};