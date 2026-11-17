
"use client";

import { useState, useCallback, useEffect } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  sendOtpService,
  verifyOtpService,
} from "@/src/services/user/auth.service";

import {
  saveAccessToken,
  saveRefreshToken,
  saveUser,
  clearAuth,
  getAccessToken,
  getUser,
} from "@/src/utils/storage";

import type {
  SendOtpFormValues,
  VerifyOtpFormValues,
} from "@/src/validations/user/auth.validation";

import type { AuthUser } from "@/src/types/user/auth.types";

/* ========================= ERROR HANDLER ========================= */

const getAuthErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (err instanceof ZodError) {
    return err.issues[0]?.message || "Please check your details.";
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 401) {
      return "Invalid OTP. Please enter the correct OTP.";
    }

    if (status === 400) {
      return serverMessage || "Invalid request. Please check your details.";
    }

    if (status === 429) {
      return "Too many attempts. Please try again after 15 minutes.";
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

/* ========================= USE AUTH HOOK ========================= */

export default function useAuth() {
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  /* ========================= AUTH SYNC ========================= */

  useEffect(() => {
    const syncAuth = () => {
      const token = getAccessToken();
      const savedUser = getUser();

      if (token && savedUser) {
        setUser(savedUser);
      } else {
        setUser(null);
      }

      setIsAuthReady(true);
    };

    syncAuth();

    window.addEventListener("marve-auth-changed", syncAuth);

    return () => {
      window.removeEventListener("marve-auth-changed", syncAuth);
    };
  }, []);

  /* ========================= SEND OTP ========================= */

  const sendOtp = useCallback(
    async (values: SendOtpFormValues) => {
      setIsSendingOtp(true);
      setError(null);

      try {
        const response = await sendOtpService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to send OTP."
          );
        }

        setOtpSent(true);

        return response.data;
      } catch (err: unknown) {
        const message = getAuthErrorMessage(
          err,
          "Unable to send OTP. Please try again."
        );

        setError(message);
        toast.error(message);

        throw err;
      } finally {
        setIsSendingOtp(false);
      }
    },
    []
  );

  /* ========================= VERIFY OTP ========================= */

  const verifyOtp = useCallback(
    async (values: VerifyOtpFormValues) => {
      setIsVerifyingOtp(true);
      setError(null);

      try {
        const response = await verifyOtpService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "OTP verification failed."
          );
        }

        const { user: authenticatedUser, tokens } = response.data;

        if (!tokens?.accessToken || !tokens?.refreshToken) {
          throw new Error(
            "Authentication tokens were not received."
          );
        }

        saveAccessToken(tokens.accessToken);
        saveRefreshToken(tokens.refreshToken);
        saveUser(authenticatedUser);

        setUser(authenticatedUser);
        setOtpSent(false);

        toast.success("Login successful!");

        window.dispatchEvent(new Event("marve-auth-changed"));

        return response.data;
      } catch (err: unknown) {
        const message = getAuthErrorMessage(
          err,
          "OTP verification failed. Please try again."
        );

        setError(message);
        toast.error(message);

        throw err;
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    []
  );

  /* ========================= UPDATE AUTH USER ========================= */

/* ========================= UPDATE AUTH USER ========================= */

/* ========================= UPDATE AUTH USER ========================= */

const updateUser = useCallback(
  (updatedData: Partial<AuthUser>) => {
    if (!user) return;

    const updatedUser: AuthUser = {
      ...user,
      ...updatedData,
    };

    // Update local storage
    saveUser(updatedUser);

    // Update current useAuth instance
    setUser(updatedUser);

    // Notify other useAuth instances
    window.dispatchEvent(new Event("marve-auth-changed"));
  },
  [user]
);

  /* ========================= LOGOUT ========================= */

  const logout = useCallback(() => {
    clearAuth();

    setUser(null);
    setOtpSent(false);
    setError(null);

    window.dispatchEvent(new Event("marve-auth-changed"));
  }, []);

  /* ========================= CLEAR ERROR ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ========================= RETURN ========================= */

  return {
    user,
    updateUser,

    isAuthenticated: Boolean(user && getAccessToken()),
    isAuthReady,

    error,
    otpSent,

    isSendingOtp,
    isVerifyingOtp,
    isLoading: isSendingOtp || isVerifyingOtp,

    sendOtp,
    verifyOtp,
    logout,
    clearError,
  };
}
