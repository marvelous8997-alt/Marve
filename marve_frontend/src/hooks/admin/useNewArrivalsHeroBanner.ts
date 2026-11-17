"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  saveNewArrivalsHeroBannerService,
  getNewArrivalsHeroBannerService,
  getNewArrivalsHeroBannerByUuidService,
  updateNewArrivalsHeroBannerStatusService,
} from "@/src/services/admin/newArrivalsHeroBanner.service";

import type {
  NewArrivalsHeroBanner,
} from "@/src/types/admin/newArrivalsHeroBanner.types";

import type {
  SaveNewArrivalsHeroBannerFormValues,
  UpdateNewArrivalsHeroBannerStatusFormValues,
} from "@/src/validations/admin/newArrivalsHeroBanner.validation";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getNewArrivalsHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your New Arrivals Hero Banner details."
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
      return serverMessage || "New Arrivals Hero Banner not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A New Arrivals Hero Banner already exists."
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
   NEW ARRIVALS HERO BANNER HOOK
========================= */

export default function useNewArrivalsHeroBanner() {
  const [banner, setBanner] =
    useState<NewArrivalsHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH SINGLE BANNER
  ========================= */

  const fetchNewArrivalsHeroBanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getNewArrivalsHeroBannerService();

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to fetch New Arrivals Hero Banner."
        );
      }

      setBanner(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getNewArrivalsHeroBannerErrorMessage(
        err,
        "Unable to fetch New Arrivals Hero Banner."
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

  const fetchNewArrivalsHeroBannerByUuid = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getNewArrivalsHeroBannerByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch New Arrivals Hero Banner details."
          );
        }

        setBanner(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getNewArrivalsHeroBannerErrorMessage(
          err,
          "Unable to fetch New Arrivals Hero Banner details."
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

  const saveNewArrivalsHeroBanner = useCallback(
    async (values: SaveNewArrivalsHeroBannerFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await saveNewArrivalsHeroBannerService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to save New Arrivals Hero Banner."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "New Arrivals Hero Banner saved successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getNewArrivalsHeroBannerErrorMessage(
          err,
          "Unable to save New Arrivals Hero Banner."
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

  const updateNewArrivalsHeroBannerStatus = useCallback(
    async (
      uuid: string,
      values: UpdateNewArrivalsHeroBannerStatusFormValues
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const response =
          await updateNewArrivalsHeroBannerStatusService(
            uuid,
            values
          );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update New Arrivals Hero Banner status."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "New Arrivals Hero Banner status updated successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getNewArrivalsHeroBannerErrorMessage(
          err,
          "Unable to update New Arrivals Hero Banner status."
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

    fetchNewArrivalsHeroBanner,
    fetchNewArrivalsHeroBannerByUuid,
    saveNewArrivalsHeroBanner,
    updateNewArrivalsHeroBannerStatus,

    clearBanner,
    clearError,
  };
}