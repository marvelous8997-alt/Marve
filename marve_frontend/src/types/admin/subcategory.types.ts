export type SubcategoryStatus = "ACTIVE" | "INACTIVE";
export type SubcategoryIcon =
  | "CookingPot"
  | "ChefHat"
  | "Utensils"
  | "UtensilsCrossed"
  | "Soup"
  | "Salad"
  | "Wheat"
  | "Egg"
  | "Pizza"
  | "CakeSlice"
  | "Coffee"
  | "Wine"
  | "Microwave"
  | "Container"
  | "Archive"
  | "Package"
  | "Boxes"
  | "Box"
  | "Layers"
  | "CupSoda"
  | "GlassWater"
  | "House"
  | "Wrench"
  | "Hammer"
  | "Brush"
  | "SprayCan"
  | "Trash2"
  | "Sparkles"
  | "Flower2"
  | "Lamp"
  | "Frame"
  | "Palette"
  | "Heart"
  | "Cake"
  | "Lightbulb"
  | "LampCeiling"
  | "LampDesk"
  | "Sun"
  | "LightbulbOff";

export interface SubcategoryParentCategory {
  id: number | string;
  uuid: string;
  name: string;
  slug: string;
}

export interface Subcategory {
  id: number | string;
  uuid: string;
  categoryId?: number | string;
  category_id: number | string;
  category?: SubcategoryParentCategory | null;
  categoryName?: string;
  productCount?: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: SubcategoryIcon | null;
  status: SubcategoryStatus;
  sortOrder?: number;
  sort_order?: number;
  createdAt?: string;
  updatedAt?: string;
  created_by?: number | string | null;
  updated_by?: number | string | null;
}

export interface CreateSubcategoryRequest {
  category_id: number | string;
  name: string;
  slug: string;
  description?: string;
  icon?: SubcategoryIcon | "" | null;
  status?: SubcategoryStatus;
  sort_order?: number;
  image?: File | null;
}

export interface UpdateSubcategoryRequest {
  category_id?: number | string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: SubcategoryIcon | "" | null;
  status?: SubcategoryStatus;
  sort_order?: number;
  image?: File | null;
}

export interface UpdateSubcategoryStatusRequest {
  status: SubcategoryStatus;
}

export interface GetSubcategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubcategoryStatus;
  category_id?: number | string;
  sortBy?: "name" | "status" | "sort_order" | "createdAt" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

export interface SubcategoryPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetSubcategoriesResponseData
  extends SubcategoryPagination {
  rows: Subcategory[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type CreateSubcategoryApiResponse = ApiResponse<Subcategory>;
export type GetSubcategoryApiResponse = ApiResponse<Subcategory>;
export type GetSubcategoriesApiResponse = ApiResponse<GetSubcategoriesResponseData>;
export type UpdateSubcategoryApiResponse = ApiResponse<Subcategory>;
export type UpdateSubcategoryStatusApiResponse = ApiResponse<Subcategory>;
export type DeleteSubcategoryApiResponse = ApiResponse<null>;