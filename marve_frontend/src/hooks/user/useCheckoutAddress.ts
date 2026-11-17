"use client";

import {
  useState,
  useCallback,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  createCheckoutAddressService,
  getCheckoutAddressesService,
  getCheckoutAddressByIdService,
  updateCheckoutAddressService,
  deleteCheckoutAddressService,
  setDefaultCheckoutAddressService,
} from "@/src/services/user/checkout-address.service";

import type {
  CheckoutAddress,
  CreateCheckoutAddressRequest,
  UpdateCheckoutAddressRequest,
} from "@/src/types/user/checkout-address.types";

import {
  createCheckoutAddressSchema,
  updateCheckoutAddressSchema,
} from "@/src/validations/user/checkout-address.validation";

/* =========================
   Error Message Handler
========================= */

const getCheckoutAddressErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Please check your address details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in to manage your addresses.";
    }

    if (status === 403) {
      return serverMessage || "You are not allowed to perform this action.";
    }

    if (status === 404) {
      return serverMessage || "Checkout address not found.";
    }

    if (status === 409) {
      return serverMessage || "This address conflicts with existing data.";
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


const getCheckoutAddressValidationMessage = (err: unknown): string => {
  if (
    typeof err === "object" &&
    err !== null &&
    "issues" in err &&
    Array.isArray(err.issues)
  ) {
    return err.issues
      .map((issue: { message: string }) => issue.message)
      .join("\n");
  }

  return "Please check your address details.";
};

/* =========================
   Checkout Address Hook
========================= */

export default function useCheckoutAddress() {
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);

  const [address, setAddress] = useState<CheckoutAddress | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Get All Checkout Addresses
  ========================= */

  const fetchCheckoutAddresses = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCheckoutAddressesService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch checkout addresses."
          );
        }

        setAddresses(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getCheckoutAddressErrorMessage(
          err,
          "Unable to fetch addresses. Please try again."
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

  /* =========================
     Get Checkout Address By ID
  ========================= */

  const fetchCheckoutAddressById = useCallback(
    async (id: number | string) => {
      setIsFetchingAddress(true);
      setError(null);
      setAddress(null);

      try {
        const response = await getCheckoutAddressByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch checkout address."
          );
        }

        setAddress(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getCheckoutAddressErrorMessage(
          err,
          "Unable to fetch address. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingAddress(false);
      }
    },
    []
  );

  /* =========================
     Create Checkout Address
  ========================= */

const createCheckoutAddress = useCallback(
  async (payload: CreateCheckoutAddressRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const validationResult =
        createCheckoutAddressSchema.safeParse({
          ...payload,
          email: payload.email ?? "",
          landmark: payload.landmark ?? "",
        });

      if (!validationResult.success) {
        const message = getCheckoutAddressValidationMessage(
          validationResult.error
        );

        setError(message);
        toast.error(message);

        return null;
      }

      const validatedPayload = {
        ...validationResult.data,
        email: validationResult.data.email?.trim() || null,
        landmark: validationResult.data.landmark?.trim() || null,
      };

      const response =
        await createCheckoutAddressService(validatedPayload);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to save checkout address."
        );
      }

      const createdAddress = response.data;

      setAddress(createdAddress);

      setAddresses((previous) => {
        const nextAddresses = createdAddress.isDefault
          ? previous.map((item) => ({
              ...item,
              isDefault: false,
            }))
          : previous;

        return [
          createdAddress,
          ...nextAddresses.filter(
            (item) => item.id !== createdAddress.id
          ),
        ];
      });

      toast.success(
        response.message || "Address saved successfully."
      );

      return createdAddress;
    } catch (err: unknown) {
      const message = getCheckoutAddressErrorMessage(
        err,
        "Unable to save address. Please try again."
      );

      setError(message);
      toast.error(message);

      return null;
    } finally {
      setIsSubmitting(false);
    }
  },
  []
);

  /* =========================
     Update Checkout Address
  ========================= */

const updateCheckoutAddress = useCallback(
  async (
    id: number | string,
    payload: UpdateCheckoutAddressRequest
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const validationResult =
        updateCheckoutAddressSchema.safeParse({
          ...payload,
          email: payload.email ?? "",
          landmark: payload.landmark ?? "",
        });

      if (!validationResult.success) {
        const message = getCheckoutAddressValidationMessage(
          validationResult.error
        );

        setError(message);
        toast.error(message);

        return null;
      }

      const validatedPayload = {
        ...validationResult.data,
        email: validationResult.data.email?.trim() || null,
        landmark: validationResult.data.landmark?.trim() || null,
      };

      const response = await updateCheckoutAddressService(
        id,
        validatedPayload
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to update checkout address."
        );
      }

      const updatedAddress = response.data;

      setAddress(updatedAddress);

      setAddresses((previous) =>
        previous.map((item) => {
          if (
            updatedAddress.isDefault &&
            item.id !== updatedAddress.id
          ) {
            return {
              ...item,
              isDefault: false,
            };
          }

          return item.id === updatedAddress.id
            ? updatedAddress
            : item;
        })
      );

      toast.success(
        response.message || "Address updated successfully."
      );

      return updatedAddress;
    } catch (err: unknown) {
      const message = getCheckoutAddressErrorMessage(
        err,
        "Unable to update address. Please try again."
      );

      setError(message);
      toast.error(message);

      return null;
    } finally {
      setIsSubmitting(false);
    }
  },
  []
);

  /* =========================
     Delete Checkout Address
  ========================= */

  const deleteCheckoutAddress = useCallback(
    async (id: number | string) => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await deleteCheckoutAddressService(id);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to delete checkout address."
          );
        }

        setAddresses((previous) =>
          previous.filter((item) => String(item.id) !== String(id))
        );

        setAddress((previous) =>
          previous && String(previous.id) === String(id)
            ? null
            : previous
        );

        toast.success(
          response.message || "Address deleted successfully."
        );

        return true;
      } catch (err: unknown) {
        const message = getCheckoutAddressErrorMessage(
          err,
          "Unable to delete address. Please try again."
        );

        setError(message);
        toast.error(message);

        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  /* =========================
     Set Default Checkout Address
  ========================= */

  const setDefaultCheckoutAddress = useCallback(
    async (id: number | string) => {
      setIsSettingDefault(true);
      setError(null);

      try {
        const response = await setDefaultCheckoutAddressService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to set default address."
          );
        }

        const defaultAddress = response.data;

        setAddress(defaultAddress);

        setAddresses((previous) =>
          previous.map((item) => ({
            ...item,
            isDefault: item.id === defaultAddress.id,
          }))
        );

        toast.success(
          response.message || "Default address updated successfully."
        );

        return defaultAddress;
      } catch (err: unknown) {
        const message = getCheckoutAddressErrorMessage(
          err,
          "Unable to set default address. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsSettingDefault(false);
      }
    },
    []
  );

  /* =========================
     Refresh Checkout Addresses
  ========================= */

  const refreshCheckoutAddresses = useCallback(async () => {
    return await fetchCheckoutAddresses(true);
  }, [fetchCheckoutAddresses]);

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Return Hook Values
  ========================= */

  return {
    addresses,
    address,

    isLoading,
    isFetchingAddress,
    isSubmitting,
    isDeleting,
    isSettingDefault,

    error,

    fetchCheckoutAddresses,
    fetchCheckoutAddressById,
    createCheckoutAddress,
    updateCheckoutAddress,
    deleteCheckoutAddress,
    setDefaultCheckoutAddress,
    refreshCheckoutAddresses,
    clearError,
  };
}