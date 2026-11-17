import axiosInstance from "@/src/lib/axios";
import type {
  Product,
  ProductFilters,
  ProductListResult,
  ProductApiResponse,
  ProductStatus,
  ProductImage,
  ProductDimensionUnit,
  ProductWeightUnit,
} from "@/src/types/admin/product.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  PRODUCT: {
    CREATE: "/admin/products/create",
    LIST: "/admin/products/list",
    DETAILS: (uuid: string) => `/admin/products/list/${uuid}`,
    UPDATE: (uuid: string) => `/admin/products/update/${uuid}`,
    STATUS: (uuid: string) => `/admin/products/status/${uuid}`,
    REMOVE_VIDEO: (uuid: string) => `/admin/products/video/${uuid}`,
    DELETE: (uuid: string) => `/admin/products/${uuid}`,
  },
};

export interface CreateProductRequest {
  category_id: number;
  subcategory_id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  sku?: string | null;
  price: number;
  compare_at_price?: number | null;
  stock?: number;

  // Product dimensions and weight
  height?: number | null;
  width?: number | null;
  length?: number | null;
  weight?: number | null;
  dimension_unit?: ProductDimensionUnit;
  weight_unit?: ProductWeightUnit;

  status?: ProductStatus;
  featured?: boolean;
  is_new_arrival?: boolean;
  is_bestseller?: boolean;
  is_sale?: boolean;
  is_offer?: boolean;
  is_gift?: boolean;
  sort_order?: number;
  images: File[];
  video?: File | null;
  image_manifest?: string;
  alt_texts?: string[];
  primary_image_index?: number;
}

export type UpdateProductRequest = Partial<
  Omit<CreateProductRequest, "images" | "video">
> & {
  images?: File[];
  video?: File | null;
};

export interface UpdateProductStatusRequest {
  status: ProductStatus;
}

export type CreateProductApiResponse = ProductApiResponse<Product>;
export type GetProductApiResponse = ProductApiResponse<Product>;
export type UpdateProductApiResponse = ProductApiResponse<Product>;
export type UpdateProductStatusApiResponse = ProductApiResponse<Product>;
export type DeleteProductApiResponse = ProductApiResponse<null>;
export type RemoveProductVideoApiResponse = ProductApiResponse<Product>;
export type GetProductsApiResponse = ProductApiResponse<
  ProductListResult | Product[]
>;

const appendIfDefined = (
  formData: FormData,
  key: string,
  value: string | number | boolean | null | undefined
) => {
  if (value !== undefined && value !== null) {
    formData.append(key, String(value));
  }
};

const appendProductFields = (
  formData: FormData,
  payload: Partial<CreateProductRequest>
) => {
  appendIfDefined(formData, "category_id", payload.category_id);
  appendIfDefined(formData, "subcategory_id", payload.subcategory_id);
  appendIfDefined(formData, "name", payload.name);
  appendIfDefined(formData, "slug", payload.slug);
  appendIfDefined(formData, "short_description", payload.short_description);
  appendIfDefined(formData, "description", payload.description);
  appendIfDefined(formData, "sku", payload.sku);
  appendIfDefined(formData, "price", payload.price);
  appendIfDefined(formData, "compare_at_price", payload.compare_at_price);
  appendIfDefined(formData, "stock", payload.stock);

  // Product dimensions and weight
  appendIfDefined(formData, "height", payload.height);
  appendIfDefined(formData, "width", payload.width);
  appendIfDefined(formData, "length", payload.length);
  appendIfDefined(formData, "weight", payload.weight);
  appendIfDefined(formData, "dimension_unit", payload.dimension_unit);
  appendIfDefined(formData, "weight_unit", payload.weight_unit);

  appendIfDefined(formData, "status", payload.status);
  appendIfDefined(formData, "featured", payload.featured);
  appendIfDefined(formData, "is_new_arrival", payload.is_new_arrival);
  appendIfDefined(formData, "is_bestseller", payload.is_bestseller);
  appendIfDefined(formData, "is_sale", payload.is_sale);
  appendIfDefined(formData, "is_offer", payload.is_offer);
  appendIfDefined(formData, "is_gift", payload.is_gift);
  appendIfDefined(formData, "sort_order", payload.sort_order);
};

const appendProductMedia = (
  formData: FormData,
  payload: {
    images?: File[];
    video?: File | null;
    image_manifest?: string;
    alt_texts?: string[];
    primary_image_index?: number;
  }
) => {
  payload.images?.forEach((image) => {
    formData.append("images", image);
  });

  if (payload.video) {
    formData.append("video", payload.video);
  }

  if (payload.image_manifest !== undefined) {
    formData.append("image_manifest", payload.image_manifest);
  }

  payload.alt_texts?.forEach((altText, index) => {
    formData.append(`alt_texts[${index}]`, altText);
  });

  if (payload.primary_image_index !== undefined) {
    formData.append(
      "primary_image_index",
      String(payload.primary_image_index),
    );
  }
};

// Create Product API
export const createProductApi = async (
  payload: CreateProductRequest
): Promise<CreateProductApiResponse> => {
  const formData = new FormData();

  appendProductFields(formData, payload);
  appendProductMedia(formData, payload);

  const response = await axiosInstance.post<CreateProductApiResponse>(
    API.PRODUCT.CREATE,
    formData
  );

  return response.data;
};

// Get Products API
export const getProductsApi = async (
  params: ProductFilters = {}
): Promise<GetProductsApiResponse> => {
  const queryParams: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams[key] = value as string | number | boolean;
    }
  });

  const response = await axiosInstance.get<GetProductsApiResponse>(
    API.PRODUCT.LIST,
    {
      params: queryParams,
    }
  );

  return response.data;
};

// Get Product Details API
export const getProductApi = async (
  uuid: string
): Promise<GetProductApiResponse> => {
  const response = await axiosInstance.get<GetProductApiResponse>(
    API.PRODUCT.DETAILS(uuid)
  );

  return response.data;
};

// Update Product API
export const updateProductApi = async (
  uuid: string,
  payload: UpdateProductRequest
): Promise<UpdateProductApiResponse> => {
  const formData = new FormData();

  appendProductFields(formData, payload);
  appendProductMedia(formData, payload);

  const response = await axiosInstance.patch<UpdateProductApiResponse>(
    API.PRODUCT.UPDATE(uuid),
    formData
  );

  return response.data;
};

// Update Product Status API
export const updateProductStatusApi = async (
  uuid: string,
  payload: UpdateProductStatusRequest
): Promise<UpdateProductStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateProductStatusApiResponse>(
      API.PRODUCT.STATUS(uuid),
      payload
    );

  return response.data;
};

// Remove Product Video API
export const removeProductVideoApi = async (
  uuid: string
): Promise<RemoveProductVideoApiResponse> => {
  const response =
    await axiosInstance.delete<RemoveProductVideoApiResponse>(
      API.PRODUCT.REMOVE_VIDEO(uuid)
    );

  return response.data;
};

// Delete Product API
export const deleteProductApi = async (
  uuid: string
): Promise<DeleteProductApiResponse> => {
  const response = await axiosInstance.delete<DeleteProductApiResponse>(
    API.PRODUCT.DELETE(uuid)
  );

  return response.data;
};