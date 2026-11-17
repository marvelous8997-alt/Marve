
"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  getActiveHomeEssentialsHeroBannerService,
} from "@/src/services/user/homeEssentialsHeroBanner.service";

import type {
  UserHomeEssentialsHeroBanner,
} from "@/src/types/user/homeEssentialsHeroBanner.types";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getHomeEssentialsHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return (
        serverMessage ||
        "Home Essentials hero banner not found."
      );
    }

    if (status === 400) {
      return (
        serverMessage ||
        "Invalid Home Essentials hero banner request."
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
   USE HOME ESSENTIALS HERO BANNER
========================= */

export default function useHomeEssentialsHeroBanner() {
  const [banner, setBanner] =
    useState<UserHomeEssentialsHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================
     FETCH ACTIVE BANNER
  ========================= */

  const fetchHomeEssentialsHeroBanner = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getActiveHomeEssentialsHeroBannerService();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to fetch Home Essentials hero banner."
          );
        }

        // No active banner is a valid storefront state.
        const activeBanner = response.data ?? null;

        setBanner(activeBanner);

        return activeBanner;
      } catch (err: unknown) {
        const message =
          getHomeEssentialsHeroBannerErrorMessage(
            err,
            "Unable to fetch Home Essentials hero banner. Please try again."
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

  const refreshHomeEssentialsHeroBanner =
    useCallback(async () => {
      return await fetchHomeEssentialsHeroBanner(true);
    }, [fetchHomeEssentialsHeroBanner]);

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    void fetchHomeEssentialsHeroBanner();
  }, [fetchHomeEssentialsHeroBanner]);

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
    fetchHomeEssentialsHeroBanner,
    refreshHomeEssentialsHeroBanner,
    clearError,
  };
}
