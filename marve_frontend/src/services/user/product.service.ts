import {
  getProductsApi,
  getProductByIdApi,
  getProductBySlugApi,
  getProductsByCategoryIdApi,
  getProductsBySubcategoryIdApi,
  getNewArrivalsApi,
  getBestSellersApi,
  getFeaturedProductsApi,
  getSaleProductsApi,
  getOfferProductsApi,
  getGiftProductsApi,
} from "@/src/api/user/product.api";

import type {
  GetProductsResponse,
  GetProductByIdResponse,
  GetProductBySlugResponse,
  GetProductsByCategoryIdResponse,
  GetProductsBySubcategoryIdResponse,
  GetNewArrivalsResponse,
  GetBestSellersResponse,
  GetFeaturedProductsResponse,
  GetSaleProductsResponse,
  GetOfferProductsResponse,
  GetGiftProductsResponse,
  GetProductsParams,
} from "@/src/types/user/product.types";

/* =========================
   Get All Active Products Service
========================= */

export const getProductsService = async (
  params?: GetProductsParams
): Promise<GetProductsResponse> => {
  return await getProductsApi(params);
};

/* =========================
   Get Active Product By ID Service
========================= */

export const getProductByIdService = async (
  id: number | string
): Promise<GetProductByIdResponse> => {
  return await getProductByIdApi(id);
};

/* =========================
   Get Active Product By Slug Service
========================= */

export const getProductBySlugService = async (
  slug: string
): Promise<GetProductBySlugResponse> => {
  return await getProductBySlugApi(slug);
};

/* =========================
   Get Products By Category ID Service
========================= */

export const getProductsByCategoryIdService = async (
  categoryId: number | string,
  params?: GetProductsParams
): Promise<GetProductsByCategoryIdResponse> => {
  return await getProductsByCategoryIdApi(categoryId, params);
};

/* =========================
   Get Products By Subcategory ID Service
========================= */

export const getProductsBySubcategoryIdService = async (
  subcategoryId: number | string,
  params?: GetProductsParams
): Promise<GetProductsBySubcategoryIdResponse> => {
  return await getProductsBySubcategoryIdApi(subcategoryId, params);
};

/* =========================
   Get New Arrivals Service
========================= */

export const getNewArrivalsService = async (
  params?: GetProductsParams
): Promise<GetNewArrivalsResponse> => {
  return await getNewArrivalsApi(params);
};

/* =========================
   Get Best Sellers Service
========================= */

export const getBestSellersService = async (
  params?: GetProductsParams
): Promise<GetBestSellersResponse> => {
  return await getBestSellersApi(params);
};

/* =========================
   Get Featured Products Service
========================= */

export const getFeaturedProductsService = async (
  params?: GetProductsParams
): Promise<GetFeaturedProductsResponse> => {
  return await getFeaturedProductsApi(params);
};

/* =========================
   Get Sale Products Service
========================= */

export const getSaleProductsService = async (
  params?: GetProductsParams
): Promise<GetSaleProductsResponse> => {
  return await getSaleProductsApi(params);
};

/* =========================
   Get Offer Products Service
========================= */

export const getOfferProductsService = async (
  params?: GetProductsParams
): Promise<GetOfferProductsResponse> => {
  return await getOfferProductsApi(params);
};

/* =========================
   Get Gift Products Service
========================= */

export const getGiftProductsService = async (
  params?: GetProductsParams
): Promise<GetGiftProductsResponse> => {
  return await getGiftProductsApi(params);
};