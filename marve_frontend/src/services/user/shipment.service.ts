
import {
  getShipmentsByOrderIdApi,
  getShipmentByIdApi,
  getShipmentByUuidApi,
  getShipmentTrackingHistoryApi,
  getLatestShipmentTrackingApi,
  getShipmentByTrackingNumberApi,
} from "@/src/api/user/shipment.api";

import type {
  GetShipmentsByOrderResponse,
  GetShipmentResponse,
  GetShipmentByUuidResponse,
  GetShipmentTrackingHistoryResponse,
  GetLatestShipmentTrackingResponse,
  GetShipmentByTrackingNumberResponse,
} from "@/src/types/user/shipment.types";

/* =========================
   Get Shipments By Order ID Service
========================= */

export const getShipmentsByOrderIdService = async (
  orderId: number | string
): Promise<GetShipmentsByOrderResponse> => {
  return await getShipmentsByOrderIdApi(orderId);
};

/* =========================
   Get Shipment By ID Service
========================= */

export const getShipmentByIdService = async (
  id: number | string
): Promise<GetShipmentResponse> => {
  return await getShipmentByIdApi(id);
};

/* =========================
   Get Shipment By UUID Service
========================= */

export const getShipmentByUuidService = async (
  uuid: string
): Promise<GetShipmentByUuidResponse> => {
  return await getShipmentByUuidApi(uuid);
};

/* =========================
   Get Shipment Tracking History Service
========================= */

export const getShipmentTrackingHistoryService = async (
  shipmentId: number | string
): Promise<GetShipmentTrackingHistoryResponse> => {
  return await getShipmentTrackingHistoryApi(shipmentId);
};

/* =========================
   Get Latest Shipment Tracking Service
========================= */

export const getLatestShipmentTrackingService = async (
  shipmentId: number | string
): Promise<GetLatestShipmentTrackingResponse> => {
  return await getLatestShipmentTrackingApi(shipmentId);
};

/* =========================
   Get Shipment By Tracking Number Service
========================= */

export const getShipmentByTrackingNumberService = async (
  trackingNumber: string
): Promise<GetShipmentByTrackingNumberResponse> => {
  return await getShipmentByTrackingNumberApi(trackingNumber);
};
