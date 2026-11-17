
/* ========================= Status & Discount Types ========================= */

/* ========================= Status & Discount Types ========================= */

export type DiscountCouponStatus = "ACTIVE" | "INACTIVE";

export type CouponDisplayStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "SCHEDULED";

export type DiscountType = "PERCENTAGE" | "FIXED";

/* ========================= Main Entity ========================= */

export interface DiscountCoupon {
  id: number | string;
  uuid: string;

  code: string;
  name: string;
  description?: string | null;

  discountType: DiscountType;
  discountValue: number | string;

  maximumDiscount?: number | string | null;
  minimumOrderValue?: number | string | null;

  usageLimit?: number | null;
  usageCount: number;
  perCustomerLimit?: number | null;

  startDate: string;
  endDate: string;

  status: DiscountCouponStatus;
  display_status?: CouponDisplayStatus;
  sortOrder: number;

  // Optional snake_case fields if returned by the backend
  discount_type?: DiscountType;
  discount_value?: number | string;
  maximum_discount?: number | string | null;
  minimum_order_value?: number | string | null;
  usage_limit?: number | null;
  usage_count?: number;
  per_customer_limit?: number | null;
  start_date?: string;
  end_date?: string;
  sort_order?: number;

  createdAt?: string;
  updatedAt?: string;
  created_by?: number | string | null;
  updated_by?: number | string | null;
}

/* ========================= Create Request ========================= */

export interface CreateDiscountCouponRequest {
  code: string;
  name: string;
  description?: string | null;

  discountType: DiscountType;
  discountValue: number;

  maximumDiscount?: number | null;
  minimumOrderValue?: number | null;

  usageLimit?: number | null;
  perCustomerLimit?: number | null;

  startDate: string;
  endDate: string;

  status?: DiscountCouponStatus;
  sortOrder?: number;
}

/* ========================= Update Request ========================= */

export interface UpdateDiscountCouponRequest {
  code?: string;
  name?: string;
  description?: string | null;

  discountType?: DiscountType;
  discountValue?: number;

  maximumDiscount?: number | null;
  minimumOrderValue?: number | null;

  usageLimit?: number | null;
  perCustomerLimit?: number | null;

  startDate?: string;
  endDate?: string;

  status?: DiscountCouponStatus;
  sortOrder?: number;
}

/* ========================= Status Request ========================= */

export interface UpdateDiscountCouponStatusRequest {
  status: DiscountCouponStatus;
}

/* ========================= List Query Params ========================= */

export interface GetDiscountCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CouponDisplayStatus;
  discountType?: DiscountType;
  sortBy?:
    | "code"
    | "name"
    | "discount_type"
    | "discount_value"
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

export interface DiscountCouponPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetDiscountCouponsResponseData
  extends DiscountCouponPagination {
  rows: DiscountCoupon[];
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

export type CreateDiscountCouponApiResponse =
  ApiResponse<DiscountCoupon>;

export type GetDiscountCouponApiResponse =
  ApiResponse<DiscountCoupon>;

export type GetDiscountCouponsApiResponse =
  ApiResponse<GetDiscountCouponsResponseData>;

export type UpdateDiscountCouponApiResponse =
  ApiResponse<DiscountCoupon>;

export type UpdateDiscountCouponStatusApiResponse =
  ApiResponse<DiscountCoupon>;

export type DeleteDiscountCouponApiResponse =
  ApiResponse<null>;

/* ========================= Dropdown ========================= */

export type ActiveDiscountCouponOption = Pick<
  DiscountCoupon,
  | "id"
  | "uuid"
  | "code"
  | "name"
  | "discountType"
  | "discountValue"
  | "status"
>;

export type GetActiveDiscountCouponsForDropdownApiResponse =
  ApiResponse<ActiveDiscountCouponOption[]>;
