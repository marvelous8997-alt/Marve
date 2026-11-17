
import axiosInstance from "@/src/lib/axios";

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

/* =========================
   API Endpoints
========================= */

export const RETURN_API = {
  BASE: "/user/return-requests",
  SHIPMENT_BASE: "/user/return-shipments",

  // Return Requests
  CREATE: "/user/return-requests/create",

  GET_ALL: "/user/return-requests/list",

  GET_BY_UUID: (uuid: string) =>
    `/user/return-requests/list/${encodeURIComponent(uuid)}`,

  GET_BY_ORDER_UUID: (orderUuid: string) =>
    `/user/return-requests/order/${encodeURIComponent(orderUuid)}`,

  CANCEL: (uuid: string) =>
    `/user/return-requests/cancel/${encodeURIComponent(uuid)}`,

  // Return Shipments
  GET_SHIPMENTS_BY_ORDER_UUID: (orderUuid: string) =>
    `/user/return-shipments/order/${encodeURIComponent(orderUuid)}`,

  GET_SHIPMENT_BY_ID: (id: number | string) =>
    `/user/return-shipments/${encodeURIComponent(String(id))}`,

  GET_SHIPMENT_BY_UUID: (uuid: string) =>
    `/user/return-shipments/uuid/${encodeURIComponent(uuid)}`,

  GET_TRACKING_HISTORY: (id: number | string) =>
    `/user/return-shipments/${encodeURIComponent(String(id))}/tracking`,

  GET_LATEST_TRACKING: (id: number | string) =>
    `/user/return-shipments/${encodeURIComponent(String(id))}/tracking/latest`,

  GET_BY_TRACKING_NUMBER: (trackingNumber: string) =>
    `/user/return-shipments/tracking/${encodeURIComponent(trackingNumber)}`,
};

/* =========================
   Create Return Request
========================= */

export const createReturnRequestApi = async (
  payload: CreateReturnRequestPayload
): Promise<CreateReturnRequestResponse> => {
  const formData = new FormData();

  formData.append("orderUuid", payload.orderUuid);
  formData.append("reason", payload.reason);

  if (payload.description?.trim()) {
    formData.append("description", payload.description.trim());
  }

  formData.append("items", JSON.stringify(payload.items));

  payload.images?.forEach((image) => {
    formData.append("images", image);
  });

  const response =
    await axiosInstance.post<CreateReturnRequestResponse>(
      RETURN_API.CREATE,
      formData
    );

  return response.data;
};

/* =========================
   Get Return Requests
========================= */

export const getReturnRequestsApi = async (
  params?: GetReturnRequestsQuery
): Promise<GetReturnRequestsResponse> => {
  const response =
    await axiosInstance.get<GetReturnRequestsResponse>(
      RETURN_API.GET_ALL,
      { params }
    );

  return response.data;
};

/* =========================
   Get Return Request By UUID
========================= */

export const getReturnRequestByUuidApi = async (
  uuid: string
): Promise<GetReturnRequestResponse> => {
  const response =
    await axiosInstance.get<GetReturnRequestResponse>(
      RETURN_API.GET_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   Get Return Requests By Order UUID
========================= */

export const getReturnRequestsByOrderUuidApi = async (
  orderUuid: string
): Promise<GetReturnRequestsByOrderResponse> => {
  const response =
    await axiosInstance.get<GetReturnRequestsByOrderResponse>(
      RETURN_API.GET_BY_ORDER_UUID(orderUuid)
    );

  return response.data;
};

/* =========================
   Cancel Return Request
========================= */

export const cancelReturnRequestApi = async (
  uuid: string
): Promise<CancelReturnRequestResponse> => {
  const response =
    await axiosInstance.patch<CancelReturnRequestResponse>(
      RETURN_API.CANCEL(uuid)
    );

  return response.data;
};

/* =========================
   Get Return Shipments By Order UUID
========================= */

export const getReturnShipmentsByOrderUuidApi = async (
  orderUuid: string
): Promise<GetReturnShipmentsByOrderResponse> => {
  const response =
    await axiosInstance.get<GetReturnShipmentsByOrderResponse>(
      RETURN_API.GET_SHIPMENTS_BY_ORDER_UUID(orderUuid)
    );

  return response.data;
};

/* =========================
   Get Return Shipment By ID
========================= */

export const getReturnShipmentByIdApi = async (
  id: number | string
): Promise<GetReturnShipmentResponse> => {
  const response =
    await axiosInstance.get<GetReturnShipmentResponse>(
      RETURN_API.GET_SHIPMENT_BY_ID(id)
    );

  return response.data;
};

/* =========================
   Get Return Shipment By UUID
========================= */

export const getReturnShipmentByUuidApi = async (
  uuid: string
): Promise<GetReturnShipmentByUuidResponse> => {
  const response =
    await axiosInstance.get<GetReturnShipmentByUuidResponse>(
      RETURN_API.GET_SHIPMENT_BY_UUID(uuid)
    );

  return response.data;
};

/* =========================
   Get Return Shipment Tracking History
========================= */

export const getReturnShipmentTrackingHistoryApi = async (
  shipmentId: number | string
): Promise<GetReturnShipmentTrackingHistoryResponse> => {
  const response =
    await axiosInstance.get<GetReturnShipmentTrackingHistoryResponse>(
      RETURN_API.GET_TRACKING_HISTORY(shipmentId)
    );

  return response.data;
};

/* =========================
   Get Latest Return Shipment Tracking
========================= */

export const getLatestReturnShipmentTrackingApi = async (
  shipmentId: number | string
): Promise<GetLatestReturnShipmentTrackingResponse> => {
  const response =
    await axiosInstance.get<GetLatestReturnShipmentTrackingResponse>(
      RETURN_API.GET_LATEST_TRACKING(shipmentId)
    );

  return response.data;
};

/* =========================
   Get Return Shipment By Tracking Number
========================= */

export const getReturnShipmentByTrackingNumberApi = async (
  trackingNumber: string
): Promise<GetReturnShipmentByTrackingNumberResponse> => {
  const response =
    await axiosInstance.get<GetReturnShipmentByTrackingNumberResponse>(
      RETURN_API.GET_BY_TRACKING_NUMBER(trackingNumber)
    );

  return response.data;
};
