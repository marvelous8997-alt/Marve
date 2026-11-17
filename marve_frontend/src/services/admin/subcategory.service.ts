import {
  createSubcategoryApi,
  getSubcategoriesApi,
  getSubcategoryApi,
  updateSubcategoryApi,
  updateSubcategoryStatusApi,
  deleteSubcategoryApi,
} from "@/src/api/admin/subCategory.api";
import {
  createSubcategorySchema,
  updateSubcategorySchema,
  updateSubcategoryStatusSchema,
} from "@/src/validations/admin/subcategory.validation";
import type {
  CreateSubcategoryFormValues,
  UpdateSubcategoryFormValues,
  UpdateSubcategoryStatusFormValues,
} from "@/src/validations/admin/subcategory.validation";
import type {
  CreateSubcategoryApiResponse,
  GetSubcategoryApiResponse,
  GetSubcategoriesApiResponse,
  GetSubcategoriesParams,
  UpdateSubcategoryApiResponse,
  UpdateSubcategoryStatusApiResponse,
  DeleteSubcategoryApiResponse,
} from "@/src/types/admin/subcategory.types";

export const createSubcategoryService = async (
  values: CreateSubcategoryFormValues
): Promise<CreateSubcategoryApiResponse> => {
  const payload = createSubcategorySchema.parse(values);
  return await createSubcategoryApi(payload);
};

export const getSubcategoriesService = async (
  params: GetSubcategoriesParams = {}
): Promise<GetSubcategoriesApiResponse> => {
  return await getSubcategoriesApi(params);
};

export const getSubcategoryDetailsService = async (
  uuid: string
): Promise<GetSubcategoryApiResponse> => {
  return await getSubcategoryApi(uuid);
};

export const updateSubcategoryService = async (
  uuid: string,
  values: UpdateSubcategoryFormValues
): Promise<UpdateSubcategoryApiResponse> => {
  const payload = updateSubcategorySchema.parse(values);
  return await updateSubcategoryApi(uuid, payload);
};

export const updateSubcategoryStatusService = async (
  uuid: string,
  values: UpdateSubcategoryStatusFormValues
): Promise<UpdateSubcategoryStatusApiResponse> => {
  const payload = updateSubcategoryStatusSchema.parse(values);
  return await updateSubcategoryStatusApi(uuid, payload);
};

export const deleteSubcategoryService = async (
  uuid: string
): Promise<DeleteSubcategoryApiResponse> => {
  return await deleteSubcategoryApi(uuid);
};