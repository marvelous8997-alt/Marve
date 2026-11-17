
import {
  createInquiryApi,
  getInquiriesApi,
  getInquiryByIdApi,
} from "@/src/api/user/inquiry.api";

import type {
  CreateInquiryPayload,
  CreateInquiryResponse,
  GetInquiriesResponse,
  GetInquiryByIdResponse,
} from "@/src/types/user/inquiry.types";

// Create Inquiry Service
export const createInquiryService = async (
  payload: CreateInquiryPayload
): Promise<CreateInquiryResponse> => {
  return await createInquiryApi(payload);
};

// Get All Inquiries Service
// Use only with an authorized admin API.
export const getInquiriesService =
  async (): Promise<GetInquiriesResponse> => {
    return await getInquiriesApi();
  };

// Get Inquiry By ID Service
// Use only with an authorized API and proper access checks.
export const getInquiryByIdService = async (
  id: number | string
): Promise<GetInquiryByIdResponse> => {
  return await getInquiryByIdApi(id);
};
