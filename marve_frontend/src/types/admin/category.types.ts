export type CategoryStatus = "ACTIVE" | "INACTIVE";
export type CategoryIcon =
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

export interface Category {
  id: number | string;
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: CategoryIcon | null;
  status: CategoryStatus;
  sortOrder: number;
  sort_order?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
  created_by?: number | string | null;
  updated_by?: number | string | null;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: CategoryIcon | "" | null;
  status?: CategoryStatus;
  sort_order?: number;
  image?: File | null;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  icon?: CategoryIcon | "" | null;
  status?: CategoryStatus;
  sort_order?: number;
  image?: File | null;
}

export interface UpdateCategoryStatusRequest {
  status: CategoryStatus;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CategoryStatus;
  sortBy?: "name" | "status" | "sort_order" | "createdAt" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

export interface CategoryPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCategoriesResponseData
  extends CategoryPagination {
  rows: Category[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type CreateCategoryApiResponse = ApiResponse<Category>;
export type GetCategoryApiResponse = ApiResponse<Category>;
export type GetCategoriesApiResponse = ApiResponse<GetCategoriesResponseData>;
export type UpdateCategoryApiResponse = ApiResponse<Category>;
export type UpdateCategoryStatusApiResponse = ApiResponse<Category>;
export type DeleteCategoryApiResponse = ApiResponse<null>;
export type ActiveCategoryOption = Pick< Category, "id" | "name" | "status">;
export type GetActiveCategoriesForDropdownApiResponse = ApiResponse<ActiveCategoryOption[]>;