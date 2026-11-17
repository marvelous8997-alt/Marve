
"use client";

import {
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  createInquiryService,
  getInquiriesService,
  getInquiryByIdService,
} from "@/src/services/user/inquiry.service";

import type {
  CreateInquiryPayload,
  UserInquiry,
} from "@/src/types/user/inquiry.types";
import { createInquirySchema } from "@/src/validations/user/inquiry.validation";

const getInquiryErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Please check the inquiry details.";
    }

    if (status === 404) {
      return serverMessage || "Inquiry not found.";
    }

    if (status === 429) {
      return serverMessage || "Too many requests. Please try again later.";
    }

    if (status && status >= 500) {
      return "Something went wrong on the server. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

export default function useInquiry() {
  const [inquiries, setInquiries] = useState<UserInquiry[]>([]);
  const [inquiry, setInquiry] = useState<UserInquiry | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInquiry, setIsFetchingInquiry] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Create Inquiry
  // Create Inquiry with Zod Validation
  const submitInquiry = useCallback(
    async (payload: CreateInquiryPayload) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // Validate inquiry payload before API request
        const validation = createInquirySchema.safeParse({
          firstName: payload.firstName,
          lastName: payload.lastName ?? "",
          email: payload.email,
          phone: payload.phone ?? "",
          subject: payload.subject,
          message: payload.message,
        });

        if (!validation.success) {
          const message =
            validation.error.issues[0]?.message ??
            "Please check the inquiry details.";

          setError(message);
          toast.error(message);

          return null;
        }

        // Prepare validated payload
        const validatedPayload: CreateInquiryPayload = {
          firstName: validation.data.firstName,
          lastName: validation.data.lastName || undefined,
          email: validation.data.email,
          phone: validation.data.phone || undefined,
          subject: validation.data.subject,
          message: validation.data.message,
        };

        // Submit validated inquiry to backend
        const response = await createInquiryService(validatedPayload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to submit your inquiry."
          );
        }

        setInquiry(response.data);

        toast.success(
          response.message ||
            "Your inquiry has been submitted successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getInquiryErrorMessage(
          err,
          "Unable to submit your inquiry. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  // Get All Inquiries
  // Use only with an authorized admin API.
  const fetchInquiries = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getInquiriesService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch inquiries."
          );
        }

        setInquiries(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getInquiryErrorMessage(
          err,
          "Unable to fetch inquiries. Please try again."
        );

        setError(message);

        if (showErrorToast) {
          toast.error(message);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Inquiry By ID
  // Use only with an authorized API.
  const fetchInquiryById = useCallback(
    async (id: number | string) => {
      setIsFetchingInquiry(true);
      setError(null);
      setInquiry(null);

      try {
        const response = await getInquiryByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch inquiry."
          );
        }

        setInquiry(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getInquiryErrorMessage(
          err,
          "Unable to fetch inquiry. Please try again."
        );

        setError(message);
        return null;
      } finally {
        setIsFetchingInquiry(false);
      }
    },
    []
  );

  // Refresh Inquiries
  const refreshInquiries = useCallback(async () => {
    return await fetchInquiries(true);
  }, [fetchInquiries]);

  // Clear Error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    inquiries,
    inquiry,
    isSubmitting,
    isLoading,
    isFetchingInquiry,
    error,
    submitInquiry,
    fetchInquiries,
    fetchInquiryById,
    refreshInquiries,
    clearError,
  };
}
