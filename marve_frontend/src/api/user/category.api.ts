import axiosInstance from "@/src/lib/axios";

import type {
  GetCategoriesResponse,
  GetCategoryByIdResponse,
} from "@/src/types/user/category.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  CATEGORY: {
    GET_ALL: "/user/categories",
    GET_BY_ID: (id: number | string) => `/user/categories/${id}`,
  },
};

// Get All Active Categories API
export const getCategoriesApi =
  async (): Promise<GetCategoriesResponse> => {
    const response =
      await axiosInstance.get<GetCategoriesResponse>(
        API.CATEGORY.GET_ALL
      );

    return response.data;
  };

// Get Active Category By ID API
export const getCategoryByIdApi = async (
  id: number | string
): Promise<GetCategoryByIdResponse> => {
  const response =
    await axiosInstance.get<GetCategoryByIdResponse>(
      API.CATEGORY.GET_BY_ID(id)
    );

  return response.data;
};