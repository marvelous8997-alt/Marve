import {
  createProductApi,
  getProductsApi,
  getProductApi,
  updateProductApi,
  updateProductStatusApi,
  removeProductVideoApi,
  deleteProductApi,
} from "@/src/api/admin/product.api";

import type {
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  GetProductsApiResponse,
  GetProductApiResponse,
  CreateProductApiResponse,
  UpdateProductApiResponse,
  UpdateProductStatusApiResponse,
  RemoveProductVideoApiResponse,
  DeleteProductApiResponse,
} from "@/src/api/admin/product.api";

import type { ProductFilters } from "@/src/types/admin/product.types";

import {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
} from "@/src/validations/admin/product.validation";

import type {
  CreateProductFormValues,
  UpdateProductFormValues,
  UpdateProductStatusFormValues,
} from "@/src/validations/admin/product.validation";

/* =========================
   Create Product Service
========================= */

export const createProductService = async (
  values: CreateProductFormValues
): Promise<CreateProductApiResponse> => {
  const payload = createProductSchema.parse(values);

  return await createProductApi(payload as CreateProductRequest);
};

/* =========================
   Get Products Service
========================= */

export const getProductsService = async (
  params: ProductFilters = {}
): Promise<GetProductsApiResponse> => {
  return await getProductsApi(params);
};

/* =========================
   Get Product Details Service
========================= */

export const getProductDetailsService = async (
  uuid: string
): Promise<GetProductApiResponse> => {
  return await getProductApi(uuid);
};

/* =========================
   Update Product Service
========================= */

export const updateProductService = async (
  uuid: string,
  values: UpdateProductFormValues
): Promise<UpdateProductApiResponse> => {
  const payload = updateProductSchema.parse(values);

  return await updateProductApi(uuid, payload as UpdateProductRequest);
};

/* =========================
   Update Product Status Service
========================= */

export const updateProductStatusService = async (
  uuid: string,
  values: UpdateProductStatusFormValues
): Promise<UpdateProductStatusApiResponse> => {
  const payload = updateProductStatusSchema.parse(values);

  return await updateProductStatusApi(
    uuid,
    payload as UpdateProductStatusRequest
  );
};

/* =========================
   Remove Product Video Service
========================= */

export const removeProductVideoService = async (
  uuid: string
): Promise<RemoveProductVideoApiResponse> => {
  return await removeProductVideoApi(uuid);
};

/* =========================
   Delete Product Service
========================= */

export const deleteProductService = async (
  uuid: string
): Promise<DeleteProductApiResponse> => {
  return await deleteProductApi(uuid);
};