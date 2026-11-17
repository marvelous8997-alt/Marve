
import axiosInstance from "@/src/lib/axios";

import type {
  GetSubcategoriesResponse,
  GetSubcategoryByIdResponse,
  GetSubcategoriesByCategoryIdResponse,
} from "@/src/types/user/subcategory.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  SUBCATEGORY: {
    GET_ALL: "/user/subcategories",
    GET_BY_ID: (id: number | string) =>
      `/user/subcategories/${id}`,
    GET_BY_CATEGORY_ID: (categoryId: number | string) =>
      `/user/subcategories/category/${categoryId}`,
  },
};

// Get All Active Subcategories API
export const getSubcategoriesApi =
  async (): Promise<GetSubcategoriesResponse> => {
    const response =
      await axiosInstance.get<GetSubcategoriesResponse>(
        API.SUBCATEGORY.GET_ALL
      );

    return response.data;
  };

// Get Active Subcategory By ID API
export const getSubcategoryByIdApi = async (
  id: number | string
): Promise<GetSubcategoryByIdResponse> => {
  const response =
    await axiosInstance.get<GetSubcategoryByIdResponse>(
      API.SUBCATEGORY.GET_BY_ID(id)
    );

  return response.data;
};

// Get Active Subcategories By Category ID API
export const getSubcategoriesByCategoryIdApi = async (
  categoryId: number | string
): Promise<GetSubcategoriesByCategoryIdResponse> => {
  const response =
    await axiosInstance.get<GetSubcategoriesByCategoryIdResponse>(
      API.SUBCATEGORY.GET_BY_CATEGORY_ID(categoryId)
    );

  return response.data;
};
