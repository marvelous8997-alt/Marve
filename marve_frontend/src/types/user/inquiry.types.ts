
export type InquiryStatus = "NEW" | "READ" | "RESOLVED";

export type InquirySubject =
  | "ORDER"
  | "PRODUCT"
  | "DELIVERY"
  | "RETURN"
  | "OTHER";

export interface UserInquiry {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  subject: InquirySubject;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  subject: InquirySubject;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

export type CreateInquiryResponse = ApiResponse<UserInquiry>;

export type GetInquiriesResponse = ApiResponse<UserInquiry[]>;

export type GetInquiryByIdResponse = ApiResponse<UserInquiry>;
