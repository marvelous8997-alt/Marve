
import {
  getFavouritesApi,
  getFavouriteApi,
} from "@/src/api/admin/favourite.api";

import type {
  GetFavouriteApiResponse,
  GetFavouritesApiResponse,
  GetFavouritesParams,
} from "@/src/types/admin/favourite.types";

// =========================
// GET FAVOURITES
// =========================

export const getFavouritesService = async (
  params: GetFavouritesParams = {}
): Promise<GetFavouritesApiResponse> => {
  return await getFavouritesApi(params);
};

// =========================
// GET FAVOURITE DETAILS
// =========================

export const getFavouriteDetailsService = async (
  identifier: string | number
): Promise<GetFavouriteApiResponse> => {
  return await getFavouriteApi(identifier);
};
