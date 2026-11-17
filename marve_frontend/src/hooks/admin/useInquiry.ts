"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
  getInquiriesService,
  getInquiryDetailsService,
  updateInquiryStatusService,
  deleteInquiryService,
} from "@/src/services/admin/inquiry.service";

import type {
  Inquiry,
  GetInquiriesParams,
  InquiryStatus,
} from "@/src/types/admin/inquiry.types";

// =========================
// ERROR MESSAGE HANDLER
// =========================

const getInquiryErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid inquiry details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage inquiries."
      );
    }

    if (status === 404) {
      return serverMessage || "Inquiry not found.";
    }

    if (status === 422) {
      return serverMessage || "Please check the inquiry details.";
    }

    if (status === 429) {
      return (
        serverMessage ||
        "Too many requests. Please try again later."
      );
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

// =========================
// USE INQUIRY HOOK
// =========================

export default function useInquiry() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] =
    useState<Inquiry | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // FETCH INQUIRIES
  // =========================

  const fetchInquiries = useCallback(
    async (params: GetInquiriesParams = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getInquiriesService(params);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch inquiries."
          );
        }

        const mappedInquiries = response.data.rows.map(
          (inquiry) => ({
            ...inquiry,
            firstName:
              inquiry.firstName ?? inquiry.first_name ?? "",
            lastName:
              inquiry.lastName ?? inquiry.last_name ?? "",
          })
        );

        setInquiries(mappedInquiries);

        setPagination({
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });

        return {
          ...response.data,
          rows: mappedInquiries,
        };
      } catch (err: unknown) {
        const message = getInquiryErrorMessage(
          err,
          "Unable to fetch inquiries."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // =========================
  // FETCH INQUIRY DETAILS
  // =========================

  const fetchInquiryDetails = useCallback(
    async (identifier: string | number) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getInquiryDetailsService(identifier);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch inquiry details."
          );
        }

        const data = response.data;

        const mappedInquiry: Inquiry = {
          ...data,
          firstName: data.firstName ?? data.first_name ?? "",
          lastName: data.lastName ?? data.last_name ?? "",
        };

        setSelectedInquiry(mappedInquiry);

        return mappedInquiry;
      } catch (err: unknown) {
        const message = getInquiryErrorMessage(
          err,
          "Unable to fetch inquiry details."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // =========================
  // UPDATE INQUIRY STATUS
  // =========================

  const updateInquiryStatus = useCallback(
    async (
      identifier: string | number,
      status: InquiryStatus
    ) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await updateInquiryStatusService(
          identifier,
          { status }
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update inquiry status."
          );
        }

        const data = response.data;

        const updatedInquiry: Inquiry = {
          ...data,
          firstName: data.firstName ?? data.first_name ?? "",
          lastName: data.lastName ?? data.last_name ?? "",
        };

        setInquiries((previous) =>
          previous.map((inquiry) =>
            String(inquiry.id) === String(updatedInquiry.id) ||
            (inquiry.uuid &&
              inquiry.uuid === updatedInquiry.uuid)
              ? updatedInquiry
              : inquiry
          )
        );

        setSelectedInquiry((previous) =>
          previous &&
          (String(previous.id) === String(updatedInquiry.id) ||
            (previous.uuid &&
              previous.uuid === updatedInquiry.uuid))
            ? updatedInquiry
            : previous
        );

        toast.success(
          response.message ||
            "Inquiry status updated successfully."
        );

        return updatedInquiry;
      } catch (err: unknown) {
        const message = getInquiryErrorMessage(
          err,
          "Unable to update inquiry status."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  // =========================
  // DELETE INQUIRY
  // =========================

  const deleteInquiry = useCallback(
    async (identifier: string | number) => {
      setIsDeleting(true);
      setError(null);

      try {
        const response =
          await deleteInquiryService(identifier);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to delete inquiry."
          );
        }

        setInquiries((previous) =>
          previous.filter(
            (inquiry) =>
              String(inquiry.id) !== String(identifier) &&
              inquiry.uuid !== identifier
          )
        );

        setSelectedInquiry((previous) =>
          previous &&
          (String(previous.id) === String(identifier) ||
            previous.uuid === identifier)
            ? null
            : previous
        );

        setPagination((previous) => ({
          ...previous,
          count: Math.max(0, previous.count - 1),
        }));

        toast.success(
          response.message || "Inquiry deleted successfully."
        );

        return response;
      } catch (err: unknown) {
        const message = getInquiryErrorMessage(
          err,
          "Unable to delete inquiry."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  // =========================
  // CLEAR SELECTED INQUIRY
  // =========================

  const clearSelectedInquiry = useCallback(() => {
    setSelectedInquiry(null);
  }, []);

  // =========================
  // CLEAR ERROR
  // =========================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    inquiries,
    selectedInquiry,
    pagination,

    isLoading,
    isSubmitting,
    isDeleting,
    error,

    fetchInquiries,
    fetchInquiryDetails,
    updateInquiryStatus,
    deleteInquiry,

    clearSelectedInquiry,
    clearError,
  };
}