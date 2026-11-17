import {
  getInquiriesApi,
  getInquiryApi,
  updateInquiryStatusApi,
  deleteInquiryApi,
} from "@/src/api/admin/inquiry.api";

import type {
  GetInquiryApiResponse,
  GetInquiriesApiResponse,
  GetInquiriesParams,
  UpdateInquiryStatusRequest,
  UpdateInquiryStatusApiResponse,
  DeleteInquiryApiResponse,
} from "@/src/types/admin/inquiry.types";

// =========================
// GET INQUIRIES
// =========================

export const getInquiriesService = async (
  params: GetInquiriesParams = {}
): Promise<GetInquiriesApiResponse> => {
  return await getInquiriesApi(params);
};

// =========================
// GET INQUIRY DETAILS
// =========================

export const getInquiryDetailsService = async (
  identifier: string | number
): Promise<GetInquiryApiResponse> => {
  return await getInquiryApi(identifier);
};

// =========================
// UPDATE INQUIRY STATUS
// =========================

export const updateInquiryStatusService = async (
  identifier: string | number,
  values: UpdateInquiryStatusRequest
): Promise<UpdateInquiryStatusApiResponse> => {
  return await updateInquiryStatusApi(identifier, values);
};

// =========================
// DELETE INQUIRY
// =========================

export const deleteInquiryService = async (
  identifier: string | number
): Promise<DeleteInquiryApiResponse> => {
  return await deleteInquiryApi(identifier);
};