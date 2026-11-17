
import axiosInstance from "@/src/lib/axios";

import type {
  UserProfileApiResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileApiResponse,
} from "@/src/types/user/profile.types";

/* ========================= API CONFIG ========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  PROFILE: {
    GET_PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
  },
};

/* ========================= GET USER PROFILE API ========================= */

export const getUserProfileApi = async (): Promise<UserProfileApiResponse> => {
  const response = await axiosInstance.get<UserProfileApiResponse>(
    API.PROFILE.GET_PROFILE
  );

  return response.data;
};

/* ========================= UPDATE USER PROFILE API ========================= */

export const updateUserProfileApi = async (
  payload: UpdateUserProfileRequest
): Promise<UpdateUserProfileApiResponse> => {
  const response = await axiosInstance.put<UpdateUserProfileApiResponse>(
    API.PROFILE.UPDATE_PROFILE,
    payload
  );

  return response.data;
};
