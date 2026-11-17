import {
  adminLoginApi,
  refreshAdminTokenApi,
  getCurrentAdminApi,
  adminLogoutApi,
} from "@/src/api/admin/auth.api";
import {
  adminLoginSchema,
  refreshTokenSchema,
} from "@/src/validations/admin/auth.validation";
import type {
  AdminLoginFormValues,
  RefreshTokenFormValues,
} from "@/src/validations/admin/auth.validation";
import type {
  AdminLoginApiResponse,
  RefreshTokenApiResponse,
  GetCurrentAdminApiResponse,
  AdminLogoutRequest,
} from "@/src/types/admin/auth.types";

export const adminLoginService = async (
  values: AdminLoginFormValues
): Promise<AdminLoginApiResponse> => {
  const payload = adminLoginSchema.parse(values);

  return await adminLoginApi(payload);
};

export const refreshAdminTokenService = async (
  values: RefreshTokenFormValues
): Promise<RefreshTokenApiResponse> => {
  const payload = refreshTokenSchema.parse(values);

  return await refreshAdminTokenApi(payload);
};

export const getCurrentAdminService =
  async (): Promise<GetCurrentAdminApiResponse> => {
    return await getCurrentAdminApi();
  };

export const adminLogoutService = async (
  payload: AdminLogoutRequest
): Promise<void> => {
  return await adminLogoutApi(payload);
};
