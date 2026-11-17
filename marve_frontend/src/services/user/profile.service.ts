
import {
  getUserProfileApi,
  updateUserProfileApi,
} from "@/src/api/user/profile.api";

import type {
  UserProfileApiResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileApiResponse,
} from "@/src/types/user/profile.types";

/* ========================= GET USER PROFILE SERVICE ========================= */

export const getUserProfileService =
  async (): Promise<UserProfileApiResponse> => {
    return await getUserProfileApi();
  };

/* ========================= UPDATE USER PROFILE SERVICE ========================= */

export const updateUserProfileService = async (
  payload: UpdateUserProfileRequest
): Promise<UpdateUserProfileApiResponse> => {
  return await updateUserProfileApi(payload);
};
