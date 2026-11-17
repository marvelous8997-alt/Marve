import axiosInstance from "@/src/lib/axios";

import type {
  GetFavouritesResponse,
  AddFavouriteResponse,
  RemoveFavouriteResponse,
  CheckFavouriteResponse,
  AddFavouriteRequest,
} from "@/src/types/user/favourite.types";

/* =========================
   API Endpoints
========================= */

export const FAVOURITE_API = {
  BASE: "/user/favourites",

  GET_ALL: "/user/favourites",

  ADD: "/user/favourites",

  CHECK: (productId: number | string) =>
    `/user/favourites/${productId}`,

  REMOVE: (productId: number | string) =>
    `/user/favourites/${productId}`,
};

/* =========================
   Get User Favourites API
========================= */

// GET /user/favourites

export const getFavouritesApi =
  async (): Promise<GetFavouritesResponse> => {
    const response =
      await axiosInstance.get<GetFavouritesResponse>(
        FAVOURITE_API.GET_ALL
      );

    return response.data;
  };

/* =========================
   Add Product To Favourites API
========================= */

// POST /user/favourites
// Body: { productId: 1 }

export const addFavouriteApi = async (
  payload: AddFavouriteRequest
): Promise<AddFavouriteResponse> => {
  const response =
    await axiosInstance.post<AddFavouriteResponse>(
      FAVOURITE_API.ADD,
      payload
    );

  return response.data;
};

/* =========================
   Check Favourite Status API
========================= */

// GET /user/favourites/:productId

export const checkFavouriteApi = async (
  productId: number | string
): Promise<CheckFavouriteResponse> => {
  const response =
    await axiosInstance.get<CheckFavouriteResponse>(
      FAVOURITE_API.CHECK(productId)
    );

  return response.data;
};

/* =========================
   Remove Product From Favourites API
========================= */

// DELETE /user/favourites/:productId

export const removeFavouriteApi = async (
  productId: number | string
): Promise<RemoveFavouriteResponse> => {
  const response =
    await axiosInstance.delete<RemoveFavouriteResponse>(
      FAVOURITE_API.REMOVE(productId)
    );

  return response.data;
};