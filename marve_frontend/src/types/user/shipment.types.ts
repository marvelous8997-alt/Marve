
/* =========================
   Shipment Enums / Types
   Matches Backend Shipment
========================= */

export type ShipmentStatus =
  | "PENDING"
  | "READY_TO_SHIP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED"
  | "RETURN_TO_ORIGIN";

export type ShipmentTrackingSource =
  | "ADMIN"
  | "COURIER"
  | "SYSTEM";

/* =========================
   Shipment Tracking Event
   Matches Backend ShipmentTrackingEvent
========================= */

export interface ShipmentTrackingEvent {
  id: number;
  uuid?: string;

  shipmentId: number;

  status: ShipmentStatus;

  location?: string | null;
  description?: string | null;

  eventAt: string;

  source: ShipmentTrackingSource;

  rawPayload?: Record<string, unknown> | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   Shipment Order Summary
========================= */

export interface ShipmentOrderSummary {
  id: number;
  uuid?: string;
  orderNumber: string;

  orderStatus?: string;
  paymentStatus?: string;

  createdAt?: string;
}

/* =========================
   Shipment Details
   Matches Backend Shipment
========================= */

export interface ShipmentDetails {
  id: number;
  uuid?: string;

  orderId: number;

  shiprocketOrderId?: number | null;
  shipmentId?: number | null;

  awbNumber?: string | null;
  trackingNumber?: string | null;

  courierName?: string | null;
  courierCompanyId?: number | null;

  status: ShipmentStatus;

  estimatedDeliveryDate?: string | null;

  shippedAt?: string | null;
  deliveredAt?: string | null;

  lastTrackedAt?: string | null;

  createdAt: string;
  updatedAt: string;

  order?: ShipmentOrderSummary | null;

  trackingEvents?: ShipmentTrackingEvent[];
}

/* =========================
   Latest Shipment Tracking
========================= */

export interface LatestShipmentTracking {
  id: number;
  uuid?: string;

  shipmentId?: number;
  orderId?: number;

  status: ShipmentStatus;

  awbNumber?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;

  estimatedDeliveryDate?: string | null;

  shippedAt?: string | null;
  deliveredAt?: string | null;
  lastTrackedAt?: string | null;

  latestEvent?: ShipmentTrackingEvent | null;
}

/* =========================
   Shipment Query
========================= */

export interface GetShipmentsQuery {
  page?: number;
  limit?: number;
}

/* =========================
   API Response
========================= */

export interface ShipmentApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Shipment API Response Types
========================= */

// Shipments belonging to an order.
export type GetShipmentsByOrderResponse =
  ShipmentApiResponse<ShipmentDetails[]>;

// Shipment details by database ID.
export type GetShipmentResponse =
  ShipmentApiResponse<ShipmentDetails>;

// Shipment details by UUID.
export type GetShipmentByUuidResponse =
  ShipmentApiResponse<ShipmentDetails>;

// Shipment tracking history.
export type GetShipmentTrackingHistoryResponse =
  ShipmentApiResponse<ShipmentTrackingEvent[]>;

// Latest shipment tracking information.
export type GetLatestShipmentTrackingResponse =
  ShipmentApiResponse<LatestShipmentTracking>;

// Shipment details by tracking number.
export type GetShipmentByTrackingNumberResponse =
  ShipmentApiResponse<ShipmentDetails>;
