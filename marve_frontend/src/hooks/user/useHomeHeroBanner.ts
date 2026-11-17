
"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getActiveHomeHeroBannerService,
} from "@/src/services/user/homeHeroBanner.service";

import type {
  UserHomeHeroBanner,
} from "@/src/types/user/homeHeroBanner.types";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getHomeHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return serverMessage || "Home hero banner not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid home hero banner request.";
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
   USE HOME HERO BANNER
========================= */

export default function useHomeHeroBanner() {
  const [banner, setBanner] =
    useState<UserHomeHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get Active Home Hero Banner
  const fetchHomeHeroBanner = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getActiveHomeHeroBannerService();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to fetch home hero banner."
          );
        }

        // No active banner is a valid state.
        setBanner(response.data ?? null);

        return response.data ?? null;
      } catch (err: unknown) {
        const message = getHomeHeroBannerErrorMessage(
          err,
          "Unable to fetch home hero banner. Please try again."
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

  // Refresh Home Hero Banner
  const refreshHomeHeroBanner = useCallback(async () => {
    return await fetchHomeHeroBanner(true);
  }, [fetchHomeHeroBanner]);

  // Initial Banner Fetch
  useEffect(() => {
    void fetchHomeHeroBanner();
  }, [fetchHomeHeroBanner]);

  // Clear Error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    banner,
    isLoading,
    error,
    fetchHomeHeroBanner,
    refreshHomeHeroBanner,
    clearError,
  };
}
