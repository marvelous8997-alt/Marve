
"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  getActiveBestSellersHeroBannerService,
} from "@/src/services/user/bestSellersHeroBanner.service";

import type {
  UserBestSellersHeroBanner,
} from "@/src/types/user/bestSellersHeroBanner.types";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getBestSellersHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return (
        serverMessage ||
        "Best Sellers hero banner not found."
      );
    }

    if (status === 400) {
      return (
        serverMessage ||
        "Invalid Best Sellers hero banner request."
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

/* =========================
   USE BEST SELLERS HERO BANNER
========================= */

export default function useBestSellersHeroBanner() {
  const [banner, setBanner] =
    useState<UserBestSellersHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================
     FETCH ACTIVE BANNER
  ========================= */

  const fetchBestSellersHeroBanner = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getActiveBestSellersHeroBannerService();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to fetch Best Sellers hero banner."
          );
        }

        // No active banner is a valid storefront state.
        const activeBanner = response.data ?? null;

        setBanner(activeBanner);

        return activeBanner;
      } catch (err: unknown) {
        const message =
          getBestSellersHeroBannerErrorMessage(
            err,
            "Unable to fetch Best Sellers hero banner. Please try again."
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

  /* =========================
     REFRESH BANNER
  ========================= */

  const refreshBestSellersHeroBanner =
    useCallback(async () => {
      return await fetchBestSellersHeroBanner(true);
    }, [fetchBestSellersHeroBanner]);

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    void fetchBestSellersHeroBanner();
  }, [fetchBestSellersHeroBanner]);

  /* =========================
     CLEAR ERROR
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    banner,
    isLoading,
    error,
    fetchBestSellersHeroBanner,
    refreshBestSellersHeroBanner,
    clearError,
  };
}
