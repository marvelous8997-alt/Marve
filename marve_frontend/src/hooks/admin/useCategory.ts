"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryDetailsService,
  getActiveCategoriesForDropdownService,
  updateCategoryService,
  updateCategoryStatusService,
  deleteCategoryService,
} from "@/src/services/admin/category.service";
import type {
  Category,
  GetCategoriesParams,
  ActiveCategoryOption,
} from "@/src/types/admin/category.types";
import type {
  CreateCategoryFormValues,
  UpdateCategoryFormValues,
  UpdateCategoryStatusFormValues,
} from "@/src/validations/admin/category.validation";

const getCategoryErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return err.issues[0]?.message || "Please check your category details.";
  }
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;
    if (status === 400) {
      return serverMessage || "Invalid category details.";
    }
    if (status === 401) {
      return serverMessage || "Please log in again.";
    }
    if (status === 403) {
      return serverMessage || "You do not have permission to manage categories.";
    }
    if (status === 404) {
      return serverMessage || "Category not found.";
    }
    if (status === 409) {
      return serverMessage || "A category with these details already exists.";
    }
    if (status === 413) {
      return "File size must be 10 MB or less. Please select a smaller image.";
    }
    if (status === 422) {
      return serverMessage || "Please check your category details.";
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

export default function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoriesForDropdown, setActiveCategoriesForDropdown] = useState<ActiveCategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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

  const fetchCategories = useCallback(
    async (params: GetCategoriesParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCategoriesService(params);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch categories."
          );
        }
  const mappedCategories = response.data.rows.map((category) => ({
    ...category,
    sortOrder: Number(
    category.sortOrder ?? category.sort_order ?? 0
    ),
  }));

    setCategories(mappedCategories);
        setPagination({
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
        return response.data;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to fetch categories."
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

const fetchActiveCategoriesForDropdown = useCallback(async () => {
  try {
    const response =
      await getActiveCategoriesForDropdownService();
    if (!response.success || !response.data) {
      throw new Error(
        response.message ||
          "Unable to fetch active categories."
      );
    }
    setActiveCategoriesForDropdown(
      response.data.filter(
        (category) => category.status === "ACTIVE"
      )
    );
    return response.data;
  } catch (err: unknown) {
    const message = getCategoryErrorMessage(
      err,
      "Unable to fetch active categories."
    );
    toast.error(message);
    throw err;
  }
}, []);

  const fetchCategoryDetails = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCategoryDetailsService(uuid);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch category details."
          );
        }
        setSelectedCategory(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to fetch category details."
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

  const createCategory = useCallback(
    async (values: CreateCategoryFormValues) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await createCategoryService(values);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create category."
          );
        }
        setCategories((previous) => [
          response.data!,
          ...previous,
        ]);
        toast.success(
          response.message || "Category created successfully."
        );
        return response.data;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to create category."
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

  const updateCategory = useCallback(
    async (
      uuid: string,
      values: UpdateCategoryFormValues
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await updateCategoryService(uuid, values);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update category."
          );
        }
        const updatedCategory = response.data;
        setCategories((previous) =>
          previous.map((category) =>
            category.uuid === uuid ? updatedCategory : category
          )
        );
        setSelectedCategory((previous) =>
          previous?.uuid === uuid ? updatedCategory : previous
        );
        toast.success(
          response.message || "Category updated successfully."
        );
        return updatedCategory;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to update category."
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

  const updateCategoryStatus = useCallback(
    async (
      uuid: string,
      values: UpdateCategoryStatusFormValues
    ) => {
      setError(null);
      try {
        const response = await updateCategoryStatusService(
          uuid,
          values
        );
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update category status."
          );
        }
        const updatedCategory = response.data;
        setCategories((previous) =>
          previous.map((category) =>
            category.uuid === uuid ? updatedCategory : category
          )
        );
        setSelectedCategory((previous) =>
          previous?.uuid === uuid ? updatedCategory : previous
        );
        toast.success(
          response.message || "Category status updated successfully."
        );
        return updatedCategory;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to update category status."
        );
        setError(message);
        toast.error(message);
        throw err;
      }
    },
    []
  );

  const deleteCategory = useCallback(
    async (uuid: string) => {
      setIsDeleting(true);
      setError(null);
      try {
        const response = await deleteCategoryService(uuid);
        if (!response.success) {
          throw new Error(
            response.message || "Unable to delete category."
          );
        }
        setCategories((previous) =>
          previous.filter((category) => category.uuid !== uuid)
        );
        setSelectedCategory((previous) =>
          previous?.uuid === uuid ? null : previous
        );
        setPagination((previous) => ({
          ...previous,
          count: Math.max(0, previous.count - 1),
        }));
        toast.success(
          response.message || "Category deleted successfully."
        );
        return response;
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(
          err,
          "Unable to delete category."
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

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    categories,
    activeCategoriesForDropdown,

    selectedCategory,
    pagination,

    isLoading,
    isSubmitting,
    isDeleting,
    error,

    fetchCategories,
    fetchActiveCategoriesForDropdown,
    fetchCategoryDetails,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,

    clearSelectedCategory,
    clearError,
  };
}