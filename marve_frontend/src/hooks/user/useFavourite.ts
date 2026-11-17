"use client";

import {
  useState,
  useCallback,
} from "react";

import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  getFavouritesService,
  addFavouriteService,
  checkFavouriteService,
  removeFavouriteService,
} from "@/src/services/user/favourite.service";

import type {
  Favourite,
  AddFavouriteRequest,
  CheckFavouriteData,
} from "@/src/types/user/favourite.types";

/* =========================
   Error Message Handler
========================= */

const getFavouriteErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 401) {
      return serverMessage || "Please log in to continue.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "Your account cannot access favourites."
      );
    }

    if (status === 404) {
      return serverMessage || "Product or favourite not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid favourite request.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "This product is already in your favourites."
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
   Custom Favourite Hook
========================= */

export default function useFavourite() {
  const router = useRouter();

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [checkingProducts, setCheckingProducts] = useState<
    Record<string, boolean>
  >({});

  const [favouriteStatus, setFavouriteStatus] = useState<
    Record<string, boolean>
  >({});

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Apply Favourites Data
  ========================= */

  const applyFavouriteData = useCallback(
    (data: Favourite[]) => {
      const safeFavourites = Array.isArray(data) ? data : [];

      setFavourites(safeFavourites);

      setFavouriteStatus((previousStatus) => {
        const nextStatus = { ...previousStatus };

        safeFavourites.forEach((favourite) => {
          nextStatus[String(favourite.product_id)] = true;
        });

        return nextStatus;
      });
    },
    []
  );

  /* =========================
     Refresh Favourites Data
  ========================= */

  const syncFavouriteData = useCallback(async () => {
    const response = await getFavouritesService();

    if (!response.success || !Array.isArray(response.data)) {
      throw new Error(
        response.message || "Unable to refresh your favourites."
      );
    }

    applyFavouriteData(response.data);

    return response.data;
  }, [applyFavouriteData]);

  /* =========================
     Fetch User Favourites
  ========================= */

  const fetchFavourites = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getFavouritesService();

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(
            response.message || "Unable to fetch your favourites."
          );
        }

        applyFavouriteData(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getFavouriteErrorMessage(
          err,
          "Unable to fetch favourites. Please try again."
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
    [applyFavouriteData, router]
  );

  /* =========================
     Check Favourite Status
  ========================= */

  const checkFavourite = useCallback(
    async (
      productId: number | string
    ): Promise<CheckFavouriteData | null> => {
      const key = String(productId);

      setCheckingProducts((previous) => ({
        ...previous,
        [key]: true,
      }));

      try {
        const response = await checkFavouriteService(productId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to check favourite status."
          );
        }

        setFavouriteStatus((previous) => ({
          ...previous,
          [key]: response.data!.isFavourite,
        }));

        return response.data;
      } catch (err: unknown) {
        const message = getFavouriteErrorMessage(
          err,
          "Unable to check favourite status."
        );

        setError(message);

        return null;
      } finally {
        setCheckingProducts((previous) => ({
          ...previous,
          [key]: false,
        }));
      }
    },
    [router]
  );

  /* =========================
     Add Product To Favourites
  ========================= */

  const addFavourite = useCallback(
    async (
      payload: AddFavouriteRequest,
      isAuthenticated = true
    ) => {
if (!isAuthenticated) {
  window.dispatchEvent(new Event("marve-open-login"));
  return null;
}

      const productId = Number(payload.productId);
      const key = String(productId);

      if (favouriteStatus[key]) {
        return null;
      }

      setIsAdding(true);
      setError(null);

      try {
        const response = await addFavouriteService(payload);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to add product to favourites."
          );
        }

        setFavouriteStatus((previous) => ({
          ...previous,
          [key]: true,
        }));

        await syncFavouriteData();
        window.dispatchEvent(new Event("marve-favourites-changed"));

        toast.success(
          response.message || "Product added to favourites."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getFavouriteErrorMessage(
          err,
          "Unable to add product to favourites. Please try again."
        );

        setError(message);
        toast.error(message);

if (
  axios.isAxiosError(err) &&
  err.response?.status === 401
) {
  window.dispatchEvent(new Event("marve-open-login"));
}

        return null;
      } finally {
        setIsAdding(false);
      }
    },
    [favouriteStatus, router, syncFavouriteData]
  );

  /* =========================
     Remove Product From Favourites
  ========================= */

  const removeFavourite = useCallback(
    async (productId: number | string) => {
      const key = String(productId);

      setIsRemoving(true);
      setError(null);

      try {
        const response = await removeFavouriteService(productId);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to remove favourite."
          );
        }

        setFavouriteStatus((previous) => ({
          ...previous,
          [key]: false,
        }));

        setFavourites((previous) =>
          previous.filter(
            (favourite) =>
              String(favourite.product_id) !== key
          )
        );
        window.dispatchEvent(new Event("marve-favourites-changed"));
        toast.success(
          response.message || "Product removed from favourites."
        );

        return true;
      } catch (err: unknown) {
        const message = getFavouriteErrorMessage(
          err,
          "Unable to remove favourite. Please try again."
        );

        setError(message);
        toast.error(message);

if (
  axios.isAxiosError(err) &&
  err.response?.status === 401
) {
  window.dispatchEvent(new Event("marve-open-login"));
}

        return false;
      } finally {
        setIsRemoving(false);
      }
    },
    [router]
  );

  /* =========================
     Toggle Favourite
  ========================= */

  const toggleFavourite = useCallback(
    async (
      productId: number | string,
      isAuthenticated = true
    ) => {
if (!isAuthenticated) {
  window.dispatchEvent(new Event("marve-open-login"));
  return false;
}

      const key = String(productId);

      if (favouriteStatus[key]) {
        return await removeFavourite(productId);
      }

      const result = await addFavourite(
        { productId: Number(productId) },
        isAuthenticated
      );

      return result !== null;
    },
    [addFavourite, favouriteStatus, removeFavourite, router]
  );

  /* =========================
     Refresh Favourites
  ========================= */

  const refreshFavourites = useCallback(async () => {
    return await fetchFavourites(true);
  }, [fetchFavourites]);

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Return
  ========================= */

  return {
    favourites,
    favouriteStatus,
    isFavourite: (productId: number | string) =>
      Boolean(favouriteStatus[String(productId)]),

    isLoading,
    isAdding,
    isRemoving,
    checkingProducts,
    error,

    fetchFavourites,
    refreshFavourites,
    addFavourite,
    removeFavourite,
    checkFavourite,
    toggleFavourite,
    clearError,
  };
}