
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  saveKitchenEssentialsHeroBannerService,
  getKitchenEssentialsHeroBannerService,
  getKitchenEssentialsHeroBannerByUuidService,
  updateKitchenEssentialsHeroBannerStatusService,
} from "@/src/services/admin/kitchenEssentialsHeroBanner.service";

import type {
  KitchenEssentialsHeroBanner,
} from "@/src/types/admin/kitchenEssentialsHeroBanner.types";

import type {
  SaveKitchenEssentialsHeroBannerFormValues,
  UpdateKitchenEssentialsHeroBannerStatusFormValues,
} from "@/src/validations/admin/kitchenEssentialsHeroBanner.validation";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getKitchenEssentialsHeroBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your Kitchen Essentials Hero Banner details."
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
        "Kitchen Essentials Hero Banner not found."
      );
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A Kitchen Essentials Hero Banner already exists."
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
   KITCHEN ESSENTIALS HERO BANNER HOOK
========================= */

export default function useKitchenEssentialsHeroBanner() {
  const [banner, setBanner] =
    useState<KitchenEssentialsHeroBanner | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH SINGLE BANNER
  ========================= */

  const fetchKitchenEssentialsHeroBanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await getKitchenEssentialsHeroBannerService();

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to fetch Kitchen Essentials Hero Banner."
        );
      }

      setBanner(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getKitchenEssentialsHeroBannerErrorMessage(
        err,
        "Unable to fetch Kitchen Essentials Hero Banner."
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

  const fetchKitchenEssentialsHeroBannerByUuid = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getKitchenEssentialsHeroBannerByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch Kitchen Essentials Hero Banner details."
          );
        }

        setBanner(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getKitchenEssentialsHeroBannerErrorMessage(
          err,
          "Unable to fetch Kitchen Essentials Hero Banner details."
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

  const saveKitchenEssentialsHeroBanner = useCallback(
    async (values: SaveKitchenEssentialsHeroBannerFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await saveKitchenEssentialsHeroBannerService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to save Kitchen Essentials Hero Banner."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Kitchen Essentials Hero Banner saved successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getKitchenEssentialsHeroBannerErrorMessage(
          err,
          "Unable to save Kitchen Essentials Hero Banner."
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

  const updateKitchenEssentialsHeroBannerStatus = useCallback(
    async (
      uuid: string,
      values: UpdateKitchenEssentialsHeroBannerStatusFormValues
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const response =
          await updateKitchenEssentialsHeroBannerStatusService(
            uuid,
            values
          );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update Kitchen Essentials Hero Banner status."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Kitchen Essentials Hero Banner status updated successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getKitchenEssentialsHeroBannerErrorMessage(
          err,
          "Unable to update Kitchen Essentials Hero Banner status."
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

    fetchKitchenEssentialsHeroBanner,
    fetchKitchenEssentialsHeroBannerByUuid,
    saveKitchenEssentialsHeroBanner,
    updateKitchenEssentialsHeroBannerStatus,

    clearBanner,
    clearError,
  };
}
