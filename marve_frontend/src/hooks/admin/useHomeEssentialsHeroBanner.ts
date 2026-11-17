
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  saveHomeEssentialsHeroBannerService,
  getHomeEssentialsHeroBannerService,
  getHomeEssentialsHeroBannerByUuidService,
  updateHomeEssentialsHeroBannerStatusService,
} from "@/src/services/admin/homeEssentialsHeroBanner.service";

import type {
  HomeEssentialsHeroBanner,
} from "@/src/types/admin/homeEssentialsHeroBanner.types";

import type {
  SaveHomeEssentialsHeroBannerFormValues,
  UpdateHomeEssentialsHeroBannerStatusFormValues,
} from "@/src/validations/admin/homeEssentialsHeroBanner.validation";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getHomeEssentialsHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your Home Essentials Hero Banner details."
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
        "Home Essentials Hero Banner not found."
      );
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A Home Essentials Hero Banner already exists."
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
   HOME ESSENTIALS HERO BANNER HOOK
========================= */

export default function useHomeEssentialsHeroBanner() {
  const [banner, setBanner] =
    useState<HomeEssentialsHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH SINGLE BANNER
  ========================= */

  const fetchHomeEssentialsHeroBanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await getHomeEssentialsHeroBannerService();

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to fetch Home Essentials Hero Banner."
        );
      }

      setBanner(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getHomeEssentialsHeroBannerErrorMessage(
        err,
        "Unable to fetch Home Essentials Hero Banner."
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

  const fetchHomeEssentialsHeroBannerByUuid = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getHomeEssentialsHeroBannerByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch Home Essentials Hero Banner details."
          );
        }

        setBanner(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getHomeEssentialsHeroBannerErrorMessage(
          err,
          "Unable to fetch Home Essentials Hero Banner details."
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

  const saveHomeEssentialsHeroBanner = useCallback(
    async (values: SaveHomeEssentialsHeroBannerFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await saveHomeEssentialsHeroBannerService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to save Home Essentials Hero Banner."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Home Essentials Hero Banner saved successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getHomeEssentialsHeroBannerErrorMessage(
          err,
          "Unable to save Home Essentials Hero Banner."
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

  const updateHomeEssentialsHeroBannerStatus = useCallback(
    async (
      uuid: string,
      values: UpdateHomeEssentialsHeroBannerStatusFormValues
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const response =
          await updateHomeEssentialsHeroBannerStatusService(
            uuid,
            values
          );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update Home Essentials Hero Banner status."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Home Essentials Hero Banner status updated successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getHomeEssentialsHeroBannerErrorMessage(
          err,
          "Unable to update Home Essentials Hero Banner status."
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

    fetchHomeEssentialsHeroBanner,
    fetchHomeEssentialsHeroBannerByUuid,
    saveHomeEssentialsHeroBanner,
    updateHomeEssentialsHeroBannerStatus,

    clearBanner,
    clearError,
  };
}
