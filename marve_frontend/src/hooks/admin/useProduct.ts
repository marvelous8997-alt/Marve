"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
  createProductService,
  getProductsService,
  getProductDetailsService,
  updateProductService,
  updateProductStatusService,
  removeProductVideoService,
  deleteProductService,
} from "@/src/services/admin/product.service";
import type {
  Product,
  ProductFilters,
} from "@/src/types/admin/product.types";
import type {
  CreateProductFormValues,
  UpdateProductFormValues,
  UpdateProductStatusFormValues,
} from "@/src/validations/admin/product.validation";

const getProductErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return err.issues[0]?.message || "Please check your product details.";
  }
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;
    if (status === 400) {
      return serverMessage || "Invalid product details or media.";
    }
    if (status === 401) {
      return serverMessage || "Please log in again.";
    }
    if (status === 403) {
      return serverMessage || "You do not have permission to manage products.";
    }
    if (status === 404) {
      return serverMessage || "Product not found.";
    }
    if (status === 409) {
      return serverMessage || "A product with these details already exists.";
    }
    if (status === 413) {
      return serverMessage || "An uploaded file exceeds the allowed size.";
    }
    if (status === 422) {
      return serverMessage || "Please check your product details.";
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

export default function useProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isRemovingVideo, setIsRemovingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchProducts = useCallback(
  async (params: ProductFilters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProductsService(params);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to fetch products."
        );
      }
      const result = response.data;
      type ProductListData = {
        rows?: Product[];
        products?: Product[];
        count?: number;
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
        pagination?: {
          total?: number;
          count?: number;
          page?: number;
          limit?: number;
          totalPages?: number;
        };
      };
      const resultObject: ProductListData | null =
        Array.isArray(result)
          ? null
          : (result as unknown as ProductListData);
      const rows: Product[] = Array.isArray(result)
        ? result
        : Array.isArray(resultObject?.rows)
          ? resultObject.rows
          : Array.isArray(resultObject?.products)
            ? resultObject.products
            : [];
      setProducts(rows);
      if (resultObject) {
        const meta = resultObject.pagination ?? resultObject;
        const total = Number(
          meta.total ?? meta.count ?? resultObject.count ?? rows.length
        );
        const page = Number(
          meta.page ?? params.page ?? pagination.page
        );
        const limit = Number(
          meta.limit ?? params.limit ?? pagination.limit
        );
        const safeLimit = Math.max(
          Number.isFinite(limit) ? limit : 10,
          1
        );
        setPagination({
          count: Number.isFinite(total) ? total : rows.length,
          page: Number.isFinite(page) && page > 0 ? page : 1,
          limit: safeLimit,
          totalPages: Number(
            meta.totalPages ??
              Math.ceil(
                (Number.isFinite(total) ? total : rows.length) /
                  safeLimit
              )
          ),
        });
      } else {
        setPagination((previous) => ({
          ...previous,
          count: rows.length,
          totalPages: Math.ceil(
            rows.length / Math.max(previous.limit, 1)
          ),
        }));
      }
      return result;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to fetch products."
      );
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  },
  [pagination.page, pagination.limit]
);

  const fetchProductDetails = useCallback(async (uuid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProductDetailsService(uuid);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to fetch product details."
        );
      }
      setSelectedProduct(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to fetch product details."
      );
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (values: CreateProductFormValues) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await createProductService(values);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create product."
          );
        }
        const createdProduct = response.data;
        setProducts((previous) => [
          createdProduct,
          ...(Array.isArray(previous) ? previous : []),
        ]);
        setPagination((previous) => ({
          ...previous,
          count: previous.count + 1,
        }));
        toast.success(
          response.message || "Product created successfully."
        );
        return createdProduct;
      } catch (err: unknown) {
        const message = getProductErrorMessage(
          err,
          "Unable to create product."
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

  const updateProduct = useCallback(
    async (uuid: string, values: UpdateProductFormValues) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await updateProductService(uuid, values);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update product."
          );
        }
        const updatedProduct = response.data;
        setProducts((previous) =>
          previous.map((product) =>
            product.uuid === uuid ? updatedProduct : product
          )
        );
        setSelectedProduct((previous) =>
          previous?.uuid === uuid ? updatedProduct : previous
        );
        toast.success(
          response.message || "Product updated successfully."
        );
        return updatedProduct;
      } catch (err: unknown) {
        const message = getProductErrorMessage(
          err,
          "Unable to update product."
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

  const updateProductStatus = useCallback(
    async (uuid: string, values: UpdateProductStatusFormValues) => {
      setIsUpdatingStatus(true);
      setError(null);
      try {
        const response = await updateProductStatusService(uuid, values);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update product status."
          );
        }
        const updatedProduct = response.data;
        setProducts((previous) =>
          previous.map((product) =>
            product.uuid === uuid ? updatedProduct : product
          )
        );
        setSelectedProduct((previous) =>
          previous?.uuid === uuid ? updatedProduct : previous
        );
        toast.success(
          response.message || "Product status updated successfully."
        );
        return updatedProduct;
      } catch (err: unknown) {
        const message = getProductErrorMessage(
          err,
          "Unable to update product status."
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

  const removeProductVideo = useCallback(async (uuid: string) => {
    setIsRemovingVideo(true);
    setError(null);
    try {
      const response = await removeProductVideoService(uuid);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to remove product video."
        );
      }
      const updatedProduct = response.data;
      setProducts((previous) =>
        previous.map((product) =>
          product.uuid === uuid ? updatedProduct : product
        )
      );
      setSelectedProduct((previous) =>
        previous?.uuid === uuid ? updatedProduct : previous
      );
      toast.success(
        response.message || "Product video removed successfully."
      );
      return updatedProduct;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to remove product video."
      );
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsRemovingVideo(false);
    }
  }, []);

  const deleteProduct = useCallback(async (uuid: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await deleteProductService(uuid);
      if (!response.success) {
        throw new Error(
          response.message || "Unable to delete product."
        );
      }
      setProducts((previous) =>
        previous.filter((product) => product.uuid !== uuid)
      );
      setSelectedProduct((previous) =>
        previous?.uuid === uuid ? null : previous
      );
      setPagination((previous) => ({
        ...previous,
        count: Math.max(0, previous.count - 1),
      }));
      toast.success(
        response.message || "Product deleted successfully."
      );
      return response;
    } catch (err: unknown) {
      const message = getProductErrorMessage(
        err,
        "Unable to delete product."
      );
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const clearSelectedProduct = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    products,
    selectedProduct,
    pagination,

    isLoading,
    isSubmitting,
    isDeleting,
    isUpdatingStatus,
    isRemovingVideo,
    error,

    fetchProducts,
    fetchProductDetails,
    createProduct,
    updateProduct,
    updateProductStatus,
    removeProductVideo,
    deleteProduct,

    clearSelectedProduct,
    clearError,
  };
}