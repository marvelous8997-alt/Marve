import axiosInstance from "@/src/lib/axios";
import type {
  CreateSubcategoryRequest,
  CreateSubcategoryApiResponse,
  GetSubcategoryApiResponse,
  GetSubcategoriesApiResponse,
  GetSubcategoriesParams,
  UpdateSubcategoryRequest,
  UpdateSubcategoryApiResponse,
  UpdateSubcategoryStatusRequest,
  UpdateSubcategoryStatusApiResponse,
  DeleteSubcategoryApiResponse,
} from "@/src/types/admin/subcategory.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  SUBCATEGORY: {
    CREATE: "/admin/subcategories/create",
    LIST: "/admin/subcategories/list",
    DETAILS: (uuid: string) => `/admin/subcategories/list/${uuid}`,
    UPDATE: (uuid: string) => `/admin/subcategories/update/${uuid}`,
    STATUS: (uuid: string) => `/admin/subcategories/status/${uuid}`,
    DELETE: (uuid: string) => `/admin/subcategories/${uuid}`,
  },
};

// Create Subcategory API
export const createSubcategoryApi = async (
  payload: CreateSubcategoryRequest
): Promise<CreateSubcategoryApiResponse> => {
  const formData = new FormData();
  formData.append("category_id", String(payload.category_id));
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
    await axiosInstance.post<CreateSubcategoryApiResponse>(
      API.SUBCATEGORY.CREATE,
      formData
    );
  return response.data;
};

// Get Subcategories API
export const getSubcategoriesApi = async (
  params: GetSubcategoriesParams = {}
): Promise<GetSubcategoriesApiResponse> => {
  const response =
    await axiosInstance.get<GetSubcategoriesApiResponse>(
      API.SUBCATEGORY.LIST,
      { params }
    );
  return response.data;
};

// Get Subcategory Details API
export const getSubcategoryApi = async (
  uuid: string
): Promise<GetSubcategoryApiResponse> => {
  const response =
    await axiosInstance.get<GetSubcategoryApiResponse>(
      API.SUBCATEGORY.DETAILS(uuid)
    );
  return response.data;
};

// Update Subcategory API
export const updateSubcategoryApi = async (
  uuid: string,
  payload: UpdateSubcategoryRequest
): Promise<UpdateSubcategoryApiResponse> => {
  const formData = new FormData();
  if (payload.category_id !== undefined) {
    formData.append("category_id", String(payload.category_id));
  }
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
    await axiosInstance.patch<UpdateSubcategoryApiResponse>(
      API.SUBCATEGORY.UPDATE(uuid),
      formData
    );
  return response.data;
};

// Update Subcategory Status API
export const updateSubcategoryStatusApi = async (
  uuid: string,
  payload: UpdateSubcategoryStatusRequest
): Promise<UpdateSubcategoryStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateSubcategoryStatusApiResponse>(
      API.SUBCATEGORY.STATUS(uuid),
      payload
    );
  return response.data;
};

// Delete Subcategory API
export const deleteSubcategoryApi = async (
  uuid: string
): Promise<DeleteSubcategoryApiResponse> => {
  const response =
    await axiosInstance.delete<DeleteSubcategoryApiResponse>(
      API.SUBCATEGORY.DELETE(uuid)
    );
  return response.data;
};