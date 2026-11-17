
"use client";

import {
  useState,
  useCallback,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import {
  getShipmentsByOrderIdService,
  getShipmentByIdService,
  getShipmentByUuidService,
  getShipmentTrackingHistoryService,
  getLatestShipmentTrackingService,
  getShipmentByTrackingNumberService,
} from "@/src/services/user/shipment.service";

import type {
  ShipmentDetails,
  ShipmentTrackingEvent,
  LatestShipmentTracking,
} from "@/src/types/user/shipment.types";

/* =========================
   Error Message Handler
========================= */

const getShipmentErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Please check your shipment details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in to continue.";
    }

    if (status === 403) {
      return serverMessage || "You are not allowed to access this shipment.";
    }

    if (status === 404) {
      return serverMessage || "Shipment not found.";
    }

    if (status === 409) {
      return serverMessage || "This shipment conflicts with an existing request.";
    }

    if (status === 429) {
      return serverMessage || "Too many requests. Please try again later.";
    }

    if (status && status >= 500) {
      return "A server error occurred. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* =========================
   Shipment Hook
========================= */

export default function useShipment() {
  const [shipments, setShipments] = useState<ShipmentDetails[]>([]);

  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);

  const [trackingHistory, setTrackingHistory] = useState<
    ShipmentTrackingEvent[]
  >([]);

  const [latestTracking, setLatestTracking] =
    useState<LatestShipmentTracking | null>(null);

  const [isFetchingShipments, setIsFetchingShipments] = useState(false);

  const [isFetchingShipment, setIsFetchingShipment] = useState(false);

  const [isFetchingTrackingHistory, setIsFetchingTrackingHistory] =
    useState(false);

  const [isFetchingLatestTracking, setIsFetchingLatestTracking] =
    useState(false);

  const [isFetchingByTrackingNumber, setIsFetchingByTrackingNumber] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Fetch Shipments By Order ID
  ========================= */

  const fetchShipmentsByOrderId = useCallback(
    async (orderId: number | string) => {
      setIsFetchingShipments(true);
      setError(null);

      try {
        const response =
          await getShipmentsByOrderIdService(orderId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch shipment details."
          );
        }

        setShipments(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to fetch shipments. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingShipments(false);
      }
    },
    []
  );

  /* =========================
     Fetch Shipment By ID
  ========================= */

  const fetchShipmentById = useCallback(
    async (id: number | string) => {
      setIsFetchingShipment(true);
      setError(null);

      try {
        const response = await getShipmentByIdService(id);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch shipment details."
          );
        }

        const fetchedShipment = response.data;

        setShipment(fetchedShipment);

        setShipments((previousShipments) => {
          const alreadyExists = previousShipments.some(
            (item) => item.id === fetchedShipment.id
          );

          if (!alreadyExists) {
            return previousShipments;
          }

          return previousShipments.map((item) =>
            item.id === fetchedShipment.id
              ? fetchedShipment
              : item
          );
        });

        return fetchedShipment;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to fetch shipment details. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingShipment(false);
      }
    },
    []
  );

  /* =========================
     Fetch Shipment By UUID
  ========================= */

  const fetchShipmentByUuid = useCallback(
    async (uuid: string) => {
      setIsFetchingShipment(true);
      setError(null);

      try {
        const response = await getShipmentByUuidService(uuid);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch shipment details."
          );
        }

        const fetchedShipment = response.data;

        setShipment(fetchedShipment);

        return fetchedShipment;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to fetch shipment details. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingShipment(false);
      }
    },
    []
  );

  /* =========================
     Fetch Tracking History
  ========================= */

  const fetchShipmentTrackingHistory = useCallback(
    async (shipmentId: number | string) => {
      setIsFetchingTrackingHistory(true);
      setError(null);

      try {
        const response =
          await getShipmentTrackingHistoryService(shipmentId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch tracking history."
          );
        }

        setTrackingHistory(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to fetch tracking history. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingTrackingHistory(false);
      }
    },
    []
  );

  /* =========================
     Fetch Latest Tracking
  ========================= */

  const fetchLatestShipmentTracking = useCallback(
    async (shipmentId: number | string) => {
      setIsFetchingLatestTracking(true);
      setError(null);

      try {
        const response =
          await getLatestShipmentTrackingService(shipmentId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch latest tracking status."
          );
        }

        setLatestTracking(response.data);

        return response.data;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to fetch latest tracking status. Please try again."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingLatestTracking(false);
      }
    },
    []
  );

  /* =========================
     Fetch Shipment By Tracking Number
  ========================= */

  const fetchShipmentByTrackingNumber = useCallback(
    async (trackingNumber: string) => {
      setIsFetchingByTrackingNumber(true);
      setError(null);

      try {
        const response =
          await getShipmentByTrackingNumberService(trackingNumber);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to find shipment."
          );
        }

        const fetchedShipment = response.data;

        setShipment(fetchedShipment);

        return fetchedShipment;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to find shipment. Please check your tracking number."
        );

        setError(message);
        toast.error(message);

        return null;
      } finally {
        setIsFetchingByTrackingNumber(false);
      }
    },
    []
  );

  /* =========================
     Refresh Shipment Tracking
  ========================= */

  const refreshShipmentTracking = useCallback(
    async (shipmentId: number | string) => {
      const [shipmentResult, historyResult, latestResult] =
        await Promise.all([
          fetchShipmentById(shipmentId),
          fetchShipmentTrackingHistory(shipmentId),
          fetchLatestShipmentTracking(shipmentId),
        ]);

      return {
        shipment: shipmentResult,
        trackingHistory: historyResult,
        latestTracking: latestResult,
      };
    },
    [
      fetchShipmentById,
      fetchShipmentTrackingHistory,
      fetchLatestShipmentTracking,
    ]
  );

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Reset Shipment State
  ========================= */

  const resetShipment = useCallback(() => {
    setShipments([]);
    setShipment(null);
    setTrackingHistory([]);
    setLatestTracking(null);
    setError(null);
  }, []);

  /* =========================
     Return Hook Values
  ========================= */

  return {
    shipments,
    shipment,
    trackingHistory,
    latestTracking,

    isFetchingShipments,
    isFetchingShipment,
    isFetchingTrackingHistory,
    isFetchingLatestTracking,
    isFetchingByTrackingNumber,

    error,

    fetchShipmentsByOrderId,
    fetchShipmentById,
    fetchShipmentByUuid,
    fetchShipmentTrackingHistory,
    fetchLatestShipmentTracking,
    fetchShipmentByTrackingNumber,

    refreshShipmentTracking,

    clearError,
    resetShipment,
  };
}
