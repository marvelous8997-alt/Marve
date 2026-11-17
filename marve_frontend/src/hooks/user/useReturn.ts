
"use client";

import {
  useState,
  useCallback,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  createReturnRequestService,
  getReturnRequestsService,
  getReturnRequestByUuidService,
  getReturnRequestsByOrderUuidService,
  cancelReturnRequestService,
  getReturnShipmentsByOrderUuidService,
  getReturnShipmentByIdService,
  getReturnShipmentByUuidService,
  getReturnShipmentTrackingHistoryService,
  getLatestReturnShipmentTrackingService,
  getReturnShipmentByTrackingNumberService,
} from "@/src/services/user/return.service";

import type {
  ReturnRequestDetails,
  ReturnShipmentDetails,
  ReturnTrackingEvent,
  LatestReturnShipmentTracking,
  CreateReturnRequestPayload,
  GetReturnRequestsQuery,
} from "@/src/types/user/return.types";

import {
  createReturnRequestSchema,
} from "@/src/validations/user/return.validation";

/* =========================
   Error Message Handler
========================= */

const getReturnErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Please check your return request details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in to manage your returns.";
    }

    if (status === 403) {
      return serverMessage || "You are not allowed to perform this action.";
    }

    if (status === 404) {
      return serverMessage || "Return information not found.";
    }

    if (status === 409) {
      return serverMessage || "This return request conflicts with existing data.";
    }

    if (status === 422) {
      return serverMessage || "Your return request cannot be processed.";
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

/* =========================
   Validation Error Handler
========================= */

const getReturnValidationMessage = (err: unknown): string => {
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

  return "Please check your return request details.";
};

/* =========================
   Return Hook
========================= */

export default function useReturn() {
  const [returnRequests, setReturnRequests] = useState<
    ReturnRequestDetails[]
  >([]);

  const [returnRequest, setReturnRequest] =
    useState<ReturnRequestDetails | null>(null);

  const [returnRequestsByOrder, setReturnRequestsByOrder] =
    useState<ReturnRequestDetails[]>([]);

  const [returnShipments, setReturnShipments] = useState<
    ReturnShipmentDetails[]
  >([]);

  const [returnShipment, setReturnShipment] =
    useState<ReturnShipmentDetails | null>(null);

  const [trackingHistory, setTrackingHistory] = useState<
    ReturnTrackingEvent[]
  >([]);

  const [latestTracking, setLatestTracking] =
    useState<LatestReturnShipmentTracking | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRequest, setIsFetchingRequest] = useState(false);
  const [isFetchingByOrder, setIsFetchingByOrder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [isFetchingShipments, setIsFetchingShipments] = useState(false);
  const [isFetchingShipment, setIsFetchingShipment] = useState(false);
  const [isFetchingTracking, setIsFetchingTracking] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Get All Return Requests
  ========================= */

  const fetchReturnRequests = useCallback(
    async (
      params?: GetReturnRequestsQuery,
      showErrorToast = false
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getReturnRequestsService(params);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch return requests."
          );
        }

        setReturnRequests(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch return requests. Please try again."
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
     Get Return Request By UUID
  ========================= */

  const fetchReturnRequestByUuid = useCallback(
    async (uuid: string) => {
      setIsFetchingRequest(true);
      setError(null);
      setReturnRequest(null);

      try {
        const response = await getReturnRequestByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch return request."
          );
        }

        setReturnRequest(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch return request. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingRequest(false);
      }
    },
    []
  );

  /* =========================
     Get Return Requests By Order UUID
  ========================= */

const fetchReturnRequestsByOrderUuid = useCallback(
  async (orderUuid: string) => {
    setIsFetchingByOrder(true);
    setError(null);
    setReturnRequestsByOrder([]);

    try {
      const response =
        await getReturnRequestsByOrderUuidService(orderUuid);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to fetch order return requests."
        );
      }

      setReturnRequestsByOrder(response.data);

      return response.data;
    } catch (err: unknown) {
      const message = getReturnErrorMessage(
        err,
        "Unable to fetch order return requests. Please try again."
      );

      setError(message);

      return null;
    } finally {
      setIsFetchingByOrder(false);
    }
  },
  []
);
  /* =========================
     Create Return Request
  ========================= */

  const createReturnRequest = useCallback(
    async (payload: CreateReturnRequestPayload) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const validationResult =
          createReturnRequestSchema.safeParse({
            orderUuid: payload.orderUuid,
            reason: payload.reason,
            description: payload.description ?? "",
            items: payload.items,
          });

        if (!validationResult.success) {
          const message = getReturnValidationMessage(
            validationResult.error
          );

          setError(message);
          toast.error(message);

          return null;
        }

        const validatedPayload: CreateReturnRequestPayload = {
          ...validationResult.data,
          description:
            validationResult.data.description?.trim() || undefined,
          images: payload.images ?? [],
        };

        const response =
          await createReturnRequestService(validatedPayload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to submit return request."
          );
        }

        const createdRequest = response.data;

        setReturnRequest(createdRequest);

        setReturnRequests((previous) => [
          createdRequest,
          ...previous.filter(
            (item) => item.uuid !== createdRequest.uuid
          ),
        ]);

        setReturnRequestsByOrder((previous) => [
          createdRequest,
          ...previous.filter(
            (item) => item.uuid !== createdRequest.uuid
          ),
        ]);

        toast.success(
          response.message || "Return request submitted successfully."
        );

        return createdRequest;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to submit return request. Please try again."
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
     Cancel Return Request
  ========================= */

  const cancelReturnRequest = useCallback(
    async (uuid: string) => {
      setIsCancelling(true);
      setError(null);

      try {
        const response = await cancelReturnRequestService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to cancel return request."
          );
        }

        const cancelledRequest = response.data;

        setReturnRequest((previous) =>
          previous?.uuid === cancelledRequest.uuid
            ? cancelledRequest
            : previous
        );

        setReturnRequests((previous) =>
          previous.map((item) =>
            item.uuid === cancelledRequest.uuid
              ? cancelledRequest
              : item
          )
        );

        setReturnRequestsByOrder((previous) =>
          previous.map((item) =>
            item.uuid === cancelledRequest.uuid
              ? cancelledRequest
              : item
          )
        );

        toast.success(
          response.message || "Return request cancelled successfully."
        );

        return cancelledRequest;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to cancel return request. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsCancelling(false);
      }
    },
    []
  );

  /* =========================
     Get Return Shipments By Order UUID
  ========================= */

  const fetchReturnShipmentsByOrderUuid = useCallback(
    async (orderUuid: string) => {
      setIsFetchingShipments(true);
      setError(null);

      try {
        const response =
          await getReturnShipmentsByOrderUuidService(orderUuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch return shipments."
          );
        }

        setReturnShipments(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch return shipments. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingShipments(false);
      }
    },
    []
  );

  /* =========================
     Get Return Shipment By ID
  ========================= */

  const fetchReturnShipmentById = useCallback(
    async (id: number | string) => {
      setIsFetchingShipment(true);
      setError(null);
      setReturnShipment(null);

      try {
        const response = await getReturnShipmentByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch return shipment."
          );
        }

        setReturnShipment(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch return shipment. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingShipment(false);
      }
    },
    []
  );

  /* =========================
     Get Return Shipment By UUID
  ========================= */

  const fetchReturnShipmentByUuid = useCallback(
    async (uuid: string) => {
      setIsFetchingShipment(true);
      setError(null);
      setReturnShipment(null);

      try {
        const response = await getReturnShipmentByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch return shipment."
          );
        }

        setReturnShipment(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch return shipment. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingShipment(false);
      }
    },
    []
  );

  /* =========================
     Get Return Shipment Tracking History
  ========================= */

  const fetchReturnShipmentTrackingHistory = useCallback(
    async (shipmentId: number | string) => {
      setIsFetchingTracking(true);
      setError(null);

      try {
        const response =
          await getReturnShipmentTrackingHistoryService(shipmentId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch tracking history."
          );
        }

        setTrackingHistory(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch tracking history. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingTracking(false);
      }
    },
    []
  );

  /* =========================
     Get Latest Return Shipment Tracking
  ========================= */

  const fetchLatestReturnShipmentTracking = useCallback(
    async (shipmentId: number | string) => {
      setIsFetchingTracking(true);
      setError(null);

      try {
        const response =
          await getLatestReturnShipmentTrackingService(shipmentId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch latest tracking."
          );
        }

        setLatestTracking(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch latest tracking. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingTracking(false);
      }
    },
    []
  );

  /* =========================
     Get Return Shipment By Tracking Number
  ========================= */

  const fetchReturnShipmentByTrackingNumber = useCallback(
    async (trackingNumber: string) => {
      setIsFetchingShipment(true);
      setError(null);
      setReturnShipment(null);

      try {
        const response =
          await getReturnShipmentByTrackingNumberService(trackingNumber);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch shipment by tracking number."
          );
        }

        setReturnShipment(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getReturnErrorMessage(
          err,
          "Unable to fetch shipment. Please try again."
        );

        setError(message);

        return null;
      } finally {
        setIsFetchingShipment(false);
      }
    },
    []
  );

  /* =========================
     Refresh Return Requests
  ========================= */

  const refreshReturnRequests = useCallback(
    async (params?: GetReturnRequestsQuery) => {
      return await fetchReturnRequests(params, true);
    },
    [fetchReturnRequests]
  );

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Clear Return Data
  ========================= */

const clearReturnData = useCallback(() => {
  setReturnRequests([]);
  setReturnRequest(null);
  setReturnRequestsByOrder([]);

  setReturnShipments([]);
  setReturnShipment(null);

  setTrackingHistory([]);
  setLatestTracking(null);

  setError(null);
}, []);

  /* =========================
     Return Hook Values
  ========================= */

  return {
    returnRequests,
    returnRequest,
    returnRequestsByOrder,

    returnShipments,
    returnShipment,
    trackingHistory,
    latestTracking,

    isLoading,
    isFetchingRequest,
    isFetchingByOrder,
    isSubmitting,
    isCancelling,

    isFetchingShipments,
    isFetchingShipment,
    isFetchingTracking,

    error,

    fetchReturnRequests,
    fetchReturnRequestByUuid,
    fetchReturnRequestsByOrderUuid,
    createReturnRequest,
    cancelReturnRequest,

    fetchReturnShipmentsByOrderUuid,
    fetchReturnShipmentById,
    fetchReturnShipmentByUuid,
    fetchReturnShipmentTrackingHistory,
    fetchLatestReturnShipmentTracking,
    fetchReturnShipmentByTrackingNumber,

    refreshReturnRequests,
    clearError,
    clearReturnData,
  };
}
