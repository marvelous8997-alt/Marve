
"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getShipmentsService,
  getShipmentDetailsService,
  createShipmentService,
  updateShipmentStatusService,
  syncShipmentTrackingService,
} from "@/src/services/admin/shipment.service";

import type {
  Shipment,
  ShipmentFilters,
  ShipmentListResult,
  ShipmentStatus,
} from "@/src/types/admin/shipment.types";

import type {
  CreateShipmentRequest,
  UpdateShipmentStatusRequest,
} from "@/src/api/admin/shipment.api";

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getShipmentErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid shipment details.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return (
        serverMessage ||
        "You do not have permission to manage shipments."
      );
    }

    if (status === 404) {
      return serverMessage || "Shipment not found.";
    }

    if (status === 409) {
      return (
        serverMessage ||
        "This shipment cannot be processed in its current state."
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

export default function useShipment() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] =
    useState<Shipment | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
const [isSyncingTracking, setIsSyncingTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================================================
     FETCH SHIPMENTS
  ========================================================= */

  const fetchShipments = useCallback(
    async (
      params: ShipmentFilters = {}
    ): Promise<ShipmentListResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getShipmentsService(params);

        if (!result || !Array.isArray(result.shipments)) {
          throw new Error("Unable to fetch shipments.");
        }

        setShipments(result.shipments);

        const meta = result.pagination;
        const total = Number(
          meta?.total ?? result.shipments.length
        );

        const page = Number(
          meta?.page ?? params.page ?? 1
        );

        const limit = Math.max(
          1,
          Number(meta?.limit ?? params.limit ?? pagination.limit)
        );

        const safeTotal = Number.isFinite(total)
          ? total
          : result.shipments.length;

        const safePage =
          Number.isFinite(page) && page > 0 ? page : 1;

        setPagination({
          count: safeTotal,
          page: safePage,
          limit,
          totalPages: Number(
            meta?.totalPages ??
              Math.ceil(safeTotal / limit)
          ),
        });

        return result;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to fetch shipments."
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
     FETCH SHIPMENT DETAILS
  ========================================================= */

  const fetchShipmentDetails = useCallback(
    async (uuid: string) => {
      if (!uuid) {
        const message = "Shipment ID is required.";
        setError(message);
        toast.error(message);
        throw new Error(message);
      }

      setIsFetchingDetails(true);
      setError(null);

      try {
        const shipment = await getShipmentDetailsService(uuid);

        if (!shipment) {
          throw new Error("Unable to fetch shipment details.");
        }

        setSelectedShipment(shipment);

        // Keep the corresponding shipment in the current list up to date.
        setShipments((previous) =>
          previous.map((item) =>
            item.uuid === uuid ? shipment : item
          )
        );

        return shipment;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to fetch shipment details."
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
     CREATE SHIPMENT
  ========================================================= */

  const createShipment = useCallback(
    async (values: CreateShipmentRequest) => {
      setIsCreating(true);
      setError(null);

      try {
        const response = await createShipmentService(values);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to create shipment."
          );
        }

        const createdShipment = response.data;

        setShipments((previous) => [
          createdShipment,
          ...previous,
        ]);

        setSelectedShipment(createdShipment);

        setPagination((previous) => {
          const count = previous.count + 1;

          return {
            ...previous,
            count,
            totalPages: Math.ceil(
              count / Math.max(previous.limit, 1)
            ),
          };
        });

        toast.success(
          response.message || "Shipment created successfully."
        );

        return createdShipment;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to create shipment."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  /* =========================================================
     UPDATE SHIPMENT STATUS
  ========================================================= */

  const updateShipmentStatus = useCallback(
    async (
      uuid: string,
      status: ShipmentStatus,
      additionalData: Omit<
        UpdateShipmentStatusRequest,
        "status"
      > = {}
    ) => {
      if (!uuid) {
        const message = "Shipment ID is required.";
        setError(message);
        toast.error(message);
        throw new Error(message);
      }

      setIsUpdatingStatus(true);
      setError(null);

      try {
        const payload: UpdateShipmentStatusRequest = {
          ...additionalData,
          status,
        };

        const response = await updateShipmentStatusService(
          uuid,
          payload
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Unable to update shipment status."
          );
        }

        const updatedShipment = response.data;

        setShipments((previous) =>
          previous.map((shipment) =>
            shipment.uuid === uuid
              ? updatedShipment
              : shipment
          )
        );

        setSelectedShipment((previous) =>
          previous?.uuid === uuid
            ? updatedShipment
            : previous
        );

        toast.success(
          response.message ||
            "Shipment status updated successfully."
        );

        return updatedShipment;
      } catch (err: unknown) {
        const message = getShipmentErrorMessage(
          err,
          "Unable to update shipment status."
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
   SYNC SHIPMENT TRACKING
========================================================= */

const syncShipmentTracking = useCallback(
  async (shipmentId: number) => {
    if (!shipmentId) {
      const message = "Shipment ID is required.";
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setIsSyncingTracking(true);
    setError(null);

    try {
      const response = await syncShipmentTrackingService(
        String(shipmentId)
      );

      if (!response.success || !response.data?.shipment) {
        throw new Error(
          response.message || "Unable to sync shipment tracking."
        );
      }

      const updatedShipment = response.data.shipment;

      setSelectedShipment((previous) =>
        previous?.id === shipmentId
          ? updatedShipment
          : previous
      );

      setShipments((previous) =>
        previous.map((shipment) =>
          shipment.id === shipmentId
            ? updatedShipment
            : shipment
        )
      );

      toast.success(
        response.message || "Shipment tracking synced successfully."
      );

      return response.data;
    } catch (err: unknown) {
      const message = getShipmentErrorMessage(
        err,
        "Unable to sync shipment tracking."
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsSyncingTracking(false);
    }
  },
  []
);

  /* =========================================================
     REFRESH SHIPMENT DETAILS
  ========================================================= */

  const refreshShipmentDetails = useCallback(
    async (uuid: string) => {
      return await fetchShipmentDetails(uuid);
    },
    [fetchShipmentDetails]
  );

    /* =========================================================
     AUTOMATIC SHIPMENT TRACKING REFRESH
  ========================================================= */

  useEffect(() => {
    const uuid = selectedShipment?.uuid;

    if (!uuid) return;

    const finalStatuses: ShipmentStatus[] = [
      "DELIVERED",
      "FAILED",
      "CANCELLED",
      "RETURN_TO_ORIGIN",
    ];

    if (
      finalStatuses.includes(selectedShipment.status)
    ) {
      return;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const updatedShipment =
          await getShipmentDetailsService(uuid);

        if (!updatedShipment) return;

        setSelectedShipment((previous) =>
          previous?.uuid === uuid
            ? updatedShipment
            : previous
        );

        setShipments((previous) =>
          previous.map((shipment) =>
            shipment.uuid === uuid
              ? updatedShipment
              : shipment
          )
        );
      } catch {
        // Background refresh errors are intentionally silent.
      }
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    selectedShipment?.uuid,
    selectedShipment?.status,
  ]);

  /* =========================================================
     CLEAR HELPERS
  ========================================================= */

  const clearSelectedShipment = useCallback(() => {
    setSelectedShipment(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================================================
     RETURN
  ========================================================= */

return {
  shipments,
  selectedShipment,
  pagination,

  isLoading,
  isFetchingDetails,
  isCreating,
  isUpdatingStatus,
  isSyncingTracking,
  error,

  fetchShipments,
  fetchShipmentDetails,
  createShipment,
  updateShipmentStatus,
  syncShipmentTracking,
  refreshShipmentDetails,

  clearSelectedShipment,
  clearError,
};
}
