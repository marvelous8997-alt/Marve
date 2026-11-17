
import {
  getShipmentsApi,
  getShipmentApi,
  createShipmentApi,
  updateShipmentStatusApi,
  syncShipmentTrackingApi,
} from "@/src/api/admin/shipment.api";

import type {
  GetShipmentsRequest,
  GetShipmentsApiResponse,
  GetShipmentApiResponse,
  CreateShipmentRequest,
  CreateShipmentApiResponse,
  UpdateShipmentStatusRequest,
  UpdateShipmentStatusApiResponse,
  ShipmentTrackingSyncApiResponse,
} from "@/src/api/admin/shipment.api";

import type {
  Shipment,
  ShipmentFilters,
  ShipmentListResult,
  ShipmentPagination,
  ShipmentApiResponse,
} from "@/src/types/admin/shipment.types";

/* =========================================================
   RESPONSE NORMALIZATION HELPERS
========================================================= */

const normalizePagination = (
  pagination?: Partial<ShipmentPagination> | null,
  fallback?: {
    page?: number;  
    limit?: number;
    total?: number;
  }
): ShipmentPagination => {
  const page = Number(
    pagination?.page ?? fallback?.page ?? 1
  );

  const limit = Number(
    pagination?.limit ?? fallback?.limit ?? 10
  );

  const total = Number(
    pagination?.total ?? fallback?.total ?? 0
  );

  return {
    page,
    limit,
    total,
    totalPages: Number(
      pagination?.totalPages ??
        Math.ceil(total / Math.max(limit, 1))
    ),
  };
};

/* =========================================================
   NORMALIZE SHIPMENT LIST
========================================================= */

const normalizeShipmentList = (
  response: GetShipmentsApiResponse,
  params: GetShipmentsRequest = {}
): ShipmentListResult => {
  const data = response.data;

  if (Array.isArray(data)) {
    return {
      shipments: data,
      pagination: normalizePagination(undefined, {
        page: params.page,
        limit: params.limit,
        total: data.length,
      }),
    };
  }

  const result = data as ShipmentListResult & {
    rows?: Shipment[];
    shipments?: Shipment[];
    data?: Shipment[];
    pagination?: Partial<ShipmentPagination>;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };

  // Supports Sequelize rows response and common API formats.
  const shipments = Array.isArray(result.rows)
    ? result.rows
    : Array.isArray(result.shipments)
      ? result.shipments
      : Array.isArray(result.data)
        ? result.data
        : [];

  const total = Number(
    result.total ?? result.count ?? shipments.length
  );

  return {
    shipments,
    pagination: normalizePagination(
      result.pagination ?? {
        total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      {
        page: params.page,
        limit: params.limit,
        total,
      }
    ),
  };
};

/* =========================================================
   GET SHIPMENTS SERVICE
========================================================= */

export const getShipmentsService = async (
  params: ShipmentFilters = {}
): Promise<ShipmentListResult> => {
  const response = await getShipmentsApi(params);

  return normalizeShipmentList(response, params);
};

/* =========================================================
   GET SHIPMENT DETAILS SERVICE
========================================================= */

export const getShipmentDetailsService = async (
  uuid: string
): Promise<Shipment> => {
  const response: GetShipmentApiResponse =
    await getShipmentApi(uuid);

  return response.data;
};

/* =========================================================
   CREATE SHIPMENT SERVICE
========================================================= */

export const createShipmentService = async (
  values: CreateShipmentRequest
): Promise<CreateShipmentApiResponse> => {
  return createShipmentApi(values);
};
/* =========================================================
   UPDATE SHIPMENT STATUS SERVICE
========================================================= */

export const updateShipmentStatusService = async (
  uuid: string,
  values: UpdateShipmentStatusRequest
): Promise<UpdateShipmentStatusApiResponse> => {
  return updateShipmentStatusApi(uuid, values);
};


/* =========================================================
   SYNC SHIPMENT TRACKING SERVICE
========================================================= */

export const syncShipmentTrackingService = async (
  shipmentId: string
): Promise<ShipmentTrackingSyncApiResponse> => {
  return await syncShipmentTrackingApi(shipmentId);
};


/* =========================================================
   REFRESH SHIPMENT DETAILS SERVICE
========================================================= */

export const refreshShipmentDetailsService = async (
  uuid: string
): Promise<Shipment> => {
  return await getShipmentDetailsService(uuid);
};

/* =========================================================
   EXPORT TYPES FOR CONVENIENCE
========================================================= */

export type {
  Shipment,
  ShipmentFilters,
  ShipmentListResult,
  ShipmentPagination,
  ShipmentApiResponse,
  GetShipmentsRequest,
  CreateShipmentRequest,
  UpdateShipmentStatusRequest,
};
