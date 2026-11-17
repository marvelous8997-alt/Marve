
import axiosInstance from "@/src/lib/axios";

import type {
  CreateInquiryPayload,
  CreateInquiryResponse,
  GetInquiriesResponse,
  GetInquiryByIdResponse,
} from "@/src/types/user/inquiry.types";

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  INQUIRY: {
    CREATE: "/user/inquiries",
    GET_ALL: "/user/inquiries",
    GET_BY_ID: (id: number | string) => `/user/inquiries/${id}`,
  },
};

// Create Inquiry API
export const createInquiryApi = async (
  payload: CreateInquiryPayload
): Promise<CreateInquiryResponse> => {
  const response = await axiosInstance.post<CreateInquiryResponse>(
    API.INQUIRY.CREATE,
    payload
  );

  return response.data;
};

// Get All Inquiries API
export const getInquiriesApi =
  async (): Promise<GetInquiriesResponse> => {
    const response =
      await axiosInstance.get<GetInquiriesResponse>(
        API.INQUIRY.GET_ALL
      );

    return response.data;
  };

// Get Inquiry By ID API
export const getInquiryByIdApi = async (
  id: number | string
): Promise<GetInquiryByIdResponse> => {
  const response =
    await axiosInstance.get<GetInquiryByIdResponse>(
      API.INQUIRY.GET_BY_ID(id)
    );

  return response.data;
};
