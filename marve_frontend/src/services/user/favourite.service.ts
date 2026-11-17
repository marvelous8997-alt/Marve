import {
  getFavouritesApi,
  addFavouriteApi,
  checkFavouriteApi,
  removeFavouriteApi,
} from "@/src/api/user/favourite.api";

import type {
  GetFavouritesResponse,
  AddFavouriteResponse,
  RemoveFavouriteResponse,
  CheckFavouriteResponse,
  AddFavouriteRequest,
} from "@/src/types/user/favourite.types";

/* =========================
   Get User Favourites Service
========================= */

export const getFavouritesService =
  async (): Promise<GetFavouritesResponse> => {
    return await getFavouritesApi();
  };

/* =========================
   Add Product To Favourites Service
========================= */

export const addFavouriteService = async (
  payload: AddFavouriteRequest
): Promise<AddFavouriteResponse> => {
  return await addFavouriteApi(payload);
};

/* =========================
   Check Favourite Status Service
========================= */

export const checkFavouriteService = async (
  productId: number | string
): Promise<CheckFavouriteResponse> => {
  return await checkFavouriteApi(productId);
};

/* =========================
   Remove Product From Favourites Service
========================= */

export const removeFavouriteService = async (
  productId: number | string
): Promise<RemoveFavouriteResponse> => {
  return await removeFavouriteApi(productId);
};