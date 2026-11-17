
import type { AuthUser, ApiResponse } from "./auth.types";

/* ========================= PROFILE TYPES ========================= */

// USER PROFILE
export interface UserProfile extends AuthUser {
  createdAt: string;
  updatedAt: string;
}

// UPDATE PROFILE REQUEST
export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  offersOptIn?: boolean;
}

// PROFILE API RESPONSE
export type UserProfileApiResponse = ApiResponse<UserProfile>;

// UPDATE PROFILE API RESPONSE
export type UpdateUserProfileApiResponse = ApiResponse<UserProfile>;
