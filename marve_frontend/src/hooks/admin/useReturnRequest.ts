
"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getReturnRequestsService,
  getReturnRequestDetailsService,
  approveReturnRequestService,
  rejectReturnRequestService,
  retryReturnPickupService,
  refreshReturnTrackingService,
  getReturnStatusCountsService,
} from "@/src/services/admin/returnRequest.service";

import type {
  ReturnRequest,
  ReturnRequestFilters,
  ReturnRequestListResult,
  ReturnRequestStatusCounts,
  ApproveReturnRequestPayload,
  RejectReturnRequestPayload,
} from "@/src/types/admin/returnRequest.types";

import type {
  ReturnRequestStatus,
} from "@/src/types/admin/returnRequest.types";

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getReturnRequestErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid return request details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage return requests."
      );
    }

    if (status === 404) {
      return serverMessage || "Return request not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "This return request cannot be processed in its current state."
      );
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
    return err.message || fallback;
  }

  return fallback;
};

/* =========================================================
   HOOK
========================================================= */

export default function useReturnRequest() {
  const [returnRequests, setReturnRequests] = useState<
    ReturnRequest[]
  >([]);

  const [selectedReturnRequest, setSelectedReturnRequest] =
    useState<ReturnRequest | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [statusCounts, setStatusCounts] =
    useState<ReturnRequestStatusCounts | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] =
    useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
const [isRetryingPickup, setIsRetryingPickup] =
  useState(false);
