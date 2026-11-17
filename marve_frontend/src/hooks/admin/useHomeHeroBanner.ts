
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  saveHomeHeroBannerService,
  getHomeHeroBannerService,
  getHomeHeroBannerByUuidService,
  updateHomeHeroBannerStatusService,
} from "@/src/services/admin/homeHeroBanner.service";

import type {
  HomeHeroBanner,
} from "@/src/types/admin/homeHeroBanner.types";

import type {
  SaveHomeHeroBannerFormValues,
  UpdateHomeHeroBannerStatusFormValues,
} from "@/src/validations/admin/homeHeroBanner.validation";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getHomeHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your Home Hero Banner details."
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
      return serverMessage || "Home Hero Banner not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A Home Hero Banner already exists."
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
   HOME HERO BANNER HOOK
========================= */

export default function useHomeHeroBanner() {
  const [banner, setBanner] = useState<HomeHeroBanner | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH SINGLE BANNER
  ========================= */

  const fetchHomeHeroBanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getHomeHeroBannerService();

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to fetch Home Hero Banner."
        );
      }

      setBanner(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getHomeHeroBannerErrorMessage(
        err,
        "Unable to fetch Home Hero Banner."
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

  const fetchHomeHeroBannerByUuid = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getHomeHeroBannerByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch Home Hero Banner details."
          );
        }

        setBanner(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getHomeHeroBannerErrorMessage(
          err,
          "Unable to fetch Home Hero Banner details."
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

  const saveHomeHeroBanner = useCallback(
    async (values: SaveHomeHeroBannerFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await saveHomeHeroBannerService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to save Home Hero Banner."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Home Hero Banner saved successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getHomeHeroBannerErrorMessage(
          err,
          "Unable to save Home Hero Banner."
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

  const updateHomeHeroBannerStatus = useCallback(
    async (
      uuid: string,
      values: UpdateHomeHeroBannerStatusFormValues
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const response =
          await updateHomeHeroBannerStatusService(
            uuid,
            values
          );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update Home Hero Banner status."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Home Hero Banner status updated successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getHomeHeroBannerErrorMessage(
          err,
          "Unable to update Home Hero Banner status."
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

    fetchHomeHeroBanner,
    fetchHomeHeroBannerByUuid,
    saveHomeHeroBanner,
    updateHomeHeroBannerStatus,

    clearBanner,
    clearError,
  };
}
