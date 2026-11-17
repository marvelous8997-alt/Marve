/* =========================
   Imports
========================= */

import type { UserProductWithRelations } from "./product.types";

/* =========================
   Favourite Item
========================= */

export interface Favourite {
  id: number;
  uuid: string;

  user_id: number;
  product_id: number;

  createdAt: string;
  updatedAt: string;

  // Associated product details
  product: UserProductWithRelations | null;
}

/* =========================
   Get Favourites Data
========================= */

export interface GetFavouritesData {
  favourites: Favourite[];
}

/* =========================
   Add Favourite Request
========================= */

export interface AddFavouriteRequest {
  productId: number;
}

/* =========================
   Favourite Action Response Data
========================= */

export interface FavouriteActionData {
  id?: number;
  uuid?: string;

  productId?: number;
  product_id?: number;

  isFavourite?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   Check Favourite Response Data
========================= */

export interface CheckFavouriteData {
  productId: number;
  isFavourite: boolean;
}

/* =========================
   API Response
========================= */

export interface FavouriteApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Favourite API Response Types
========================= */

export type GetFavouritesResponse =
  FavouriteApiResponse<Favourite[]>;

export type AddFavouriteResponse =
  FavouriteApiResponse<FavouriteActionData>;

export type RemoveFavouriteResponse =
  FavouriteApiResponse<FavouriteActionData | null>;

export type CheckFavouriteResponse =
  FavouriteApiResponse<CheckFavouriteData>;