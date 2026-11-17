"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getCategoriesService,
  getCategoryByIdService,
} from "@/src/services/user/category.service";

import type {
  UserCategory,
} from "@/src/types/user/category.types";

const getCategoryErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return serverMessage || "Category not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid category request.";
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

export default function useCategory() {
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [category, setCategory] = useState<UserCategory | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get All Active Categories
  const fetchCategories = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCategoriesService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch categories."
          );
        }

        setCategories(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to fetch categories. Please try again."
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

  // Get Active Category By ID
  const fetchCategoryById = useCallback(
    async (id: number | string) => {
      setIsFetchingCategory(true);
      setError(null);
      setCategory(null);

      try {
        const response = await getCategoryByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch category."
          );
        }

        setCategory(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to fetch category. Please try again."
        );

        setError(message);
        return null;
      } finally {
        setIsFetchingCategory(false);
      }
    },
    []
  );

  // Refresh Categories
  const refreshCategories = useCallback(async () => {
    return await fetchCategories(true);
  }, [fetchCategories]);

  // Initial Categories Fetch
  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  // Clear Error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    categories,
    category,
    isLoading,
    isFetchingCategory,
    error,
    fetchCategories,
    fetchCategoryById,
    refreshCategories,
    clearError,
  };
}