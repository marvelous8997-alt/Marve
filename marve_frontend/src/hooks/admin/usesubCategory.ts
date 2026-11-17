"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
  createSubcategoryService,
  getSubcategoriesService,
  getSubcategoryDetailsService,
  updateSubcategoryService,
  updateSubcategoryStatusService,
  deleteSubcategoryService,
} from "@/src/services/admin/subcategory.service";
import type {
  Subcategory,
  GetSubcategoriesParams,
} from "@/src/types/admin/subcategory.types";
import type {
  CreateSubcategoryFormValues,
  UpdateSubcategoryFormValues,
  UpdateSubcategoryStatusFormValues,
} from "@/src/validations/admin/subcategory.validation";

const getSubcategoryErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your subcategory details."
    );
  }
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;
    if (status === 400) {
      return serverMessage || "Invalid subcategory details.";
    }
    if (status === 401) {
      return serverMessage || "Please log in again.";
    }
    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage subcategories."
      );
    }
    if (status === 404) {
      return serverMessage || "Subcategory not found.";
    }
    if (status === 409) {
      return (
        serverMessage ||
        "A subcategory with these details already exists."
      );
    }
    if (status === 413) {
      return "File size must be 10 MB or less. Please select a smaller image.";
    }
    if (status === 422) {
      return (
        serverMessage ||
        "Please check your subcategory details."
      );
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

export default function useSubcategory() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
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

  const fetchSubcategories = useCallback(
    async (params: GetSubcategoriesParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getSubcategoriesService(params);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch subcategories."
          );
        }
        setSubcategories(response.data.rows);
        setPagination({
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
        return response.data;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to fetch subcategories."
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

  const fetchSubcategoryDetails = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getSubcategoryDetailsService(uuid);
        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch subcategory details."
          );
        }
        setSelectedSubcategory(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to fetch subcategory details."
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

  const createSubcategory = useCallback(
    async (values: CreateSubcategoryFormValues) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await createSubcategoryService(values);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create subcategory."
          );
        }
        setSubcategories((previous) => [
          response.data!,
          ...previous,
        ]);
        setPagination((previous) => ({
          ...previous,
          count: previous.count + 1,
        }));
        toast.success(
          response.message || "Subcategory created successfully."
        );
        return response.data;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to create subcategory."
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

  const updateSubcategory = useCallback(
    async (
      uuid: string,
      values: UpdateSubcategoryFormValues
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await updateSubcategoryService(
          uuid,
          values
        );
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update subcategory."
          );
        }
        const updatedSubcategory = response.data;
        setSubcategories((previous) =>
          previous.map((subcategory) =>
            subcategory.uuid === uuid
              ? updatedSubcategory
              : subcategory
          )
        );
        setSelectedSubcategory((previous) =>
          previous?.uuid === uuid
            ? updatedSubcategory
            : previous
        );
        toast.success(
          response.message || "Subcategory updated successfully."
        );
        return updatedSubcategory;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to update subcategory."
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

  const updateSubcategoryStatus = useCallback(
    async (
      uuid: string,
      values: UpdateSubcategoryStatusFormValues
    ) => {
      setError(null);
      try {
        const response = await updateSubcategoryStatusService(
          uuid,
          values
        );
        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update subcategory status."
          );
        }
        const updatedSubcategory = response.data;
        setSubcategories((previous) =>
          previous.map((subcategory) =>
            subcategory.uuid === uuid
              ? updatedSubcategory
              : subcategory
          )
        );
        setSelectedSubcategory((previous) =>
          previous?.uuid === uuid
            ? updatedSubcategory
            : previous
        );
        toast.success(
          response.message ||
            "Subcategory status updated successfully."
        );
        return updatedSubcategory;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to update subcategory status."
        );
        setError(message);
        toast.error(message);
        throw err;
      }
    },
    []
  );

  const deleteSubcategory = useCallback(
    async (uuid: string) => {
      setIsDeleting(true);
      setError(null);
      try {
        const response = await deleteSubcategoryService(uuid);
        if (!response.success) {
          throw new Error(
            response.message || "Unable to delete subcategory."
          );
        }
        setSubcategories((previous) =>
          previous.filter(
            (subcategory) => subcategory.uuid !== uuid
          )
        );
        setSelectedSubcategory((previous) =>
          previous?.uuid === uuid ? null : previous
        );
        setPagination((previous) => ({
          ...previous,
          count: Math.max(0, previous.count - 1),
        }));
        toast.success(
          response.message || "Subcategory deleted successfully."
        );
        return response;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to delete subcategory."
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

  const clearSelectedSubcategory = useCallback(() => {
    setSelectedSubcategory(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    subcategories,
    selectedSubcategory,
    pagination,

    isLoading,
    isSubmitting,
    isDeleting,
    error,

    fetchSubcategories,
    fetchSubcategoryDetails,
    createSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    deleteSubcategory,

    clearSelectedSubcategory,
    clearError,
  };
}