import {
  createProductVariationApi,
  bulkCreateProductVariationsApi,
  getProductVariationsApi,
  getProductVariationApi,
  updateProductVariationApi,
  updateProductVariationStatusApi,
  deleteProductVariationApi,
} from "@/src/api/admin/productVariation.api";

import type {
  CreateProductVariationRequest,
  BulkCreateProductVariationsRequest,
  UpdateProductVariationRequest,
  UpdateProductVariationStatusRequest,
  GetProductVariationsApiResponse,
  GetProductVariationApiResponse,
  CreateProductVariationApiResponse,
  BulkCreateProductVariationsApiResponse,
  UpdateProductVariationApiResponse,
  UpdateProductVariationStatusApiResponse,
  DeleteProductVariationApiResponse,
} from "@/src/api/admin/productVariation.api";

import type {
  ProductVariationFilters,
} from "@/src/types/admin/productVariation.types";

import {
  createProductVariationSchema,
  bulkCreateProductVariationsSchema,
  updateProductVariationSchema,
  updateProductVariationStatusSchema,
} from "@/src/validations/admin/productVariation.validation";

import type {
  CreateProductVariationFormValues,
  BulkCreateProductVariationsFormValues,
  UpdateProductVariationFormValues,
  UpdateProductVariationStatusFormValues,
} from "@/src/validations/admin/productVariation.validation";

// =====================================================
// CREATE PRODUCT VARIATION SERVICE
// =====================================================

export const createProductVariationService = async (
  values: CreateProductVariationFormValues
): Promise<CreateProductVariationApiResponse> => {
  const payload = createProductVariationSchema.parse(values);

  const request: CreateProductVariationRequest = {
    ...payload,
    product_id: Number(payload.product_id),
  };

  return createProductVariationApi(request);
};

// =====================================================
// BULK CREATE PRODUCT VARIATIONS SERVICE
// =====================================================

export const bulkCreateProductVariationsService = async (
  values: BulkCreateProductVariationsFormValues
): Promise<BulkCreateProductVariationsApiResponse> => {
  const payload = bulkCreateProductVariationsSchema.parse(values);

  const request: BulkCreateProductVariationsRequest = {
    product_id: Number(payload.product_id),

    variations: payload.variations.map((variation) => ({
      name: variation.name.trim(),
      sku: variation.sku.trim(),

      attributes: variation.attributes,

      price: variation.price,

      ...(variation.compare_at_price !== undefined
        ? { compare_at_price: variation.compare_at_price }
        : {}),

      stock: variation.stock,
      status: variation.status,
      sort_order: variation.sort_order,
    })),
  };

  return bulkCreateProductVariationsApi(request);
};

// =====================================================
// GET PRODUCT VARIATIONS LIST SERVICE
// =====================================================

export const getProductVariationsService = async (
  params: ProductVariationFilters = {}
): Promise<GetProductVariationsApiResponse> => {
  return getProductVariationsApi(params);
};

// =====================================================
// GET PRODUCT VARIATION DETAILS SERVICE
// =====================================================

export const getProductVariationDetailsService = async (
  uuid: string
): Promise<GetProductVariationApiResponse> => {
  return getProductVariationApi(uuid);
};

// =====================================================
// UPDATE PRODUCT VARIATION SERVICE
// =====================================================

export const updateProductVariationService = async (
  uuid: string,
  values: UpdateProductVariationFormValues
): Promise<UpdateProductVariationApiResponse> => {
  const payload = updateProductVariationSchema.parse(values);

  return updateProductVariationApi(
    uuid,
    payload as UpdateProductVariationRequest
  );
};

// =====================================================
// UPDATE PRODUCT VARIATION STATUS SERVICE
// =====================================================

export const updateProductVariationStatusService = async (
  uuid: string,
  values: UpdateProductVariationStatusFormValues
): Promise<UpdateProductVariationStatusApiResponse> => {
  const payload = updateProductVariationStatusSchema.parse(values);

  return updateProductVariationStatusApi(
    uuid,
    payload as UpdateProductVariationStatusRequest
  );
};

// =====================================================
// DELETE PRODUCT VARIATION SERVICE
// =====================================================

export const deleteProductVariationService = async (
  uuid: string
): Promise<DeleteProductVariationApiResponse> => {
  return deleteProductVariationApi(uuid);
};