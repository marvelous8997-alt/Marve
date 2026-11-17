export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface UserCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  status: CategoryStatus;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type GetCategoriesResponse = ApiResponse<UserCategory[]>;

export type GetCategoryByIdResponse = ApiResponse<UserCategory>;