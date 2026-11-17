
import {
  getSubcategoriesApi,
  getSubcategoryByIdApi,
  getSubcategoriesByCategoryIdApi,
} from "@/src/api/user/subcategory.api";

import type {
  GetSubcategoriesResponse,
  GetSubcategoryByIdResponse,
  GetSubcategoriesByCategoryIdResponse,
} from "@/src/types/user/subcategory.types";

// Get All Active Subcategories Service
export const getSubcategoriesService =
  async (): Promise<GetSubcategoriesResponse> => {
    return await getSubcategoriesApi();
  };

// Get Active Subcategory By ID Service
export const getSubcategoryByIdService = async (
  id: number | string
): Promise<GetSubcategoryByIdResponse> => {
  return await getSubcategoryByIdApi(id);
};

// Get Active Subcategories By Category ID Service
export const getSubcategoriesByCategoryIdService = async (
  categoryId: number | string
): Promise<GetSubcategoriesByCategoryIdResponse> => {
  return await getSubcategoriesByCategoryIdApi(categoryId);
};
