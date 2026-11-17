import axiosInstance from "@/src/lib/axios";

import type {
  ProductVariation,
  ProductVariationFilters,
  ProductVariationListResult,
  ProductVariationApiResponse,
  ProductVariationStatus,
  ProductVariationBulkCreatePayload,
} from "@/src/types/admin/productVariation.types";

// =====================================================
// API ENDPOINTS
// =====================================================

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  PRODUCT_VARIATION: {
    CREATE: "/admin/product-variations/create",

    // Bulk create multiple variations
    BULK_CREATE: "/admin/product-variations/bulk-create",

    LIST: "/admin/product-variations/list",

    DETAILS: (uuid: string) =>
      `/admin/product-variations/list/${uuid}`,

    UPDATE: (uuid: string) =>
      `/admin/product-variations/update/${uuid}`,

    STATUS: (uuid: string) =>
      `/admin/product-variations/status/${uuid}`,

    DELETE: (uuid: string) =>
      `/admin/product-variations/${uuid}`,
  },
};

// =====================================================
// CREATE PRODUCT VARIATION REQUEST
// =====================================================

export interface CreateProductVariationRequest {
  product_id: number;

  name: string;
  sku: string;

  attributes: Record<string, string | number | boolean>;

  price: number;
  compare_at_price?: number | null;

  stock?: number;
  status?: ProductVariationStatus;
  sort_order?: number;
}

// =====================================================
// BULK CREATE PRODUCT VARIATIONS REQUEST
// =====================================================

export type BulkCreateProductVariationsRequest =
  ProductVariationBulkCreatePayload;

// =====================================================
// UPDATE PRODUCT VARIATION REQUEST
// =====================================================

export type UpdateProductVariationRequest = Partial<
  Omit<CreateProductVariationRequest, "product_id">
>;

// =====================================================
// UPDATE PRODUCT VARIATION STATUS REQUEST
// =====================================================

export interface UpdateProductVariationStatusRequest {
  status: ProductVariationStatus;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export type CreateProductVariationApiResponse =
  ProductVariationApiResponse<ProductVariation>;

export type BulkCreateProductVariationsApiResponse =
  ProductVariationApiResponse<ProductVariation[]>;

export type GetProductVariationApiResponse =
  ProductVariationApiResponse<ProductVariation>;

export type UpdateProductVariationApiResponse =
  ProductVariationApiResponse<ProductVariation>;

export type UpdateProductVariationStatusApiResponse =
  ProductVariationApiResponse<ProductVariation>;

export type DeleteProductVariationApiResponse =
  ProductVariationApiResponse<null>;

export type GetProductVariationsApiResponse =
  ProductVariationApiResponse<ProductVariationListResult>;

// =====================================================
// CREATE PRODUCT VARIATION API
// =====================================================

export const createProductVariationApi = async (
  payload: CreateProductVariationRequest
): Promise<CreateProductVariationApiResponse> => {
  const response =
    await axiosInstance.post<CreateProductVariationApiResponse>(
      API.PRODUCT_VARIATION.CREATE,
      payload
    );

  return response.data;
};

// =====================================================
// BULK CREATE PRODUCT VARIATIONS API
// =====================================================

export const bulkCreateProductVariationsApi = async (
  payload: BulkCreateProductVariationsRequest
): Promise<BulkCreateProductVariationsApiResponse> => {
  const response =
    await axiosInstance.post<BulkCreateProductVariationsApiResponse>(
      API.PRODUCT_VARIATION.BULK_CREATE,
      payload
    );

  return response.data;
};

// =====================================================
// GET PRODUCT VARIATIONS LIST API
// =====================================================

export const getProductVariationsApi = async (
  params: ProductVariationFilters = {}
): Promise<GetProductVariationsApiResponse> => {
  const queryParams: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      const apiKey =
        key === "productId"
          ? "product_id"
          : key;

      queryParams[apiKey] = value as string | number | boolean;
    }
  });

  const response =
    await axiosInstance.get<GetProductVariationsApiResponse>(
      API.PRODUCT_VARIATION.LIST,
      {
        params: queryParams,
      }
    );

  return response.data;
};

// =====================================================
// GET PRODUCT VARIATION DETAILS API
// =====================================================

export const getProductVariationApi = async (
  uuid: string
): Promise<GetProductVariationApiResponse> => {
  const response =
    await axiosInstance.get<GetProductVariationApiResponse>(
      API.PRODUCT_VARIATION.DETAILS(uuid)
    );

  return response.data;
};

// =====================================================
// UPDATE PRODUCT VARIATION API
// =====================================================

export const updateProductVariationApi = async (
  uuid: string,
  payload: UpdateProductVariationRequest
): Promise<UpdateProductVariationApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateProductVariationApiResponse>(
      API.PRODUCT_VARIATION.UPDATE(uuid),
      payload
    );

  return response.data;
};

// =====================================================
// UPDATE PRODUCT VARIATION STATUS API
// =====================================================

export const updateProductVariationStatusApi = async (
  uuid: string,
  payload: UpdateProductVariationStatusRequest
): Promise<UpdateProductVariationStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateProductVariationStatusApiResponse>(
      API.PRODUCT_VARIATION.STATUS(uuid),
      payload
    );

  return response.data;
};

// =====================================================
// DELETE PRODUCT VARIATION API
// =====================================================

export const deleteProductVariationApi = async (
  uuid: string
): Promise<DeleteProductVariationApiResponse> => {
  const response =
    await axiosInstance.delete<DeleteProductVariationApiResponse>(
      API.PRODUCT_VARIATION.DELETE(uuid)
    );

  return response.data;
};