
"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getSubcategoriesService,
  getSubcategoryByIdService,
  getSubcategoriesByCategoryIdService,
} from "@/src/services/user/subcategory.service";

import type {
  UserSubcategory,
  UserSubcategoryWithCategory,
} from "@/src/types/user/subcategory.types";

const getSubcategoryErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return serverMessage || "Subcategory not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid subcategory request.";
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
  const [subcategories, setSubcategories] = useState<
    UserSubcategoryWithCategory[]
  >([]);

  const [subcategoriesByCategory, setSubcategoriesByCategory] =
    useState<UserSubcategoryWithCategory[]>([]);

  const [subcategory, setSubcategory] =
    useState<UserSubcategoryWithCategory | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSubcategory, setIsFetchingSubcategory] =
    useState(false);
  const [isFetchingByCategory, setIsFetchingByCategory] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  // Get All Active Subcategories
  const fetchSubcategories = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getSubcategoriesService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch subcategories."
          );
        }

        setSubcategories(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to fetch subcategories. Please try again."
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

  // Get Active Subcategory By ID
  const fetchSubcategoryById = useCallback(
    async (id: number | string) => {
      setIsFetchingSubcategory(true);
      setError(null);
      setSubcategory(null);

      try {
        const response = await getSubcategoryByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch subcategory."
          );
        }

        setSubcategory(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to fetch subcategory. Please try again."
        );

        setError(message);
        return null;
      } finally {
        setIsFetchingSubcategory(false);
      }
    },
    []
  );

  // Get Active Subcategories By Category ID
  const fetchSubcategoriesByCategoryId = useCallback(
    async (categoryId: number | string) => {
      setIsFetchingByCategory(true);
      setError(null);
      setSubcategoriesByCategory([]);

      try {
        const response =
          await getSubcategoriesByCategoryIdService(categoryId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch subcategories for this category."
          );
        }

        setSubcategoriesByCategory(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getSubcategoryErrorMessage(
          err,
          "Unable to fetch category subcategories. Please try again."
        );

        setError(message);
        return null;
      } finally {
        setIsFetchingByCategory(false);
      }
    },
    []
  );

  // Refresh All Subcategories
  const refreshSubcategories = useCallback(async () => {
    return await fetchSubcategories(true);
  }, [fetchSubcategories]);

  // Initial Subcategories Fetch
  useEffect(() => {
    void fetchSubcategories();
  }, [fetchSubcategories]);

  // Clear Error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    subcategories,
    subcategoriesByCategory,
    subcategory,

    isLoading,
    isFetchingSubcategory,
    isFetchingByCategory,

    error,

    fetchSubcategories,
    fetchSubcategoryById,
    fetchSubcategoriesByCategoryId,

    refreshSubcategories,
    clearError,
  };
}
