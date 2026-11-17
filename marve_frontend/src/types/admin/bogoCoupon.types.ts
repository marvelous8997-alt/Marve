
/* ========================= Status Types ========================= */

export type BogoCouponStatus = "ACTIVE" | "INACTIVE";

export type CouponDisplayStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "SCHEDULED";

/* ========================= Product Types ========================= */

export interface BogoCouponProduct {
  id: number | string;
  uuid?: string;

  name: string;
  slug?: string;
  sku?: string | null;

  price?: number | string;
  salePrice?: number | string | null;

  image?: string | null;
  status?: "ACTIVE" | "INACTIVE";

  // Optional snake_case fields if returned by the backend
  sale_price?: number | string | null;
  image_url?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

/* ========================= Coupon Product Mapping ========================= */

export interface BogoCouponProductMapping {
  id: number | string;
  bogo_coupon_id?: number | string;
  product_id?: number | string;

  productId?: number | string;
  bogoCouponId?: number | string;

  product?: BogoCouponProduct;

  createdAt?: string;
  updatedAt?: string;
}

/* ========================= Main Entity ========================= */

export interface BogoCoupon {
  id: number | string;
  uuid: string;

  code: string;
  name: string;
  description?: string | null;

  buyQuantity: number;
  getQuantity: number;

  minimumOrderValue?: number | string | null;

  usageLimit?: number | null;
  usageCount: number;
  perCustomerLimit?: number | null;

  startDate: string;
  endDate: string;

  status: BogoCouponStatus;
  display_status?: CouponDisplayStatus;
  sortOrder: number;

  // Eligible products for Buy and Get
  buyProducts: BogoCouponProductMapping[];
  getProducts: BogoCouponProductMapping[];

  // Optional snake_case fields if returned by the backend
  buy_quantity?: number;
  get_quantity?: number;

  minimum_order_value?: number | string | null;

  usage_limit?: number | null;
  usage_count?: number;
  per_customer_limit?: number | null;

  start_date?: string;
  end_date?: string;
  sort_order?: number;

  buy_products?: BogoCouponProductMapping[];
  get_products?: BogoCouponProductMapping[];

  createdAt?: string;
  updatedAt?: string;

  created_by?: number | string | null;
  updated_by?: number | string | null;
}

/* ========================= Create Request ========================= */

export interface CreateBogoCouponRequest {
  code: string;
  name: string;
  description?: string | null;

  buyQuantity: number;
  getQuantity: number;

  minimumOrderValue?: number | null;

  usageLimit?: number | null;
  perCustomerLimit?: number | null;

  startDate: string;
  endDate: string;

  status?: BogoCouponStatus;
  sortOrder?: number;

  // Product IDs selected in the admin form
  buyProductIds: Array<number | string>;
  getProductIds: Array<number | string>;
}

/* ========================= Update Request ========================= */

export interface UpdateBogoCouponRequest {
  code?: string;
  name?: string;
  description?: string | null;

  buyQuantity?: number;
  getQuantity?: number;

  minimumOrderValue?: number | null;

  usageLimit?: number | null;
  perCustomerLimit?: number | null;

  startDate?: string;
  endDate?: string;

  status?: BogoCouponStatus;
  sortOrder?: number;

  buyProductIds?: Array<number | string>;
  getProductIds?: Array<number | string>;
}

/* ========================= Status Request ========================= */

export interface UpdateBogoCouponStatusRequest {
  status: BogoCouponStatus;
}

/* ========================= List Query Params ========================= */

export interface GetBogoCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CouponDisplayStatus;

  sortBy?:
    | "code"
    | "name"
    | "buy_quantity"
    | "get_quantity"
    | "minimum_order_value"
    | "usage_count"
    | "start_date"
    | "end_date"
    | "status"
    | "sort_order"
    | "createdAt"
    | "updatedAt";

  sortOrder?: "ASC" | "DESC";
}

/* ========================= Pagination ========================= */

export interface BogoCouponPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetBogoCouponsResponseData
  extends BogoCouponPagination {
  rows: BogoCoupon[];
}

/* ========================= API Response ========================= */

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type CreateBogoCouponApiResponse =
  ApiResponse<BogoCoupon>;

export type GetBogoCouponApiResponse =
  ApiResponse<BogoCoupon>;

export type GetBogoCouponsApiResponse =
  ApiResponse<GetBogoCouponsResponseData>;

export type UpdateBogoCouponApiResponse =
  ApiResponse<BogoCoupon>;

export type UpdateBogoCouponStatusApiResponse =
  ApiResponse<BogoCoupon>;

export type DeleteBogoCouponApiResponse =
  ApiResponse<null>;

/* ========================= Dropdown ========================= */

export type ActiveBogoCouponOption = Pick<
  BogoCoupon,
  | "id"
  | "uuid"
  | "code"
  | "name"
  | "buyQuantity"
  | "getQuantity"
  | "status"
>;

export type GetActiveBogoCouponsForDropdownApiResponse =
  ApiResponse<ActiveBogoCouponOption[]>;
