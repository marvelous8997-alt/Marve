
import {
  createReturnRequestApi,
  getReturnRequestsApi,
  getReturnRequestByUuidApi,
  getReturnRequestsByOrderUuidApi,
  cancelReturnRequestApi,
  getReturnShipmentsByOrderUuidApi,
  getReturnShipmentByIdApi,
  getReturnShipmentByUuidApi,
  getReturnShipmentTrackingHistoryApi,
  getLatestReturnShipmentTrackingApi,
  getReturnShipmentByTrackingNumberApi,
} from "@/src/api/user/return.api";

import type {
  CreateReturnRequestPayload,
  CreateReturnRequestResponse,
  GetReturnRequestsQuery,
  GetReturnRequestsResponse,
  GetReturnRequestResponse,
  GetReturnRequestsByOrderResponse,
  CancelReturnRequestResponse,
  GetReturnShipmentsByOrderResponse,
  GetReturnShipmentResponse,
  GetReturnShipmentByUuidResponse,
  GetReturnShipmentTrackingHistoryResponse,
  GetLatestReturnShipmentTrackingResponse,
  GetReturnShipmentByTrackingNumberResponse,
} from "@/src/types/user/return.types";

/* =========================================================
   CREATE RETURN REQUEST SERVICE
========================================================= */

export const createReturnRequestService = (
  payload: CreateReturnRequestPayload
): Promise<CreateReturnRequestResponse> => {
  return createReturnRequestApi(payload);
};

/* =========================================================
   GET ALL RETURN REQUESTS SERVICE
========================================================= */

export const getReturnRequestsService = (
  params?: GetReturnRequestsQuery
): Promise<GetReturnRequestsResponse> => {
  return getReturnRequestsApi(params);
};

/* =========================================================
   GET RETURN REQUEST BY UUID SERVICE
========================================================= */

export const getReturnRequestByUuidService = (
  uuid: string
): Promise<GetReturnRequestResponse> => {
  return getReturnRequestByUuidApi(uuid);
};

/* =========================================================
   GET RETURN REQUESTS BY ORDER UUID SERVICE
========================================================= */

export const getReturnRequestsByOrderUuidService = (
  orderUuid: string
): Promise<GetReturnRequestsByOrderResponse> => {
  return getReturnRequestsByOrderUuidApi(orderUuid);
};

/* =========================================================
   CANCEL RETURN REQUEST SERVICE
========================================================= */

export const cancelReturnRequestService = (
  uuid: string
): Promise<CancelReturnRequestResponse> => {
  return cancelReturnRequestApi(uuid);
};

/* =========================================================
   GET RETURN SHIPMENTS BY ORDER UUID SERVICE
========================================================= */

export const getReturnShipmentsByOrderUuidService = (
  orderUuid: string
): Promise<GetReturnShipmentsByOrderResponse> => {
  return getReturnShipmentsByOrderUuidApi(orderUuid);
};

/* =========================================================
   GET RETURN SHIPMENT BY ID SERVICE
========================================================= */

export const getReturnShipmentByIdService = (
  id: number | string
): Promise<GetReturnShipmentResponse> => {
  return getReturnShipmentByIdApi(id);
};

/* =========================================================
   GET RETURN SHIPMENT BY UUID SERVICE
========================================================= */

export const getReturnShipmentByUuidService = (
  uuid: string
): Promise<GetReturnShipmentByUuidResponse> => {
  return getReturnShipmentByUuidApi(uuid);
};

/* =========================================================
   GET RETURN SHIPMENT TRACKING HISTORY SERVICE
========================================================= */

export const getReturnShipmentTrackingHistoryService = (
  shipmentId: number | string
): Promise<GetReturnShipmentTrackingHistoryResponse> => {
  return getReturnShipmentTrackingHistoryApi(shipmentId);
};

/* =========================================================
   GET LATEST RETURN SHIPMENT TRACKING SERVICE
========================================================= */

export const getLatestReturnShipmentTrackingService = (
  shipmentId: number | string
): Promise<GetLatestReturnShipmentTrackingResponse> => {
  return getLatestReturnShipmentTrackingApi(shipmentId);
};

/* =========================================================
   GET RETURN SHIPMENT BY TRACKING NUMBER SERVICE
========================================================= */

export const getReturnShipmentByTrackingNumberService = (
  trackingNumber: string
): Promise<GetReturnShipmentByTrackingNumberResponse> => {
  return getReturnShipmentByTrackingNumberApi(trackingNumber);
};
