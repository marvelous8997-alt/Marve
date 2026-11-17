
"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  getActiveNewArrivalsHeroBannerService,
} from "@/src/services/user/newArrivalsHeroBanner.service";

import type {
  UserNewArrivalsHeroBanner,
} from "@/src/types/user/newArrivalsHeroBanner.types";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getNewArrivalsHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return serverMessage || "New Arrivals hero banner not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid New Arrivals hero banner request.";
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
   USE NEW ARRIVALS HERO BANNER
========================= */

export default function useNewArrivalsHeroBanner() {
  const [banner, setBanner] =
    useState<UserNewArrivalsHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================
     FETCH ACTIVE BANNER
  ========================= */

  const fetchNewArrivalsHeroBanner = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getActiveNewArrivalsHeroBannerService();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to fetch New Arrivals hero banner."
          );
        }

        // No active banner is a valid storefront state.
        const activeBanner = response.data ?? null;

        setBanner(activeBanner);

        return activeBanner;
      } catch (err: unknown) {
        const message =
          getNewArrivalsHeroBannerErrorMessage(
            err,
            "Unable to fetch New Arrivals hero banner. Please try again."
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

  const refreshNewArrivalsHeroBanner =
    useCallback(async () => {
      return await fetchNewArrivalsHeroBanner(true);
    }, [fetchNewArrivalsHeroBanner]);

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    void fetchNewArrivalsHeroBanner();
  }, [fetchNewArrivalsHeroBanner]);

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
    fetchNewArrivalsHeroBanner,
    refreshNewArrivalsHeroBanner,
    clearError,
  };
}
