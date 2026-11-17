import {
  getCategoriesApi,
  getCategoryByIdApi,
} from "@/src/api/user/category.api";

import type {
  GetCategoriesResponse,
  GetCategoryByIdResponse,
} from "@/src/types/user/category.types";

// Get All Active Categories Service
export const getCategoriesService =
  async (): Promise<GetCategoriesResponse> => {
    return await getCategoriesApi();
  };

// Get Active Category By ID Service
export const getCategoryByIdService = async (
  id: number | string
): Promise<GetCategoryByIdResponse> => {
  return await getCategoryByIdApi(id);
};