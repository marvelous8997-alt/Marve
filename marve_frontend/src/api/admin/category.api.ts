import axiosInstance from "@/src/lib/axios";
import type {
  CreateCategoryRequest,
  CreateCategoryApiResponse,
  GetCategoryApiResponse,
  GetCategoriesApiResponse,
  GetCategoriesParams,
  UpdateCategoryRequest,
  UpdateCategoryApiResponse,
  UpdateCategoryStatusRequest,
  UpdateCategoryStatusApiResponse,
  DeleteCategoryApiResponse,
  GetActiveCategoriesForDropdownApiResponse,
} from "@/src/types/admin/category.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  CATEGORY: {
    CREATE: "/admin/categories/create",
    LIST: "/admin/categories/list",
    DETAILS: (uuid: string) => `/admin/categories/list/${uuid}`,
    UPDATE: (uuid: string) => `/admin/categories/update/${uuid}`,
    STATUS: (uuid: string) => `/admin/categories/status/${uuid}`,
    DELETE: (uuid: string) => `/admin/categories/${uuid}`,
  ACTIVE_OPTIONS: "/admin/subcategories/active-category-options",
  },
};

// Create Category API
export const createCategoryApi = async (
  payload: CreateCategoryRequest
): Promise<CreateCategoryApiResponse> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("slug", payload.slug);
  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }
  if (payload.icon !== undefined && payload.icon !== null) {
    formData.append("icon", payload.icon);
  }
  if (payload.status) {
    formData.append("status", payload.status);
  }
  if (payload.sort_order !== undefined) {
    formData.append("sort_order", String(payload.sort_order));
  }
  if (payload.image) {
    formData.append("image", payload.image);
  }
  const response =
    await axiosInstance.post<CreateCategoryApiResponse>(
      API.CATEGORY.CREATE,
      formData
    );
  return response.data;
};

// Get Categories API
export const getCategoriesApi = async (
  params: GetCategoriesParams = {}
): Promise<GetCategoriesApiResponse> => {
  const response =
    await axiosInstance.get<GetCategoriesApiResponse>(
      API.CATEGORY.LIST,
      { params }
    );
  return response.data;
};

// Get Category Details API
export const getCategoryApi = async (
  uuid: string
): Promise<GetCategoryApiResponse> => {
  const response =
    await axiosInstance.get<GetCategoryApiResponse>(
      API.CATEGORY.DETAILS(uuid)
    );
  return response.data;
};

// Update Category API
export const updateCategoryApi = async (
  uuid: string,
  payload: UpdateCategoryRequest
): Promise<UpdateCategoryApiResponse> => {
  const formData = new FormData();
  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }
  if (payload.slug !== undefined) {
    formData.append("slug", payload.slug);
  }
  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }
  if (payload.icon !== undefined && payload.icon !== null) {
    formData.append("icon", payload.icon);
  }
  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }
  if (payload.sort_order !== undefined) {
    formData.append("sort_order", String(payload.sort_order));
  }
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response =
    await axiosInstance.patch<UpdateCategoryApiResponse>(
      API.CATEGORY.UPDATE(uuid),
      formData
    );
  return response.data;
};

// Update Category Status API
export const updateCategoryStatusApi = async (
  uuid: string,
  payload: UpdateCategoryStatusRequest
): Promise<UpdateCategoryStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateCategoryStatusApiResponse>(
      API.CATEGORY.STATUS(uuid),
      payload
    );
  return response.data;
};

// Delete Category API
export const deleteCategoryApi = async (
  uuid: string
): Promise<DeleteCategoryApiResponse> => {
  const response =
    await axiosInstance.delete<DeleteCategoryApiResponse>(
      API.CATEGORY.DELETE(uuid)
    );
  return response.data;
};

// Get Active Categories
export const getActiveCategoriesForDropdown = async (): Promise<
  GetActiveCategoriesForDropdownApiResponse
> => {
  const response =
    await axiosInstance.get<GetActiveCategoriesForDropdownApiResponse>(
      API.CATEGORY.ACTIVE_OPTIONS
    );
  return response.data;
};