
/* =========================
   Product Types
========================= */

export type ProductStatus = "ACTIVE" | "INACTIVE";

export type ProductDimensionUnit = "mm" | "cm" | "m" | "in" | "ft";

export type ProductWeightUnit = "g" | "kg" | "mg" | "lb" | "oz";

/* =========================
   Product Image
========================= */

export interface UserProductImage {
  id: number;
  uuid: string;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   Product Variation
========================= */

export interface UserProductVariation {
  id: number;
  uuid: string;
  product_id: number;
  name: string;
  sku: string | null;
  attributes: Record<string, unknown> | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  status: ProductStatus;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   Paginated Products
========================= */

export interface PaginatedProductsData {
  products: UserProductWithRelations[];
  pagination: ProductPagination;
}

/* =========================
   Product Category
========================= */

export interface UserProductCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  status: ProductStatus;
}

/* =========================
   Product Subcategory
========================= */

export interface UserProductSubcategory {
  id: number;
  uuid: string;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  status: ProductStatus;
}

/* =========================
   Product
========================= */

export interface UserProduct {
  id: number;
  uuid: string;
  category_id: number;
  subcategory_id: number | null;

  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  sku: string;

  price: number;
  compare_at_price: number | null;
  stock: number;

  // Product dimensions and weight
  height: number | null;
  width: number | null;
  length: number | null;
  weight: number | null;
  dimension_unit: ProductDimensionUnit;
  weight_unit: ProductWeightUnit;

  video_url: string | null;

  status: ProductStatus;
  featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  is_sale: boolean;
  is_offer: boolean;
  is_gift: boolean;

  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   Product With Relations
========================= */

export interface UserProductWithRelations extends UserProduct {
  category?: UserProductCategory | null;
  subcategory?: UserProductSubcategory | null;
  images?: UserProductImage[];
  variations?: UserProductVariation[];
  is_featured?: boolean;
}

/* =========================
   Product Filters
========================= */

export type ProductSection =
  | "featured"
  | "new-arrivals"
  | "best-sellers"
  | "sale"
  | "offers"
  | "gifts";

export type ProductSort =
  | "featured"
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "name"
  | "best-selling"
  | "position";

export interface GetProductsParams {
  type?: ProductSection;
  categoryId?: number;
  subcategoryId?: number;
  page?: number;
  limit?: number;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}

/* =========================
   Pagination
========================= */

export interface ProductPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================
   API Response
========================= */

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Product API Responses
========================= */

export type GetProductsResponse =
  ApiResponse<PaginatedProductsData>;

export type GetProductsByCategoryIdResponse =
  ApiResponse<PaginatedProductsData>;

export type GetProductsBySubcategoryIdResponse =
  ApiResponse<PaginatedProductsData>;

export type GetNewArrivalsResponse =
  ApiResponse<PaginatedProductsData>;

export type GetBestSellersResponse =
  ApiResponse<PaginatedProductsData>;

export type GetFeaturedProductsResponse =
  ApiResponse<PaginatedProductsData>;

export type GetSaleProductsResponse =
  ApiResponse<PaginatedProductsData>;

export type GetOfferProductsResponse =
  ApiResponse<PaginatedProductsData>;

export type GetGiftProductsResponse =
  ApiResponse<PaginatedProductsData>;

/* =========================
   Single Product API Responses
========================= */

export type GetProductByIdResponse =
  ApiResponse<UserProductWithRelations>;

export type GetProductBySlugResponse =
  ApiResponse<UserProductWithRelations>;
