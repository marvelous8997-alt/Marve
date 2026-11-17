"use client";

import {
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getOffersService,
  getOfferDetailsService,
} from "@/src/services/user/offer.service";

import type {
  UserOffer,
  OfferType,
  GetOffersData,
} from "@/src/types/user/offer.types";

/* ========================= Error Handler ========================= */

const getOfferErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 404) {
      return serverMessage || "Offer not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid offer request.";
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

/* ========================= Hook ========================= */

export default function useOffer() {
  const [offersData, setOffersData] =
    useState<GetOffersData | null>(null);

  const [offer, setOffer] = useState<UserOffer | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOffer, setIsFetchingOffer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offers = offersData?.offers ?? [];
  const summary = offersData?.summary ?? {
    total: 0,
    discountCount: 0,
    bogoCount: 0,
  };

  /* ========================= Get All Active Offers ========================= */

  const fetchOffers = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getOffersService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch offers."
          );
        }

        setOffersData(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getOfferErrorMessage(
          err,
          "Unable to fetch offers. Please try again."
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
    []
  );

  /* ========================= Get Offer Details ========================= */

  const fetchOfferDetails = useCallback(
    async (type: OfferType, uuid: string) => {
      setIsFetchingOffer(true);
      setError(null);
      setOffer(null);

      try {
        const response = await getOfferDetailsService(type, uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch offer details."
          );
        }

        setOffer(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getOfferErrorMessage(
          err,
          "Unable to fetch offer details. Please try again."
        );

        setError(message);
        return null;
      } finally {
        setIsFetchingOffer(false);
      }
    },
    []
  );

  /* ========================= Refresh Offers ========================= */

  const refreshOffers = useCallback(async () => {
    return await fetchOffers(true);
  }, [fetchOffers]);

  /* ========================= Initial Offers Fetch ========================= */

  useEffect(() => {
    void fetchOffers();
  }, [fetchOffers]);

  /* ========================= Clear Error ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ========================= Return ========================= */

  return {
    offers,
    summary,
    offersData,
    offer,
    isLoading,
    isFetchingOffer,
    error,
    fetchOffers,
    fetchOfferDetails,
    refreshOffers,
    clearError,
  };
}