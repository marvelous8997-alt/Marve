
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  createProductVariationService,
  bulkCreateProductVariationsService,
  getProductVariationsService,
  getProductVariationDetailsService,
  updateProductVariationService,
  updateProductVariationStatusService,
  deleteProductVariationService,
} from "@/src/services/admin/productVariation.service";

import type {
  ProductVariation,
  ProductVariationFilters,
} from "@/src/types/admin/productVariation.types";

import type {
  CreateProductVariationFormValues,
  BulkCreateProductVariationsFormValues,
  UpdateProductVariationFormValues,
  UpdateProductVariationStatusFormValues,
} from "@/src/validations/admin/productVariation.validation";

// PRODUCT VARIATION ERROR HANDLER
const getProductVariationErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your product variation details."
    );
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid product variation details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage product variations."
      );
    }

    if (status === 404) {
      return serverMessage || "Product variation or product not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A variation with these details already exists."
      );
    }

    if (status === 422) {
      return (
        serverMessage ||
        "Please check your product variation details."
      );
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

// PRODUCT VARIATION HOOK
export default function useProductVariation() {
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // FETCH PRODUCT VARIATIONS
  const fetchProductVariations = useCallback(
    async (params: ProductVariationFilters = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getProductVariationsService(params);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch product variations."
          );
        }

        const result = response.data;
        const rows = Array.isArray(result.rows) ? result.rows : [];

        setVariations(rows);

        const count = Number(result.count ?? rows.length);
        const page = Number(result.page ?? params.page ?? 1);
        const limit = Number(result.limit ?? params.limit ?? 10);

        const safeCount =
          Number.isFinite(count) && count >= 0 ? count : rows.length;

        const safePage =
          Number.isFinite(page) && page > 0 ? page : 1;

        const safeLimit =
          Number.isFinite(limit) && limit > 0 ? limit : 10;

        const totalPages = Number(
          result.totalPages ?? Math.ceil(safeCount / safeLimit)
        );

        setPagination({
          count: safeCount,
          page: safePage,
          limit: safeLimit,
          totalPages:
            Number.isFinite(totalPages) && totalPages >= 0
              ? totalPages
              : Math.ceil(safeCount / safeLimit),
        });

        return result;
      } catch (err: unknown) {
        const message = getProductVariationErrorMessage(
          err,
          "Unable to fetch product variations."
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

  // FETCH PRODUCT VARIATION DETAILS
  const fetchProductVariationDetails = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getProductVariationDetailsService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch product variation details."
          );
        }

        setSelectedVariation(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getProductVariationErrorMessage(
          err,
          "Unable to fetch product variation details."
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

  // CREATE PRODUCT VARIATION
  const createProductVariation = useCallback(
    async (values: CreateProductVariationFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await createProductVariationService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create product variation."
          );
        }

        const createdVariation = response.data;

        setVariations((previous) => [
          createdVariation,
          ...previous,
        ]);

        setPagination((previous) => ({
          ...previous,
          count: previous.count + 1,
        }));

        toast.success(
          response.message || "Product variation created successfully."
        );

        return createdVariation;
      } catch (err: unknown) {
        const message = getProductVariationErrorMessage(
          err,
          "Unable to create product variation."
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

  // =====================================================
// BULK CREATE PRODUCT VARIATIONS
// =====================================================

const bulkCreateProductVariations = useCallback(
  async (values: BulkCreateProductVariationsFormValues) => {
    setIsBulkCreating(true);
    setError(null);

    try {
      const response =
        await bulkCreateProductVariationsService(values);

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to create product variations."
        );
      }

      const createdVariations = response.data;

      // Update the current variations list.
      setVariations((previous) => [
        ...createdVariations,
        ...previous.filter(
          (existing) =>
            !createdVariations.some(
              (created) => created.uuid === existing.uuid
            )
        ),
      ]);

      // Update pagination count.
      setPagination((previous) => ({
        ...previous,
        count: previous.count + createdVariations.length,
      }));

      toast.success(
        response.message ||
          `${createdVariations.length} product variations created successfully.`
      );

      return createdVariations;
    } catch (err: unknown) {
      const message = getProductVariationErrorMessage(
        err,
        "Unable to create product variations."
      );

      setError(message);
      toast.error(message);

      throw err;
    } finally {
      setIsBulkCreating(false);
    }
  },
  []
);

  // UPDATE PRODUCT VARIATION
  const updateProductVariation = useCallback(
    async (
      uuid: string,
      values: UpdateProductVariationFormValues
    ) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await updateProductVariationService(
          uuid,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update product variation."
          );
        }

        const updatedVariation = response.data;

        setVariations((previous) =>
          previous.map((variation) =>
            variation.uuid === uuid ? updatedVariation : variation
          )
        );

        setSelectedVariation((previous) =>
          previous?.uuid === uuid ? updatedVariation : previous
        );

        toast.success(
          response.message || "Product variation updated successfully."
        );

        return updatedVariation;
      } catch (err: unknown) {
        const message = getProductVariationErrorMessage(
          err,
          "Unable to update product variation."
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

  // UPDATE PRODUCT VARIATION STATUS
  const updateProductVariationStatus = useCallback(
    async (
      uuid: string,
      values: UpdateProductVariationStatusFormValues
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const response = await updateProductVariationStatusService(
          uuid,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update product variation status."
          );
        }

        const updatedVariation = response.data;

        setVariations((previous) =>
          previous.map((variation) =>
            variation.uuid === uuid ? updatedVariation : variation
          )
        );

        setSelectedVariation((previous) =>
          previous?.uuid === uuid ? updatedVariation : previous
        );

        toast.success(
          response.message ||
            "Product variation status updated successfully."
        );

        return updatedVariation;
      } catch (err: unknown) {
        const message = getProductVariationErrorMessage(
          err,
          "Unable to update product variation status."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    []
  );

  // DELETE PRODUCT VARIATION
  const deleteProductVariation = useCallback(
    async (uuid: string) => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await deleteProductVariationService(uuid);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to delete product variation."
          );
        }

        setVariations((previous) =>
          previous.filter((variation) => variation.uuid !== uuid)
        );

        setSelectedVariation((previous) =>
          previous?.uuid === uuid ? null : previous
        );

        setPagination((previous) => ({
          ...previous,
          count: Math.max(0, previous.count - 1),
        }));

        toast.success(
          response.message || "Product variation deleted successfully."
        );

        return response;
      } catch (err: unknown) {
        const message = getProductVariationErrorMessage(
          err,
          "Unable to delete product variation."
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

  // CLEAR SELECTED VARIATION
  const clearSelectedVariation = useCallback(() => {
    setSelectedVariation(null);
  }, []);

  // CLEAR ERROR
  const clearError = useCallback(() => {
    setError(null);
  }, []);

return {
  variations,
  selectedVariation,
  pagination,

  isLoading,
  isSubmitting,
  isBulkCreating,
  isDeleting,
  isUpdatingStatus,
  error,

  fetchProductVariations,
  fetchProductVariationDetails,
  createProductVariation,
  bulkCreateProductVariations,
  updateProductVariation,
  updateProductVariationStatus,
  deleteProductVariation,

  clearSelectedVariation,
  clearError,
};
}