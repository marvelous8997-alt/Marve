import {
  createCategoryApi,
  getCategoriesApi,
  getCategoryApi,
  getActiveCategoriesForDropdown,
  updateCategoryApi,
  updateCategoryStatusApi,
  deleteCategoryApi,
} from "@/src/api/admin/category.api";
import {
  createCategorySchema,
  updateCategorySchema,
  updateCategoryStatusSchema,
} from "@/src/validations/admin/category.validation";
import type {
  CreateCategoryFormValues,
  UpdateCategoryFormValues,
  UpdateCategoryStatusFormValues,
} from "@/src/validations/admin/category.validation";
import type {
  CreateCategoryApiResponse,
  GetCategoryApiResponse,
  GetCategoriesApiResponse,
  GetCategoriesParams,
  GetActiveCategoriesForDropdownApiResponse,
  UpdateCategoryApiResponse,
  UpdateCategoryStatusApiResponse,
  DeleteCategoryApiResponse,
} from "@/src/types/admin/category.types";

export const createCategoryService = async (
  values: CreateCategoryFormValues
): Promise<CreateCategoryApiResponse> => {
  const payload = createCategorySchema.parse(values);
  return await createCategoryApi(payload);
};

export const getCategoriesService = async (
  params: GetCategoriesParams = {}
): Promise<GetCategoriesApiResponse> => {
  return await getCategoriesApi(params);
};

export const getActiveCategoriesForDropdownService =
  async (): Promise<GetActiveCategoriesForDropdownApiResponse> => {
    return await getActiveCategoriesForDropdown();
  };

export const getCategoryDetailsService = async (
  uuid: string
): Promise<GetCategoryApiResponse> => {
  return await getCategoryApi(uuid);
};

export const updateCategoryService = async (
  uuid: string,
  values: UpdateCategoryFormValues
): Promise<UpdateCategoryApiResponse> => {
  const payload = updateCategorySchema.parse(values);
  return await updateCategoryApi(uuid, payload);
};

export const updateCategoryStatusService = async (
  uuid: string,
  values: UpdateCategoryStatusFormValues
): Promise<UpdateCategoryStatusApiResponse> => {
  const payload = updateCategoryStatusSchema.parse(values);
  return await updateCategoryStatusApi(uuid, payload);
};

export const deleteCategoryService = async (
  uuid: string
): Promise<DeleteCategoryApiResponse> => {
  return await deleteCategoryApi(uuid);
};