/* =====================================================
   PRODUCT VARIATION TYPES
===================================================== */

export type ProductVariationStatus = "ACTIVE" | "INACTIVE";

/* ========================= Product ========================= */

export interface ProductVariationProduct {
  id: number;
  uuid: string;
  name: string;
  slug?: string;
  sku?: string | null;
}

/* ========================= Attributes ========================= */

export type ProductVariationAttributeValue =
  | string
  | number
  | boolean;

export type ProductVariationAttributes = Record<
  string,
  ProductVariationAttributeValue
>;

/* ========================= Product Variation ========================= */

export interface ProductVariation {
  id: number;
  uuid: string;

  product_id: number;
  productId?: number;

  product?: ProductVariationProduct | null;
  productName?: string;

  name: string;
  sku: string;

  attributes: ProductVariationAttributes;

  price: number;

  compare_at_price: number | null;
  compareAtPrice?: number | null;

  stock: number;

  status: ProductVariationStatus;

  sort_order: number;
  sortOrder?: number;

  created_by?: number | null;
  createdBy?: number | null;

  updated_by?: number | null;
  updatedBy?: number | null;

  created_at?: string;
  updated_at?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* ========================= Create Form ========================= */

export interface ProductVariationFormData {
  product_id: number | string;

  name: string;
  sku: string;

  attributes: Record<string, string>;

  price: number | "";

  compare_at_price: number | "";

  stock: number | "";

  status: ProductVariationStatus;

  sort_order: number | "";
}

/* ========================= Bulk Create ========================= */

export interface ProductVariationBulkItem {
  name: string;
  sku: string;

  attributes: ProductVariationAttributes;

  price: number | "";
  compare_at_price?: number | "" | null;

  stock: number | "";
  status?: ProductVariationStatus;

  sort_order?: number | "";
}

export interface ProductVariationBulkCreatePayload {
  product_id: number;
  variations: ProductVariationBulkItem[];
}

/* ========================= Filters ========================= */

export interface ProductVariationFilters {
  page?: number;
  limit?: number;
  search?: string;

  productId?: number | "";
  product_id?: number | "";

  status?: ProductVariationStatus | "";

  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/* ========================= Pagination ========================= */

export interface ProductVariationPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ========================= List Result ========================= */

export interface ProductVariationListResult {
  count: number;
  rows: ProductVariation[];

  page: number;
  limit: number;
  totalPages: number;
}

/* ========================= API Response ========================= */

export interface ProductVariationApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}