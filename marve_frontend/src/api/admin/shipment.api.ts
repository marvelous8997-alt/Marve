
import axiosInstance from "@/src/lib/axios";

import type {
  Shipment,
  ShipmentFilters,
  ShipmentListResult,
  ShipmentApiResponse,
  ShipmentStatus,
  PackageDimensions,
  ShipmentTrackingEvent,
  ShipmentTrackingSyncResult,
} from "@/src/types/admin/shipment.types";

/* =========================================================
   API ENDPOINTS
========================================================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  SHIPMENT: {
    LIST: "/admin/shipments/list",

    DETAILS: (identifier: string) =>
      `/admin/shipments/list/${encodeURIComponent(identifier)}`,

    CREATE: "/admin/shipments/create",

    STATUS: (identifier: string) =>
      `/admin/shipments/status/${encodeURIComponent(identifier)}`,

    TRACKING: (identifier: string) =>
      `/admin/shipments/${encodeURIComponent(identifier)}/tracking`,

    LATEST_TRACKING: (identifier: string) =>
      `/admin/shipments/${encodeURIComponent(identifier)}/tracking/latest`,
    SYNC_TRACKING: (identifier: string) =>
  `/admin/shipments/${encodeURIComponent(identifier)}/tracking/sync`,
  },
};

/* =========================================================
   REQUEST TYPES
========================================================= */

export interface GetShipmentsRequest extends ShipmentFilters {
  page?: number;
  limit?: number;
}

export interface CreateShipmentRequest {
  orderIdentifier: number | string;
  courierId?: number | null;
  notes?: string | null;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
  location?: string | null;
  description?: string | null;
  eventAt?: string;
  source?: "ADMIN";
}

/* =========================================================
   RESPONSE TYPES
========================================================= */

export type GetShipmentsApiResponse = ShipmentApiResponse<
  ShipmentListResult | Shipment[]
>;

export type GetShipmentApiResponse =
  ShipmentApiResponse<Shipment>;

export type CreateShipmentApiResponse =
  ShipmentApiResponse<Shipment>;

export type UpdateShipmentStatusApiResponse =
  ShipmentApiResponse<Shipment>;

export type ShipmentTrackingApiResponse = ShipmentApiResponse<
  ShipmentTrackingEvent[]
>;

export type LatestShipmentTrackingApiResponse =
  ShipmentApiResponse<ShipmentTrackingEvent | null>;

  export type ShipmentTrackingSyncApiResponse =
  ShipmentApiResponse<ShipmentTrackingSyncResult>;
/* =========================================================
   QUERY PARAMETER HELPER
========================================================= */

const buildQueryParams = (
  params: Record<
    string,
    string | number | boolean | undefined | null
  >
): Record<string, string | number | boolean> => {
  const queryParams: Record<
    string,
    string | number | boolean
  > = {};

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      queryParams[key] = value;
    }
  });

  return queryParams;
};

/* =========================================================
   GET SHIPMENTS API
========================================================= */

export const getShipmentsApi = async (
  params: GetShipmentsRequest = {}
): Promise<GetShipmentsApiResponse> => {
  const queryParams = buildQueryParams({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    courierName: params.courierName,
    orderNumber: params.orderNumber,
    trackingNumber: params.trackingNumber,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response =
    await axiosInstance.get<GetShipmentsApiResponse>(
      API.SHIPMENT.LIST,
      {
        params: queryParams,
      }
    );

  return response.data;
};

/* =========================================================
   GET SHIPMENT DETAILS API
========================================================= */

export const getShipmentApi = async (
  identifier: string
): Promise<GetShipmentApiResponse> => {
  const response =
    await axiosInstance.get<GetShipmentApiResponse>(
      API.SHIPMENT.DETAILS(identifier)
    );

  return response.data;
};

/* =========================================================
   CREATE SHIPMENT API
========================================================= */

export const createShipmentApi = async (
  payload: CreateShipmentRequest
): Promise<CreateShipmentApiResponse> => {
  const response =
    await axiosInstance.post<CreateShipmentApiResponse>(
      API.SHIPMENT.CREATE,
{
  orderIdentifier: payload.orderIdentifier,
  courierId: payload.courierId,
  notes: payload.notes,
  length: payload.length,
  breadth: payload.breadth,
  height: payload.height,
  weight: payload.weight,
}
    );

  return response.data;
};

/* =========================================================
   UPDATE SHIPMENT STATUS API
========================================================= */

export const updateShipmentStatusApi = async (
  identifier: string,
  payload: UpdateShipmentStatusRequest
): Promise<UpdateShipmentStatusApiResponse> => {
  const response =
    await axiosInstance.patch<UpdateShipmentStatusApiResponse>(
      API.SHIPMENT.STATUS(identifier),
      {
        status: payload.status,
        location: payload.location,
        description: payload.description,
        eventAt: payload.eventAt,
        source: payload.source ?? "ADMIN",
      }
    );

  return response.data;
};

/* =========================================================
   GET TRACKING HISTORY API
========================================================= */

export const getShipmentTrackingApi = async (
  identifier: string
): Promise<ShipmentTrackingApiResponse> => {
  const response =
    await axiosInstance.get<ShipmentTrackingApiResponse>(
      API.SHIPMENT.TRACKING(identifier)
    );

  return response.data;
};

/* =========================================================
   GET LATEST TRACKING API
========================================================= */

export const getLatestShipmentTrackingApi = async (
  identifier: string
): Promise<LatestShipmentTrackingApiResponse> => {
  const response =
    await axiosInstance.get<LatestShipmentTrackingApiResponse>(
      API.SHIPMENT.LATEST_TRACKING(identifier)
    );

  return response.data;
};


/* =========================================================
   SYNC SHIPMENT TRACKING API
========================================================= */

export const syncShipmentTrackingApi = async (
  identifier: string
): Promise<ShipmentTrackingSyncApiResponse> => {
  const response =
    await axiosInstance.post<ShipmentTrackingSyncApiResponse>(
      API.SHIPMENT.SYNC_TRACKING(identifier)
    );

  return response.data;
};

/* =========================================================
   EXPORT SHIPMENT TYPES FOR CONVENIENCE
========================================================= */

export type {
  ShipmentStatus,
  PackageDimensions,
};
