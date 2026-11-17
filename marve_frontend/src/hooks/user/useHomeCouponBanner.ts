
"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  getActiveHomeCouponBannerService,
} from "@/src/services/user/homeCouponBanner.service";

import type {
  UserHomeCouponBanner,
} from "@/src/types/user/homeCouponBanner.types";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getHomeCouponBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return serverMessage || "Home coupon banner not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid home coupon banner request.";
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
   USE HOME COUPON BANNER
========================= */

export default function useHomeCouponBanner() {
  const [banner, setBanner] =
    useState<UserHomeCouponBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================
     FETCH ACTIVE BANNER
  ========================= */

  const fetchHomeCouponBanner = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getActiveHomeCouponBannerService();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to fetch home coupon banner."
          );
        }

        // No active banner is a valid storefront state.
        const activeBanner = response.data ?? null;

        setBanner(activeBanner);

        return activeBanner;
      } catch (err: unknown) {
        const message =
          getHomeCouponBannerErrorMessage(
            err,
            "Unable to fetch home coupon banner. Please try again."
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

  const refreshHomeCouponBanner =
    useCallback(async () => {
      return await fetchHomeCouponBanner(true);
    }, [fetchHomeCouponBanner]);

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    void fetchHomeCouponBanner();
  }, [fetchHomeCouponBanner]);

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
    fetchHomeCouponBanner,
    refreshHomeCouponBanner,
    clearError,
  };
}
