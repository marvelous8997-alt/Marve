export type AuthIdentifierType = "EMAIL" | "PHONE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface SendOtpRequest {
  identifier: string;
  offersOptIn?: boolean;
}

export interface SendOtpResponseData {
  identifier: string;
  type: AuthIdentifierType;
  expiresIn: number;
  message: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface AuthUser {
  id: number | string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  offersOptIn: boolean;
  status: UserStatus;
  lastLoginAt: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpResponseData {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type SendOtpApiResponse = ApiResponse<SendOtpResponseData>;
export type VerifyOtpApiResponse = ApiResponse<VerifyOtpResponseData>;