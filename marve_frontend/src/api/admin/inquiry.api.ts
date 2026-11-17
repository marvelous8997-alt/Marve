import axiosInstance from "@/src/lib/axios";

import type {
  GetInquiryApiResponse,
  GetInquiriesApiResponse,
  GetInquiriesParams,
  UpdateInquiryStatusRequest,
  UpdateInquiryStatusApiResponse,
  DeleteInquiryApiResponse,
} from "@/src/types/admin/inquiry.types";

// =========================
// API ENDPOINTS
// =========================

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  INQUIRY: {
    LIST: "/admin/inquiries/list",
    DETAILS: (identifier: string | number) =>
      `/admin/inquiries/list/${identifier}`,
    STATUS: (identifier: string | number) =>
      `/admin/inquiries/status/${identifier}`,
    DELETE: (identifier: string | number) =>
      `/admin/inquiries/${identifier}`,
  },
};

// =========================
// GET INQUIRIES API
// =========================

export const getInquiriesApi = async (
  params: GetInquiriesParams = {}
): Promise<GetInquiriesApiResponse> => {
  const response =
    await axiosInstance.get<GetInquiriesApiResponse>(
      API.INQUIRY.LIST,
      { params }
    );

  return response.data;
};

// =========================
// GET INQUIRY DETAILS API
// =========================

export const getInquiryApi = async (
  identifier: string | number
): Promise<GetInquiryApiResponse> => {
  const response =
    await axiosInstance.get<GetInquiryApiResponse>(
      API.INQUIRY.DETAILS(identifier)
    );

  return response.data;
};

// =========================
// UPDATE INQUIRY STATUS API
// =========================

export const updateInquiryStatusApi = async (
  identifier: string | number,
  payload: UpdateInquiryStatusRequest
): Promise<UpdateInquiryStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateInquiryStatusApiResponse>(
      API.INQUIRY.STATUS(identifier),
      payload
    );

  return response.data;
};

// =========================
// DELETE INQUIRY API
// =========================

export const deleteInquiryApi = async (
  identifier: string | number
): Promise<DeleteInquiryApiResponse> => {
  const response =
    await axiosInstance.delete<DeleteInquiryApiResponse>(
      API.INQUIRY.DELETE(identifier)
    );

  return response.data;
};