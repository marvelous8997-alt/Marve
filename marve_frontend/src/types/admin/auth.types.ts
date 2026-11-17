export type AdminRole = "SUPER_ADMIN" | "ADMIN";
export type AdminStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AuthAdmin {
  id: number | string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt: string | null;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AdminLoginResponseData {
  admin: AuthAdmin;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AdminLogoutRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken?: string;
}

export type GetCurrentAdminResponseData = AuthAdmin;

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type AdminLoginApiResponse = ApiResponse<AdminLoginResponseData>;

export type RefreshTokenApiResponse = ApiResponse<RefreshTokenResponseData>;

export type GetCurrentAdminApiResponse = ApiResponse<GetCurrentAdminResponseData>;