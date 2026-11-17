import axiosInstance from "@/src/lib/axios";
import type {
  AdminLoginRequest,
  AdminLoginApiResponse,
  RefreshTokenRequest,
  RefreshTokenApiResponse,
  GetCurrentAdminApiResponse,
} from "@/src/types/admin/auth.types";

// Admin Auth API Endpoints
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  AUTH: {
    LOGIN: "/admin/auth/login",
    REFRESH_TOKEN: "/admin/auth/refresh-token",
    ME: "/admin/auth/me",
    LOGOUT: "/admin/auth/logout",
  },
};

// Admin Login API
export const adminLoginApi = async (
  payload: AdminLoginRequest
): Promise<AdminLoginApiResponse> => {
  const response = await axiosInstance.post<AdminLoginApiResponse>(
    API.AUTH.LOGIN,
    payload
  );
  return response.data;
};

// Refresh Admin Token API
export const refreshAdminTokenApi = async (
  payload: RefreshTokenRequest
): Promise<RefreshTokenApiResponse> => {
  const response = await axiosInstance.post<RefreshTokenApiResponse>(
    API.AUTH.REFRESH_TOKEN,
    payload
  );
  return response.data;
};

// Get Current Admin API
export const getCurrentAdminApi =
  async (): Promise<GetCurrentAdminApiResponse> => {
    const response =
      await axiosInstance.get<GetCurrentAdminApiResponse>(
        API.AUTH.ME
      );
    return response.data;
  };

// Admin Logout API
export const adminLogoutApi = async (
  payload: RefreshTokenRequest
): Promise<void> => {
  await axiosInstance.post(
    API.AUTH.LOGOUT,
    payload
  );
};