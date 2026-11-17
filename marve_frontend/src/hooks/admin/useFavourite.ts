
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
  getFavouritesService,
  getFavouriteDetailsService,
} from "@/src/services/admin/favourite.service";

import type {
  Favourite,
  GetFavouritesParams,
} from "@/src/types/admin/favourite.types";

// =========================
// ERROR MESSAGE HANDLER
// =========================

const getFavouriteErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid favourite request.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to view favourites."
      );
    }

    if (status === 404) {
      return serverMessage || "Favourite not found.";
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
// USE FAVOURITE HOOK
// =========================

export default function useFavourite() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);

  const [selectedFavourite, setSelectedFavourite] =
    useState<Favourite | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 8,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store the last list query so refresh preserves filters and page.
  const [lastParams, setLastParams] =
    useState<GetFavouritesParams>({
      page: 1,
      limit: 8,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });

  // =========================
  // FETCH FAVOURITES
  // =========================

  const fetchFavourites = useCallback(
    async (params: GetFavouritesParams = {}) => {
      const requestParams: GetFavouritesParams = {
        ...lastParams,
        ...params,
      };

      setLastParams(requestParams);
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getFavouritesService(requestParams);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch favourites."
          );
        }

        const rows = response.data.rows.map((favourite) => ({
          ...favourite,
          price: Number(favourite.price ?? 0),
          customerName: favourite.customerName ?? "",
          customerEmail: favourite.customerEmail ?? "",
          customerPhone: favourite.customerPhone ?? "",
          productName: favourite.productName ?? "",
          productSku: favourite.productSku ?? "",
          category: favourite.category ?? "",
        }));

        setFavourites(rows);

        setPagination({
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });

        return {
          ...response.data,
          rows,
        };
      } catch (err: unknown) {
        const message = getFavouriteErrorMessage(
          err,
          "Unable to fetch favourites."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [lastParams]
  );

  // =========================
  // REFRESH FAVOURITES
  // =========================

  const refreshFavourites = useCallback(async () => {
    setIsRefreshing(true);

    try {
      return await fetchFavourites(lastParams);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFavourites, lastParams]);

  // =========================
  // FETCH FAVOURITE DETAILS
  // =========================

  const fetchFavouriteDetails = useCallback(
    async (identifier: string | number) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getFavouriteDetailsService(identifier);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch favourite details."
          );
        }

        const favourite = response.data;

        const mappedFavourite: Favourite = {
          ...favourite,
          price: Number(favourite.price ?? 0),
          customerName: favourite.customerName ?? "",
          customerEmail: favourite.customerEmail ?? "",
          customerPhone: favourite.customerPhone ?? "",
          productName: favourite.productName ?? "",
          productSku: favourite.productSku ?? "",
          category: favourite.category ?? "",
        };

        setSelectedFavourite(mappedFavourite);

        return mappedFavourite;
      } catch (err: unknown) {
        const message = getFavouriteErrorMessage(
          err,
          "Unable to fetch favourite details."
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
  // CLEAR SELECTED FAVOURITE
  // =========================

  const clearSelectedFavourite = useCallback(() => {
    setSelectedFavourite(null);
  }, []);

  // =========================
  // CLEAR ERROR
  // =========================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    favourites,
    selectedFavourite,
    pagination,

    isLoading,
    isRefreshing,
    error,

    fetchFavourites,
    refreshFavourites,
    fetchFavouriteDetails,

    clearSelectedFavourite,
    clearError,
  };
}
