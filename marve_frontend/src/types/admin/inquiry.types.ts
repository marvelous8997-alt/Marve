// =========================
// Inquiry Enums / Types
// =========================

export type InquiryStatus = "NEW" | "READ" | "RESOLVED";

export type InquirySubject =
  | "ORDER"
  | "PRODUCT"
  | "DELIVERY"
  | "RETURN"
  | "OTHER";

// =========================
// Inquiry Interface
// =========================

export interface Inquiry {
  id: number | string;
  uuid: string;

  firstName: string;
  lastName?: string | null;

  // Raw database field compatibility, if needed.
  first_name?: string;
  last_name?: string | null;

  email: string;
  phone?: string | null;

  subject: InquirySubject;
  message: string;
  status: InquiryStatus;

  createdAt?: string;
  updatedAt?: string;
}

// =========================
// Update Inquiry Status
// =========================

export interface UpdateInquiryStatusRequest {
  status: InquiryStatus;
}

// =========================
// Get Inquiries Params
// =========================

export interface GetInquiriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InquiryStatus;
  subject?: InquirySubject;
  sortBy?:
    | "first_name"
    | "last_name"
    | "email"
    | "subject"
    | "status"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

// =========================
// Pagination
// =========================

export interface InquiryPagination {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =========================
// API Response Data
// =========================

export interface GetInquiriesResponseData
  extends InquiryPagination {
  rows: Inquiry[];
}

// =========================
// Generic API Response
// =========================

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

// =========================
// API Response Types
// =========================

export type GetInquiryApiResponse = ApiResponse<Inquiry>;

export type GetInquiriesApiResponse =
  ApiResponse<GetInquiriesResponseData>;

export type UpdateInquiryStatusApiResponse =
  ApiResponse<Inquiry>;

export type DeleteInquiryApiResponse = ApiResponse<null>;