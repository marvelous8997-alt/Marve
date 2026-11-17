
/* =========================
   Return Request Enums / Types
   Matches Backend ReturnRequest
========================= */

export type ReturnReason =
  | "SIZE_TOO_SMALL"
  | "SIZE_TOO_LARGE"
  | "PRODUCT_DAMAGED"
  | "WRONG_PRODUCT"
  | "PRODUCT_NOT_AS_DESCRIBED"
  | "QUALITY_ISSUE"
  | "OTHER";

export type ReturnRequestStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "RECEIVED"
  | "INSPECTING"
  | "REFUND_APPROVED"
  | "REFUND_INITIATED"
  | "REFUNDED"
  | "CANCELLED";

/* =========================
   Return Item Types
   Matches Backend ReturnItem
========================= */

export type ReturnItemCondition =
  | "UNINSPECTED"
  | "GOOD"
  | "DAMAGED"
  | "USED"
  | "REJECTED";

export interface ReturnOrderItemSummary {
  id: number;
  uuid?: string;

  productName: string;
  productSlug?: string | null;
  productSku?: string | null;

  variationName?: string | null;
  variationSku?: string | null;

  productImage?: string | null;

  quantity: number;
  unitPrice: number;
  unitDiscount?: number;

  isFreeGift?: boolean;
}

export interface ReturnItem {
  id: number;
  uuid?: string;

  returnRequestId: number;
  orderItemId: number;

  quantity: number;
  unitPrice: number;
  refundAmount: number;

  orderItem?: ReturnOrderItemSummary | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   Return Order Summary
========================= */

export interface ReturnOrderSummary {
  id: number;
  uuid?: string;

  orderNumber: string;

  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: "ONLINE" | "COD";

  deliveryFullName?: string | null;
  deliveryPhone?: string | null;
  deliveryPincode?: string | null;
  deliveryCity?: string | null;
  deliveryState?: string | null;
}

/* =========================
   Return Tracking Enums / Types
   Matches Backend ReturnShipment
========================= */

export type ReturnShipmentStatus =
  | "PENDING"
  | "PICKUP_SCHEDULED"
  | "PICKUP_REQUESTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "PICKUP_FAILED"
  | "CANCELLED"
  | "RTO";

export type ReturnTrackingSource =
  | "ADMIN"
  | "COURIER"
  | "SYSTEM";

/* =========================
   Return Tracking Event
   Matches Backend ReturnTrackingEvent
========================= */

export interface ReturnTrackingEvent {
  id: number;
  uuid?: string;

  status: string;

  location?: string | null;
  description?: string | null;

  eventAt: string;

  createdAt?: string;
}

/* =========================
   Return Shipment Details
   Matches Backend ReturnShipment
========================= */

export interface ReturnShipmentDetails {
  id: number;
  uuid?: string;

  returnRequestId: number;

  courierName?: string | null;
  courierCode?: string | null;

  trackingNumber?: string | null;
  awbNumber?: string | null;

  status: ReturnShipmentStatus;

  pickupScheduledAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;

  lastTrackedAt?: string | null;

  trackingEvents?: ReturnTrackingEvent[];

  createdAt: string;
  updatedAt: string;
}

/* =========================
   Latest Return Shipment Tracking
========================= */

export interface LatestReturnShipmentInfo {
  id: number;
  uuid?: string;

  returnRequestId: number;

  status: ReturnShipmentStatus;

  courierName?: string | null;
  courierCode?: string | null;

  trackingNumber?: string | null;
  awbNumber?: string | null;

  pickupScheduledAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;

  lastTrackedAt?: string | null;
}

export interface LatestReturnShipmentTracking {
  shipment: LatestReturnShipmentInfo;

  latestTrackingEvent: ReturnTrackingEvent | null;
}

/* =========================
   Return Refund Types
   Matches Backend ReturnRefund
========================= */

export type ReturnRefundStatus =
  | "PENDING"
  | "PROCESSING"
  | "INITIATED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type ReturnRefundMethod =
  | "ONLINE"
  | "COD";

/* =========================
   User Return Refund
   Matches serializeUserReturnRequest()
========================= */

export interface ReturnRefund {
  uuid: string;

  refundNumber: string;

  paymentMethod: "ONLINE" | "COD";

  gateway?: string | null;

  refundAmount: number | string;
  currency: string;

  status:
    | "PENDING"
    | "PROCESSING"
    | "INITIATED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";

  refundMethod?: string | null;
  refundReference?: string | null;

  scheduledAt?: string | null;
  initiatedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   Return Request Details
   Matches Backend ReturnRequest
========================= */

export interface ReturnRequestDetails {
  id: number;
  uuid: string;

  returnNumber: string;

  orderId: number;

  reason: ReturnReason;
  description?: string | null;

  images?: string[] | null;

  status: ReturnRequestStatus;

  rejectionReason?: string | null;

  requestedAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  receivedAt?: string | null;
  refundedAt?: string | null;

  refundAmount: number;
  currency: string;

  order?: ReturnOrderSummary | null;

  items?: ReturnItem[];
    shipments?: ReturnShipmentDetails[];

  refunds?: ReturnRefund[];

  createdAt: string;
  updatedAt: string;

}

/* =========================
   Create Return Request
========================= */

export interface CreateReturnItemPayload {
  orderItemUuid: string;
  quantity: number;
}

export interface CreateReturnRequestPayload {
  orderUuid: string;
  reason: ReturnReason;
  description?: string;
  items: CreateReturnItemPayload[];
  images?: File[];
}

/* =========================
   Return Request Query
========================= */

export interface GetReturnRequestsQuery {
  page?: number;
  limit?: number;
  status?: ReturnRequestStatus;
}

/* =========================
   Return Shipment Query
========================= */

export interface GetReturnShipmentsQuery {
  page?: number;
  limit?: number;
}

export interface GetReturnTrackingHistoryQuery {
  page?: number;
  limit?: number;
}

/* =========================
   API Response
========================= */

export interface ReturnApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Return Request API Responses
========================= */

// Create return request.
export type CreateReturnRequestResponse =
  ReturnApiResponse<ReturnRequestDetails>;

// Return request list.
export type GetReturnRequestsResponse =
  ReturnApiResponse<ReturnRequestDetails[]>;

// Return request details by UUID.
export type GetReturnRequestResponse =
  ReturnApiResponse<ReturnRequestDetails>;

// Return requests belonging to an order.
export type GetReturnRequestsByOrderResponse =
  ReturnApiResponse<ReturnRequestDetails[]>;
// Cancel return request.
export type CancelReturnRequestResponse =
  ReturnApiResponse<ReturnRequestDetails>;

/* =========================
   Return Shipment API Responses
========================= */

// Return shipments belonging to an order.
export type GetReturnShipmentsByOrderResponse =
  ReturnApiResponse<ReturnShipmentDetails[]>;

// Return shipment details by ID.
export type GetReturnShipmentResponse =
  ReturnApiResponse<ReturnShipmentDetails>;

// Return shipment details by UUID.
export type GetReturnShipmentByUuidResponse =
  ReturnApiResponse<ReturnShipmentDetails>;

// Return shipment tracking history.
export type GetReturnShipmentTrackingHistoryResponse =
  ReturnApiResponse<ReturnTrackingEvent[]>;

// Latest return shipment tracking.
export type GetLatestReturnShipmentTrackingResponse =
  ReturnApiResponse<LatestReturnShipmentTracking>;

// Return shipment details by tracking number.
export type GetReturnShipmentByTrackingNumberResponse =
  ReturnApiResponse<ReturnShipmentDetails>;
