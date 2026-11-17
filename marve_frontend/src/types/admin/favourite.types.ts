
/* =========================
   Favourite Types
========================= */

export type FavouriteCategory =
  | "KITCHEN"
  | "DINING"
  | "STORAGE"
  | "HOME_DECOR"
  | "COFFEE_TEA"
  | "CLEANING";

/* =========================
   Favourite Interface
========================= */

export interface Favourite {
  id: number | string;
  uuid?: string;

  customerId?: number | string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;

  productId?: number | string | null;
  productName: string;
  productImage?: string | null;
  productSku: string;

  category: string;
  categorySlug?: string | null;

  price: number;

  createdAt?: string | null;
  updatedAt?: string | null;
}

/* =========================
   Get Favourites Params
========================= */

export interface GetFavouritesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: FavouriteCategory;
  sortBy?: "id" | "createdAt" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

/* =========================
   Pagination
========================= */

export interface FavouritePagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================
   Get Favourites Response Data
========================= */

export interface GetFavouritesResponseData
  extends FavouritePagination {
  rows: Favourite[];
}

/* =========================
   Generic API Response
========================= */

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   API Response Types
========================= */

export type GetFavouriteApiResponse =
  ApiResponse<Favourite>;

export type GetFavouritesApiResponse =
  ApiResponse<GetFavouritesResponseData>;
