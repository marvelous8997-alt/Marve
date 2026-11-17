"use client";

import { useState, useCallback, useEffect } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
  adminLoginService,
  refreshAdminTokenService,
  getCurrentAdminService,
  adminLogoutService,
} from "@/src/services/admin/auth.service";
import {
  saveAccessToken,
  saveRefreshToken,
  clearAuth,
  getAccessToken,
  getRefreshToken,
} from "@/src/utils/storage";
import type {
  AdminLoginFormValues,
} from "@/src/validations/admin/auth.validation";
import type {
  AuthAdmin,
} from "@/src/types/admin/auth.types";

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
      return serverMessage || "Invalid email or password.";
    }
    if (status === 403) {
      return serverMessage || "You do not have access to the admin panel.";
    }
    if (status === 422) {
      return serverMessage || "Please check your login details.";
    }
    if (status === 429) {
      return serverMessage || "Too many attempts. Please try again later.";
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

export default function useAuth() {
  const [admin, setAdmin] = useState<AuthAdmin | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const restoreAuth = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          if (!cancelled) {
            setAdmin(null);
          }
          return;
        }
        const response = await getCurrentAdminService();
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to restore admin session."
          );
        }
        if (!cancelled) {
          setAdmin(response.data);
        }
      } catch {
        if (!cancelled) {
          clearAuth();
          setAdmin(null);
        }
      } finally {
        if (!cancelled) {
          setIsAuthReady(true);
        }
      }
    };
    restoreAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (values: AdminLoginFormValues) => {
      setIsLoggingIn(true);
      setError(null);
      try {
        const { adminLoginService } = await import(
          "@/src/services/admin/auth.service"
        );
        const response = await adminLoginService(values);
        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Admin login failed."
          );
        }
        const { admin: authenticatedAdmin, tokens } = response.data;
        if (!tokens?.accessToken || !tokens?.refreshToken) {
          throw new Error("Authentication tokens were not received.");
        }
        saveAccessToken(tokens.accessToken);
        saveRefreshToken(tokens.refreshToken);
        setAdmin(authenticatedAdmin);
        window.dispatchEvent(new Event("marve-admin-auth-changed"));
        toast.success("Admin login successful!");
        return response.data;
      } catch (err: unknown) {
        const message = getAuthErrorMessage(
          err,
          "Unable to log in. Please try again."
        );
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoggingIn(false);
      }
    },
    []
  );

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
      clearAuth();
      setAdmin(null);
      throw new Error("Refresh token not found. Please log in again.");
    }
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await refreshAdminTokenService({
        refreshToken: storedRefreshToken,
      });
      if (!response.success || !response.data?.accessToken) {
        throw new Error(
          response.message || "Unable to refresh admin session."
        );
      }
      saveAccessToken(response.data.accessToken);
      if (response.data.refreshToken) {
        saveRefreshToken(response.data.refreshToken);
      }
      return response.data;
    } catch (err: unknown) {
      const message = getAuthErrorMessage(
        err,
        "Your session has expired. Please log in again."
      );
      clearAuth();
      setAdmin(null);
      setError(message);
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refreshAdmin = useCallback(async () => {
    try {
      const response = await getCurrentAdminService();
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to fetch admin profile."
        );
      }
      setAdmin(response.data);
      return response.data;
    } catch (err: unknown) {
      const message = getAuthErrorMessage(
        err,
        "Unable to fetch admin profile."
      );
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    const storedRefreshToken = getRefreshToken();
    try {
      if (storedRefreshToken) {
        await adminLogoutService({
          refreshToken: storedRefreshToken,
        });
      }
    } catch (err: unknown) {
      console.error("Admin logout API failed:", err);
    } finally {
      clearAuth();
      setAdmin(null);
      setError(null);
      window.dispatchEvent(
        new Event("marve-admin-auth-changed")
      );
      toast.success("Logged out successfully.");
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    admin,
    isAuthenticated: Boolean(admin && getAccessToken()),
    isAuthReady,
    isLoggingIn,
    isRefreshing,
    isLoading: isLoggingIn || isRefreshing,
    error,
    login,
    refreshToken,
    refreshAdmin,
    logout,
    clearError,
  };
}