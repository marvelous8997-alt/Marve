
import axiosInstance from "@/src/lib/axios";

import type {
  GetShipmentsByOrderResponse,
  GetShipmentResponse,
  GetShipmentByUuidResponse,
  GetShipmentTrackingHistoryResponse,
  GetLatestShipmentTrackingResponse,
  GetShipmentByTrackingNumberResponse,
} from "@/src/types/user/shipment.types";

/* =========================
   API Endpoints
========================= */

export const SHIPMENT_API = {
  BASE: "/user/shipments",

  GET_BY_ORDER_ID: (orderId: number | string) =>
    `/user/shipments/order/${encodeURIComponent(String(orderId))}`,

  GET_BY_ID: (id: number | string) =>
    `/user/shipments/${encodeURIComponent(String(id))}`,

  GET_BY_UUID: (uuid: string) =>
    `/user/shipments/uuid/${encodeURIComponent(uuid)}`,

  GET_TRACKING_HISTORY: (id: number | string) =>
    `/user/shipments/${encodeURIComponent(String(id))}/tracking`,

  GET_LATEST_TRACKING: (id: number | string) =>
    `/user/shipments/${encodeURIComponent(String(id))}/tracking/latest`,

  GET_BY_TRACKING_NUMBER: (trackingNumber: string) =>
    `/user/shipments/tracking/${encodeURIComponent(trackingNumber)}`,
};

/* =========================
   Get Shipments By Order ID
========================= */

export const getShipmentsByOrderIdApi = async (
  orderId: number | string
): Promise<GetShipmentsByOrderResponse> => {
  const response =
    await axiosInstance.get<GetShipmentsByOrderResponse>(
      SHIPMENT_API.GET_BY_ORDER_ID(orderId)
    );

  return response.data;
};

/* =========================
   Get Shipment By ID
========================= */

export const getShipmentByIdApi = async (
  id: number | string
): Promise<GetShipmentResponse> => {
  const response =
    await axiosInstance.get<GetShipmentResponse>(
      SHIPMENT_API.GET_BY_ID(id)
    );

  return response.data;
};

/* =========================
   Get Shipment By UUID
========================= */

export const getShipmentByUuidApi = async (
  uuid: string
): Promise<GetShipmentByUuidResponse> => {
  const response =
    await axiosInstance.get<GetShipmentByUuidResponse>(
      SHIPMENT_API.GET_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   Get Shipment Tracking History
========================= */

export const getShipmentTrackingHistoryApi = async (
  shipmentId: number | string
): Promise<GetShipmentTrackingHistoryResponse> => {
  const response =
    await axiosInstance.get<GetShipmentTrackingHistoryResponse>(
      SHIPMENT_API.GET_TRACKING_HISTORY(shipmentId)
    );

  return response.data;
};

/* =========================
   Get Latest Shipment Tracking
========================= */

export const getLatestShipmentTrackingApi = async (
  shipmentId: number | string
): Promise<GetLatestShipmentTrackingResponse> => {
  const response =
    await axiosInstance.get<GetLatestShipmentTrackingResponse>(
      SHIPMENT_API.GET_LATEST_TRACKING(shipmentId)
    );

  return response.data;
};

/* =========================
   Get Shipment By Tracking Number
========================= */

export const getShipmentByTrackingNumberApi = async (
  trackingNumber: string
): Promise<GetShipmentByTrackingNumberResponse> => {
  const response =
    await axiosInstance.get<GetShipmentByTrackingNumberResponse>(
      SHIPMENT_API.GET_BY_TRACKING_NUMBER(trackingNumber)
    );

  return response.data;
};