
import axiosInstance from "@/src/lib/axios";

import type {
  GetFavouriteApiResponse,
  GetFavouritesApiResponse,
  GetFavouritesParams,
} from "@/src/types/admin/favourite.types";

// =========================
// API ENDPOINTS
// =========================

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  FAVOURITE: {
    LIST: "/admin/favourites/list",

    DETAILS: (identifier: string | number) =>
      `/admin/favourites/list/${identifier}`,
  },
};

// =========================
// GET FAVOURITES API
// =========================

export const getFavouritesApi = async (
  params: GetFavouritesParams = {}
): Promise<GetFavouritesApiResponse> => {
  const response =
    await axiosInstance.get<GetFavouritesApiResponse>(
      API.FAVOURITE.LIST,
      { params }
    );

  return response.data;
};

// =========================
// GET FAVOURITE DETAILS API
// =========================

export const getFavouriteApi = async (
  identifier: string | number
): Promise<GetFavouriteApiResponse> => {
  const response =
    await axiosInstance.get<GetFavouriteApiResponse>(
      API.FAVOURITE.DETAILS(identifier)
    );

  return response.data;
};
