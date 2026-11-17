export type ProductStatus = "ACTIVE" | "INACTIVE";

export type ProductDimensionUnit = "mm" | "cm" | "m" | "in" | "ft";

export type ProductWeightUnit = "g" | "kg" | "mg" | "lb" | "oz";

export interface ProductImage {
  id?: number;
  uuid?: string;
  productId?: number;
  product_id?: number;
  imageUrl: string;
  image_url?: string;
  altText: string;
  alt_text?: string;
  isPrimary: boolean;
  is_primary?: boolean;
  sortOrder: number;
  sort_order?: number;
  file?: File | null;
  previewUrl?: string;
}

export interface ProductCategoryInfo {
  id: number;
  uuid?: string;
  name: string;
  slug?: string;
}

export interface ProductVideo {
  videoUrl: string;
  video_url?: string;
  videoPublicId?: string;
  video_public_id?: string;
  file?: File | null;
  previewUrl?: string;
}

export interface Product {
  id: number;
  uuid: string;

  categoryId: number;
  category_id?: number;
  categoryName?: string;
  category?: ProductCategoryInfo;

  subcategoryId: number;
  subcategory_id?: number;
  subcategoryName?: string;
  subcategory?: ProductCategoryInfo;

  name: string;
  slug: string;
  shortDescription: string;
  short_description?: string;
  description: string;
  sku: string | null;

  price: number;
  compareAtPrice: number | null;
  compare_at_price?: number | null;
  stock: number;

  // Product dimensions and weight
  height: number | null;
  width: number | null;
  length: number | null;
  weight: number | null;
  dimension_unit: ProductDimensionUnit;
  weight_unit: ProductWeightUnit;

  images: ProductImage[];

  videoUrl: string | null;
  video_url?: string | null;
  videoPublicId?: string | null;
  video_public_id?: string | null;

  status: ProductStatus;
  featured: boolean;
  isNewArrival: boolean;
  is_new_arrival?: boolean;
  isBestseller: boolean;
  is_bestseller?: boolean;
  isSale: boolean;
  is_sale?: boolean;
  isOffer: boolean;
  is_offer?: boolean;
  isGift: boolean;
  is_gift?: boolean;

  sortOrder: number;
  sort_order?: number;

  createdBy?: number | null;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  categoryId: number | "";
  subcategoryId: number | "";

  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;

  price: number | "";
  compareAtPrice: number | "";
  stock: number | "";

  // Product dimensions and weight
  height: number | "";
  width: number | "";
  length: number | "";
  weight: number | "";
  dimension_unit: ProductDimensionUnit;
  weight_unit: ProductWeightUnit;

  images: ProductImage[];
  video: File | null;
  existingImages?: ProductImage[];
  existingVideoUrl?: string | null;

  status: ProductStatus;
  featured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isSale: boolean;
  isOffer: boolean;
  isGift: boolean;

  sortOrder: number | "";
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus | "";
  categoryId?: number | "";
  subcategoryId?: number | "";
  featured?: boolean | "";
  isNewArrival?: boolean | "";
  isBestseller?: boolean | "";
  isSale?: boolean | "";
  isOffer?: boolean | "";
  isGift?: boolean | "";
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ProductPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListResult {
  products: Product[];
  pagination: ProductPagination;
}

export interface ProductApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}