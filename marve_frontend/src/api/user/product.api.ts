import axiosInstance from "@/src/lib/axios";

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
   API Endpoints
========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  PRODUCT: {
    GET_ALL: "/user/products",

    GET_BY_ID: (id: number | string) =>
      `/user/products/${id}`,

    GET_BY_SLUG: (slug: string) =>
      `/user/products/slug/${encodeURIComponent(slug)}`,

    GET_BY_CATEGORY_ID: (categoryId: number | string) =>
      `/user/products/category/${categoryId}`,

    GET_BY_SUBCATEGORY_ID: (subcategoryId: number | string) =>
      `/user/products/subcategory/${subcategoryId}`,

    GET_NEW_ARRIVALS: "/user/products/new-arrivals",

    GET_BEST_SELLERS: "/user/products/best-sellers",

    GET_FEATURED: "/user/products/featured",

    GET_SALE: "/user/products/sale",

    GET_OFFERS: "/user/products/offers",

    GET_GIFTS: "/user/products/gifts",
  },
};

/* =========================
   Get All Active Products API
========================= */

export const getProductsApi = async (
  params?: GetProductsParams
): Promise<GetProductsResponse> => {
  const response =
    await axiosInstance.get<GetProductsResponse>(
      API.PRODUCT.GET_ALL,
      { params }
    );

  return response.data;
};

/* =========================
   Get Active Product By ID API
========================= */

export const getProductByIdApi = async (
  id: number | string
): Promise<GetProductByIdResponse> => {
  const response =
    await axiosInstance.get<GetProductByIdResponse>(
      API.PRODUCT.GET_BY_ID(id)
    );

  return response.data;
};

/* =========================
   Get Active Product By Slug API
========================= */

export const getProductBySlugApi = async (
  slug: string
): Promise<GetProductBySlugResponse> => {
  const response =
    await axiosInstance.get<GetProductBySlugResponse>(
      API.PRODUCT.GET_BY_SLUG(slug)
    );

  return response.data;
};

/* =========================
   Get Products By Category ID API
========================= */

export const getProductsByCategoryIdApi = async (
  categoryId: number | string,
  params?: GetProductsParams
): Promise<GetProductsByCategoryIdResponse> => {
  const response =
    await axiosInstance.get<GetProductsByCategoryIdResponse>(
      API.PRODUCT.GET_BY_CATEGORY_ID(categoryId),
      {
        params,
      }
    );

  return response.data;
};

/* =========================
   Get Products By Subcategory ID API
========================= */

export const getProductsBySubcategoryIdApi = async (
  subcategoryId: number | string,
  params?: GetProductsParams
): Promise<GetProductsBySubcategoryIdResponse> => {
  const response =
    await axiosInstance.get<GetProductsBySubcategoryIdResponse>(
      API.PRODUCT.GET_BY_SUBCATEGORY_ID(subcategoryId),
      {
        params,
      }
    );

  return response.data;
};

/* =========================
   Get New Arrivals API
========================= */

export const getNewArrivalsApi = async (
  params?: GetProductsParams
): Promise<GetNewArrivalsResponse> => {
  const response =
    await axiosInstance.get<GetNewArrivalsResponse>(
      API.PRODUCT.GET_NEW_ARRIVALS,
      { params }
    );

  return response.data;
};

/* =========================
   Get Best Sellers API
========================= */

export const getBestSellersApi = async (
  params?: GetProductsParams
): Promise<GetBestSellersResponse> => {
  const response =
    await axiosInstance.get<GetBestSellersResponse>(
      API.PRODUCT.GET_BEST_SELLERS,
      { params }
    );

  return response.data;
};

/* =========================
   Get Featured Products API
========================= */

export const getFeaturedProductsApi = async (
  params?: GetProductsParams
): Promise<GetFeaturedProductsResponse> => {
  const response =
    await axiosInstance.get<GetFeaturedProductsResponse>(
      API.PRODUCT.GET_FEATURED,
      { params }
    );

  return response.data;
};

/* =========================
   Get Sale Products API
========================= */

export const getSaleProductsApi = async (
  params?: GetProductsParams
): Promise<GetSaleProductsResponse> => {
  const response =
    await axiosInstance.get<GetSaleProductsResponse>(
      API.PRODUCT.GET_SALE,
      { params }
    );

  return response.data;
};

/* =========================
   Get Offer Products API
========================= */

export const getOfferProductsApi = async (
  params?: GetProductsParams
): Promise<GetOfferProductsResponse> => {
  const response =
    await axiosInstance.get<GetOfferProductsResponse>(
      API.PRODUCT.GET_OFFERS,
      { params }
    );

  return response.data;
};

/* =========================
   Get Gift Products API
========================= */

export const getGiftProductsApi = async (
  params?: GetProductsParams
): Promise<GetGiftProductsResponse> => {
  const response =
    await axiosInstance.get<GetGiftProductsResponse>(
      API.PRODUCT.GET_GIFTS,
      { params }
    );

  return response.data;
};