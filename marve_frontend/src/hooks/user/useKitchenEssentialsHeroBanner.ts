
"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  getActiveKitchenEssentialsHeroBannerService,
} from "@/src/services/user/kitchenEssentialsHeroBanner.service";

import type {
  UserKitchenEssentialsHeroBanner,
} from "@/src/types/user/kitchenEssentialsHeroBanner.types";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getKitchenEssentialsHeroBannerErrorMessage = (
  err: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return (
        serverMessage ||
        "Kitchen Essentials hero banner not found."
      );
    }

    if (status === 400) {
      return (
        serverMessage ||
        "Invalid Kitchen Essentials hero banner request."
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
   USE KITCHEN ESSENTIALS HERO BANNER
========================= */

export default function useKitchenEssentialsHeroBanner() {
  const [banner, setBanner] =
    useState<UserKitchenEssentialsHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================
     FETCH ACTIVE BANNER
  ========================= */

  const fetchKitchenEssentialsHeroBanner = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getActiveKitchenEssentialsHeroBannerService();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to fetch Kitchen Essentials hero banner.",
          );
        }

        // No active banner is a valid storefront state.
        const activeBanner = response.data ?? null;

        setBanner(activeBanner);

        return activeBanner;
      } catch (err: unknown) {
        const message =
          getKitchenEssentialsHeroBannerErrorMessage(
            err,
            "Unable to fetch Kitchen Essentials hero banner. Please try again.",
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
    [],
  );

  /* =========================
     REFRESH BANNER
  ========================= */

  const refreshKitchenEssentialsHeroBanner =
    useCallback(async () => {
      return await fetchKitchenEssentialsHeroBanner(true);
    }, [fetchKitchenEssentialsHeroBanner]);

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    void fetchKitchenEssentialsHeroBanner();
  }, [fetchKitchenEssentialsHeroBanner]);

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
    fetchKitchenEssentialsHeroBanner,
    refreshKitchenEssentialsHeroBanner,
    clearError,
  };
}
