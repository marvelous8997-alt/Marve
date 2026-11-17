import axiosInstance from "@/src/lib/axios";
import type {
  SendOtpRequest,
  SendOtpApiResponse,
  VerifyOtpRequest,
  VerifyOtpApiResponse,
} from "@/src/types/user/auth.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  AUTH: {
    SEND_OTP: "/user/auth/send-otp",
    VERIFY_OTP: "/user/auth/verify-otp",
  },
};

// Send OTP API
export const sendOtpApi = async (
  payload: SendOtpRequest
): Promise<SendOtpApiResponse> => {
  const response = await axiosInstance.post<SendOtpApiResponse>(
    API.AUTH.SEND_OTP,
    payload
  );
  return response.data;
};

// Verify OTP API
export const verifyOtpApi = async (
  payload: VerifyOtpRequest
): Promise<VerifyOtpApiResponse> => {
  const response = await axiosInstance.post<VerifyOtpApiResponse>(
    API.AUTH.VERIFY_OTP,
    payload
  );
  return response.data;
};