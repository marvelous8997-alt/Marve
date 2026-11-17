
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  saveBestSellersHeroBannerService,
  getBestSellersHeroBannerService,
  getBestSellersHeroBannerByUuidService,
  updateBestSellersHeroBannerStatusService,
} from "@/src/services/admin/bestSellersHeroBanner.service";

import type {
  BestSellersHeroBanner,
} from "@/src/types/admin/bestSellersHeroBanner.types";

import type {
  SaveBestSellersHeroBannerFormValues,
  UpdateBestSellersHeroBannerStatusFormValues,
} from "@/src/validations/admin/bestSellersHeroBanner.validation";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getBestSellersHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your Best Sellers Hero Banner details."
    );
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid banner details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage this banner."
      );
    }

    if (status === 404) {
      return (
        serverMessage ||
        "Best Sellers Hero Banner not found."
      );
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A Best Sellers Hero Banner already exists."
      );
    }

    if (status === 413) {
      return "Image size must be 10 MB or less. Please select a smaller image.";
    }

    if (status === 422) {
      return (
        serverMessage ||
        "Please check your banner details."
      );
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

/* =========================
   BEST SELLERS HERO BANNER HOOK
========================= */

export default function useBestSellersHeroBanner() {
  const [banner, setBanner] =
    useState<BestSellersHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH SINGLE BANNER
  ========================= */

  const fetchBestSellersHeroBanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await getBestSellersHeroBannerService();

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to fetch Best Sellers Hero Banner."
        );
      }

      setBanner(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getBestSellersHeroBannerErrorMessage(
        err,
        "Unable to fetch Best Sellers Hero Banner."
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =========================
     FETCH BANNER BY UUID
  ========================= */

  const fetchBestSellersHeroBannerByUuid = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getBestSellersHeroBannerByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch Best Sellers Hero Banner details."
          );
        }

        setBanner(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getBestSellersHeroBannerErrorMessage(
          err,
          "Unable to fetch Best Sellers Hero Banner details."
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

  /* =========================
     SAVE BANNER
     Create if missing, otherwise update
  ========================= */

  const saveBestSellersHeroBanner = useCallback(
    async (values: SaveBestSellersHeroBannerFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await saveBestSellersHeroBannerService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to save Best Sellers Hero Banner."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Best Sellers Hero Banner saved successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getBestSellersHeroBannerErrorMessage(
          err,
          "Unable to save Best Sellers Hero Banner."
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

  /* =========================
     UPDATE BANNER STATUS
  ========================= */

  const updateBestSellersHeroBannerStatus = useCallback(
    async (
      uuid: string,
      values: UpdateBestSellersHeroBannerStatusFormValues
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const response =
          await updateBestSellersHeroBannerStatusService(
            uuid,
            values
          );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update Best Sellers Hero Banner status."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Best Sellers Hero Banner status updated successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getBestSellersHeroBannerErrorMessage(
          err,
          "Unable to update Best Sellers Hero Banner status."
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

  /* =========================
     CLEAR ERROR
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     CLEAR BANNER
  ========================= */

  const clearBanner = useCallback(() => {
    setBanner(null);
  }, []);

  return {
    banner,

    isLoading,
    isSubmitting,
    isUpdatingStatus,
    error,

    fetchBestSellersHeroBanner,
    fetchBestSellersHeroBannerByUuid,
    saveBestSellersHeroBanner,
    updateBestSellersHeroBannerStatus,

    clearBanner,
    clearError,
  };
}