const [isRefreshingTracking, setIsRefreshingTracking] =
  useState(false);
  const [isFetchingStatusCounts, setIsFetchingStatusCounts] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================================================
     FETCH RETURN REQUESTS
  ========================================================= */

  const fetchReturnRequests = useCallback(
    async (
      params: ReturnRequestFilters = {}
    ): Promise<ReturnRequestListResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getReturnRequestsService(params);

        if (!result || !Array.isArray(result.rows)) {
          throw new Error("Unable to fetch return requests.");
        }

        setReturnRequests(result.rows);

        const count = Number(
          result.count ?? result.rows.length
        );

        const page = Number(
          result.page ?? params.page ?? 1
        );

        const limit = Math.max(
          1,
          Number(result.limit ?? params.limit ?? pagination.limit)
        );

        const safeCount = Number.isFinite(count)
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
        const message = getReturnRequestErrorMessage(
          err,
          "Unable to fetch return requests."
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
     FETCH RETURN REQUEST DETAILS
  ========================================================= */

  const fetchReturnRequestDetails = useCallback(
    async (uuid: string): Promise<ReturnRequest> => {
      if (!uuid) {
        const message = "Return request ID is required.";
        setError(message);
        toast.error(message);
        throw new Error(message);
      }

      setIsFetchingDetails(true);
      setError(null);

      try {
        const returnRequest =
          await getReturnRequestDetailsService(uuid);

        if (!returnRequest) {
          throw new Error(
            "Unable to fetch return request details."
          );
        }

        setSelectedReturnRequest(returnRequest);

        setReturnRequests((previous) =>
          previous.map((item) =>
            item.uuid === uuid ? returnRequest : item
          )
        );

        return returnRequest;
      } catch (err: unknown) {
        const message = getReturnRequestErrorMessage(
          err,
          "Unable to fetch return request details."
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
     APPROVE RETURN REQUEST
  ========================================================= */

  const approveReturnRequest = useCallback(
    async (
      uuid: string,
      values: ApproveReturnRequestPayload = {}
    ): Promise<ReturnRequest> => {
      if (!uuid) {
        const message = "Return request ID is required.";
        setError(message);
        toast.error(message);
        throw new Error(message);
      }

      setIsApproving(true);
      setError(null);

      try {
        const response = await approveReturnRequestService(
          uuid,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to approve return request."
          );
        }

        const updatedReturnRequest = response.data;

        setSelectedReturnRequest((previous) =>
          previous?.uuid === uuid
            ? updatedReturnRequest
            : previous
        );

        setReturnRequests((previous) =>
          previous.map((item) =>
            item.uuid === uuid
              ? updatedReturnRequest
              : item
          )
        );

        toast.success(
          response.message ||
            "Return request approved successfully."
        );

        return updatedReturnRequest;
      } catch (err: unknown) {
        const message = getReturnRequestErrorMessage(
          err,
          "Unable to approve return request."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsApproving(false);
      }
    },
    []
  );

  /* =========================================================
     REJECT RETURN REQUEST
  ========================================================= */

  const rejectReturnRequest = useCallback(
    async (
      uuid: string,
      values: RejectReturnRequestPayload
    ): Promise<ReturnRequest> => {
      if (!uuid) {
        const message = "Return request ID is required.";
        setError(message);
        toast.error(message);
        throw new Error(message);
      }

      setIsRejecting(true);
      setError(null);

      try {
        const response = await rejectReturnRequestService(
          uuid,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to reject return request."
          );
        }

        const updatedReturnRequest = response.data;

        setSelectedReturnRequest((previous) =>
          previous?.uuid === uuid
            ? updatedReturnRequest
            : previous
        );

        setReturnRequests((previous) =>
          previous.map((item) =>
            item.uuid === uuid
              ? updatedReturnRequest
              : item
          )
        );

        toast.success(
          response.message ||
            "Return request rejected successfully."
        );

        return updatedReturnRequest;
      } catch (err: unknown) {
        const message = getReturnRequestErrorMessage(
          err,
          "Unable to reject return request."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsRejecting(false);
      }
    },
    []
  );

  /* =========================================================
   RETRY RETURN PICKUP
========================================================= */

const retryReturnPickup = useCallback(
  async (uuid: string): Promise<ReturnRequest> => {
    if (!uuid) {
      const message = "Return request ID is required.";
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setIsRetryingPickup(true);
    setError(null);

    try {
      const response = await retryReturnPickupService(uuid);

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to retry return pickup."
        );
      }

      const updatedReturnRequest = response.data.returnRequest;

      if (!updatedReturnRequest) {
        throw new Error(
          "Return pickup response is missing return request details."
        );
      }

      setSelectedReturnRequest((previous) =>
        previous?.uuid === uuid
          ? updatedReturnRequest
          : previous
      );

      setReturnRequests((previous) =>
        previous.map((item) =>
          item.uuid === uuid
            ? updatedReturnRequest
            : item
        )
      );

      toast.success(
        response.message ||
          "Return pickup retry processed successfully."
      );

      return updatedReturnRequest;
    } catch (err: unknown) {
      const message = getReturnRequestErrorMessage(
        err,
        "Unable to retry return pickup."
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsRetryingPickup(false);
    }
  },
  []
);

/* =========================================================
   REFRESH RETURN TRACKING
========================================================= */

const refreshReturnTracking = useCallback(
  async (uuid: string): Promise<ReturnRequest> => {
    if (!uuid) {
      const message = "Return request ID is required.";
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setIsRefreshingTracking(true);
    setError(null);

    try {
      const updatedReturnRequest =
        await refreshReturnTrackingService(uuid);

      if (!updatedReturnRequest) {
        throw new Error(
          "Unable to refresh return tracking."
        );
      }

      setSelectedReturnRequest((previous) =>
        previous?.uuid === uuid
          ? updatedReturnRequest
          : previous
      );

      setReturnRequests((previous) =>
        previous.map((item) =>
          item.uuid === uuid
            ? updatedReturnRequest
            : item
        )
      );

      toast.success(
        "Return tracking refreshed successfully."
      );

      return updatedReturnRequest;
    } catch (err: unknown) {
      const message = getReturnRequestErrorMessage(
        err,
        "Unable to refresh return tracking."
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsRefreshingTracking(false);
    }
  },
  []
);

  /* =========================================================
     FETCH RETURN REQUEST STATUS COUNTS
  ========================================================= */

  const fetchReturnStatusCounts = useCallback(
    async (): Promise<ReturnRequestStatusCounts> => {
      setIsFetchingStatusCounts(true);
      setError(null);

      try {
        const counts = await getReturnStatusCountsService();

        if (!counts) {
          throw new Error(
            "Unable to fetch return request status counts."
          );
        }

        setStatusCounts(counts);

        return counts;
      } catch (err: unknown) {
        const message = getReturnRequestErrorMessage(
          err,
          "Unable to fetch return request status counts."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsFetchingStatusCounts(false);
      }
    },
    []
  );

  /* =========================================================
     REFRESH RETURN REQUEST DETAILS
  ========================================================= */

  const refreshReturnRequestDetails = useCallback(
    async (uuid: string) => {
      return fetchReturnRequestDetails(uuid);
    },
    [fetchReturnRequestDetails]
  );

  /* =========================================================
     REFRESH RETURN REQUEST STATUS
  ========================================================= */

  const refreshReturnRequestStatus = useCallback(
    async () => {
      return fetchReturnStatusCounts();
    },
    [fetchReturnStatusCounts]
  );

  /* =========================================================
     CLEAR HELPERS
  ========================================================= */

  const clearSelectedReturnRequest = useCallback(() => {
    setSelectedReturnRequest(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    returnRequests,
    selectedReturnRequest,
    pagination,
    statusCounts,

    isLoading,
    isFetchingDetails,
    isApproving,
    isRejecting,
    isRetryingPickup,
    isFetchingStatusCounts,
    isRefreshingTracking,
    error,

    fetchReturnRequests,
    fetchReturnRequestDetails,
    approveReturnRequest,
    rejectReturnRequest,
    retryReturnPickup,
    fetchReturnStatusCounts,

    refreshReturnRequestDetails,
    refreshReturnRequestStatus,
    refreshReturnTracking,

    clearSelectedReturnRequest,
    clearError,
  };
}
