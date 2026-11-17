
"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getCustomersService,
  getCustomerDetailsService,
  updateCustomerStatusService,
  getCustomerStatusCountsService,
  refreshCustomerDetailsService,
} from "@/src/services/admin/customer.service";

import type {
  Customer,
  CustomerFilters,
  CustomerListResult,
  CustomerStatus,
  CustomerStatusCounts,
} from "@/src/types/admin/customer.types";

import type {
  UpdateCustomerStatusRequest,
} from "@/src/api/admin/customer.api";

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getCustomerErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid customer details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage customers."
      );
    }

    if (status === 404) {
      return serverMessage || "Customer not found.";
    }

    if (status === 422) {
      return serverMessage || "Please check the submitted details.";
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

/* =========================================================
   HOOK
========================================================= */

export default function useCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 8,
    totalPages: 0,
  });

  const [statusCounts, setStatusCounts] =
    useState<CustomerStatusCounts>({
      ALL: 0,
      ACTIVE: 0,
      INACTIVE: 0,
      BLOCKED: 0,
    });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] =
    useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================================================
     FETCH CUSTOMERS
  ========================================================= */

  const fetchCustomers = useCallback(
    async (
      params: CustomerFilters = {}
    ): Promise<CustomerListResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getCustomersService({
          ...params,
          page: params.page ?? 1,
          limit: params.limit ?? pagination.limit,
        });

        if (!result || !Array.isArray(result.rows)) {
          throw new Error("Unable to fetch customers.");
        }

        setCustomers(result.rows);

        const count = Number(
          result.count ?? result.rows.length
        );

        const page = Number(
          result.page ?? params.page ?? 1
        );

        const limit = Math.max(
          1,
          Number(
            result.limit ?? params.limit ?? pagination.limit
          )
        );

        const safeCount =
          Number.isFinite(count) && count >= 0
            ? count
            : result.rows.length;

        const safePage =
          Number.isFinite(page) && page > 0 ? page : 1;

        setPagination({
          count: safeCount,
          page: safePage,
          limit,
          totalPages: Number(
            result.totalPages ??
              Math.ceil(safeCount / limit)
          ),
        });

        return result;
      } catch (err: unknown) {
        const message = getCustomerErrorMessage(
          err,
          "Unable to fetch customers."
        );

        setError(message);
        toast.error(message);

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit]
  );

  /* =========================================================
     FETCH CUSTOMER DETAILS
  ========================================================= */

  const fetchCustomerDetails = useCallback(
    async (id: string | number): Promise<Customer> => {
      if (id === undefined || id === null || String(id).trim() === "") {
        const message = "Customer ID is required.";

        setError(message);
        toast.error(message);

        throw new Error(message);
      }

      setIsFetchingDetails(true);
      setError(null);

      try {
        const customer = await getCustomerDetailsService(id);

        if (!customer) {
          throw new Error("Unable to fetch customer details.");
        }

        setSelectedCustomer(customer);

        setCustomers((previous) =>
          previous.map((item) =>
            String(item.id) === String(id)
              ? { ...item, ...customer }
              : item
          )
        );

        return customer;
      } catch (err: unknown) {
        const message = getCustomerErrorMessage(
          err,
          "Unable to fetch customer details."
        );

        setError(message);
        toast.error(message);

        throw err;
      } finally {
        setIsFetchingDetails(false);
      }
    },
    []
  );

  /* =========================================================
     UPDATE CUSTOMER STATUS
  ========================================================= */

  const updateCustomerStatus = useCallback(
    async (
      id: string | number,
      status: CustomerStatus
    ): Promise<Customer> => {
      setIsUpdatingStatus(true);
      setError(null);

      try {
        const payload: UpdateCustomerStatusRequest = {
          status,
        };

        const response = await updateCustomerStatusService(
          id,
          payload
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update customer status."
          );
        }

        const updatedCustomer = response.data;

        setCustomers((previous) =>
          previous.map((customer) =>
            String(customer.id) === String(id)
              ? { ...customer, ...updatedCustomer }
              : customer
          )
        );

        setSelectedCustomer((previous) =>
          previous &&
          String(previous.id) === String(id)
            ? { ...previous, ...updatedCustomer }
            : previous
        );

        toast.success(
          response.message ||
            "Customer status updated successfully."
        );

        return updatedCustomer;
      } catch (err: unknown) {
        const message = getCustomerErrorMessage(
          err,
          "Unable to update customer status."
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

  /* =========================================================
     FETCH CUSTOMER STATUS COUNTS
  ========================================================= */

  const fetchCustomerStatusCounts = useCallback(
    async (): Promise<CustomerStatusCounts> => {
      try {
        const counts = await getCustomerStatusCountsService();

        setStatusCounts(counts);

        return counts;
      } catch (err: unknown) {
        const message = getCustomerErrorMessage(
          err,
          "Unable to fetch customer status counts."
        );

        setError(message);
        toast.error(message);

        throw err;
      }
    },
    []
  );

  /* =========================================================
     REFRESH CUSTOMER DETAILS
  ========================================================= */

  const refreshCustomerDetails = useCallback(
    async (id: string | number): Promise<Customer> => {
      setIsRefreshing(true);
      setError(null);

      try {
        const customer = await refreshCustomerDetailsService(id);

        setSelectedCustomer(customer);

        setCustomers((previous) =>
          previous.map((item) =>
            String(item.id) === String(id)
              ? { ...item, ...customer }
              : item
          )
        );

        return customer;
      } catch (err: unknown) {
        const message = getCustomerErrorMessage(
          err,
          "Unable to refresh customer details."
        );

        setError(message);
        toast.error(message);

        throw err;
      } finally {
        setIsRefreshing(false);
      }
    },
    []
  );

  /* =========================================================
     REFRESH CUSTOMERS
  ========================================================= */

  const refreshCustomers = useCallback(
    async (params: CustomerFilters = {}) => {
      return await fetchCustomers({
        ...params,
        page: params.page ?? pagination.page,
        limit: params.limit ?? pagination.limit,
      });
    },
    [fetchCustomers, pagination.page, pagination.limit]
  );

  /* =========================================================
     CLEAR HELPERS
  ========================================================= */

  const clearSelectedCustomer = useCallback(() => {
    setSelectedCustomer(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    customers,
    selectedCustomer,
    pagination,
    statusCounts,

    isLoading,
    isFetchingDetails,
    isUpdatingStatus,
    isRefreshing,
    error,

    fetchCustomers,
    fetchCustomerDetails,
    updateCustomerStatus,
    fetchCustomerStatusCounts,
    refreshCustomerDetails,
    refreshCustomers,

    clearSelectedCustomer,
    clearError,
  };
}
