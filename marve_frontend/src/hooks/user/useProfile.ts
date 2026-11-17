
"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
  getUserProfileService,
  updateUserProfileService,
} from "@/src/services/user/profile.service";

import type {
  UserProfile,
  UpdateUserProfileRequest,
} from "@/src/types/user/profile.types";

/* ========================= ERROR HANDLER ========================= */

const getProfileErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 401) {
      return serverMessage || "Your session has expired. Please log in again.";
    }

    if (status === 403) {
      return serverMessage || "You are not authorized to perform this action.";
    }

    if (status === 422) {
      return serverMessage || "Please check your profile details.";
    }

    if (status === 429) {
      return serverMessage || "Too many requests. Please try again later.";
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

/* ========================= USE PROFILE HOOK ========================= */

export default function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ========================= FETCH PROFILE ========================= */

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserProfileService();

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to fetch your profile."
        );
      }

      setProfile(response.data);

      return response.data;
    } catch (err: unknown) {
      const message = getProfileErrorMessage(
        err,
        "Unable to fetch your profile. Please try again."
      );

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ========================= UPDATE PROFILE ========================= */

  const updateProfile = useCallback(
    async (payload: UpdateUserProfileRequest) => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await updateUserProfileService(payload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to update your profile."
          );
        }

        setProfile(response.data);

        toast.success(
          response.message || "Profile updated successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getProfileErrorMessage(
          err,
          "Unable to update your profile. Please try again."
        );

        setError(message);
        toast.error(message);

        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /* ========================= INITIAL PROFILE FETCH ========================= */

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await getUserProfileService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch your profile."
          );
        }

        if (!cancelled) {
          setProfile(response.data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = getProfileErrorMessage(
            err,
            "Unable to fetch your profile."
          );

          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================= CLEAR ERROR ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ========================= RETURN ========================= */

  return {
    profile,
    setProfile,

    isLoading,
    isUpdating,
    isSaving: isUpdating,

    error,

    fetchProfile,
    updateProfile,
    clearError,
  };
}
