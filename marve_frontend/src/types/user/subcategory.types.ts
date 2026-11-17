
export type SubcategoryStatus = "ACTIVE" | "INACTIVE";

export interface UserSubcategory {
  id: number;
  uuid: string;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  status: SubcategoryStatus;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubcategoryWithCategory extends UserSubcategory {
  category?: {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    icon: string | null;
    status: SubcategoryStatus;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type GetSubcategoriesResponse =
  ApiResponse<UserSubcategoryWithCategory[]>;

export type GetSubcategoryByIdResponse =
  ApiResponse<UserSubcategoryWithCategory>;

export type GetSubcategoriesByCategoryIdResponse =
  ApiResponse<UserSubcategoryWithCategory[]>;
