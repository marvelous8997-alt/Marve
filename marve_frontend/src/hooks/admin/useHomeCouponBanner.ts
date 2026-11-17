
"use client";

import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  saveHomeCouponBannerService,
  getHomeCouponBannerService,
  getHomeCouponBannerByUuidService,
  updateHomeCouponBannerStatusService,
} from "@/src/services/admin/homeCouponBanner.service";

import type {
  HomeCouponBanner,
} from "@/src/types/admin/homeCouponBanner.types";

import type {
  SaveHomeCouponBannerFormValues,
  UpdateHomeCouponBannerStatusFormValues,
} from "@/src/validations/admin/homeCouponBanner.validation";

/* =========================
   ERROR MESSAGE HANDLER
========================= */

const getHomeCouponBannerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return (
      err.issues[0]?.message ||
      "Please check your Home Coupon Banner details."
    );
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid banner or coupon details.";
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
      return serverMessage || "Home Coupon Banner not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "A Home Coupon Banner already exists."
      );
    }

    if (status === 413) {
      return "Image size must be 10 MB or less. Please select a smaller image.";
    }

    if (status === 422) {
      return (
        serverMessage ||
        "Please check your banner and coupon details."
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
   HOME COUPON BANNER HOOK
========================= */

export default function useHomeCouponBanner() {
  const [banner, setBanner] = useState<HomeCouponBanner | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH SINGLE BANNER
  ========================= */

  const fetchHomeCouponBanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getHomeCouponBannerService();

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to fetch Home Coupon Banner."
        );
      }

      setBanner(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getHomeCouponBannerErrorMessage(
        err,
        "Unable to fetch Home Coupon Banner."
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

  const fetchHomeCouponBannerByUuid = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getHomeCouponBannerByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to fetch Home Coupon Banner details."
          );
        }

        setBanner(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getHomeCouponBannerErrorMessage(
          err,
          "Unable to fetch Home Coupon Banner details."
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

  const saveHomeCouponBanner = useCallback(
    async (values: SaveHomeCouponBannerFormValues) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response =
          await saveHomeCouponBannerService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to save Home Coupon Banner."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Home Coupon Banner saved successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getHomeCouponBannerErrorMessage(
          err,
          "Unable to save Home Coupon Banner."
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

  const updateHomeCouponBannerStatus = useCallback(
    async (
      uuid: string,
      values: UpdateHomeCouponBannerStatusFormValues
    ) => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const response =
          await updateHomeCouponBannerStatusService(
            uuid,
            values
          );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update Home Coupon Banner status."
          );
        }

        setBanner(response.data);

        toast.success(
          response.message ||
            "Home Coupon Banner status updated successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getHomeCouponBannerErrorMessage(
          err,
          "Unable to update Home Coupon Banner status."
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

    fetchHomeCouponBanner,
    fetchHomeCouponBannerByUuid,
    saveHomeCouponBanner,
    updateHomeCouponBannerStatus,

    clearBanner,
    clearError,
  };
}
