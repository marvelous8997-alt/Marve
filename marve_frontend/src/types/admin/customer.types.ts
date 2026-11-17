
/* =========================================================
   CUSTOMER STATUS
========================================================= */

export type CustomerStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "BLOCKED";

export type CustomerStatusFilter =
  | "ALL"
  | CustomerStatus;

/* =========================================================
   CUSTOMER
========================================================= */

export interface Customer {
  id: number | string;
  uuid?: string;

  firstName: string;
  lastName: string;

  first_name?: string;
  last_name?: string;

  email: string | null;
  phone?: string | null;
deliveryAddress?: CustomerDeliveryAddress | null;
  avatar?: string | null;
  image?: string | null;

  status: CustomerStatus;

  /* Verification */

  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  offersOptIn?: boolean;

  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  offers_opt_in?: boolean;

  /* Customer order statistics */

  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;

  total_orders?: number;
  completed_orders?: number;
  cancelled_orders?: number;
  total_spent?: number;

  /* Activity */

  lastLoginAt?: string | null;
  last_login_at?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}

/* =========================================================
   CUSTOMER FILTERS
========================================================= */

export interface CustomerFilters {
  page?: number;
  limit?: number;

  search?: string;
  status?: CustomerStatusFilter;

  sortBy?:
    | "firstName"
    | "lastName"
    | "email"
    | "status"
    | "createdAt"
    | "updatedAt";

  sortOrder?: "ASC" | "DESC";
}

/* =========================================================
   PAGINATION
========================================================= */

export interface CustomerPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   CUSTOMER LIST RESULT
========================================================= */

export interface CustomerListResult extends CustomerPagination {
  rows: Customer[];
}

/* =========================================================
   CUSTOMER STATUS COUNTS
========================================================= */

export interface CustomerStatusCounts {
  ALL: number;
  ACTIVE: number;
  INACTIVE: number;
  BLOCKED: number;
}

/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

export interface UpdateCustomerStatusData {
  status: CustomerStatus;
}

/* =========================================================
   API RESPONSE
========================================================= */

export interface CustomerApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


/* =========================================================
   CUSTOMER DELIVERY ADDRESS
========================================================= */

export interface CustomerDeliveryAddress {
  fullName: string;
  phone?: string | null;
  email?: string | null;
  pincode: string;
  houseNumber: string;
  address: string;
  locality: string;
  landmark?: string | null;
  city: string;
  state: string;
  addressType?: "HOME" | "FRIENDS" | "WORK" | "OTHER";
  isDefault?: boolean;
}