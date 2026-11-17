
/* =========================================================
   SHIPMENT STATUS & TRACKING SOURCE
========================================================= */

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

export type TrackingSource = "ADMIN" | "COURIER" | "SYSTEM";

/* =========================================================
   ORDER STATUS & PAYMENT TYPES
========================================================= */

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod = "ONLINE" | "COD";

/* =========================================================
   PACKAGE DIMENSIONS
========================================================= */

export interface PackageDimensions {
  length: number;
  breadth: number;
  height: number;
  unit?: "cm";
}

/* =========================================================
   SHIPMENT ORDER ADDRESS
========================================================= */

export interface ShipmentOrderAddress {
  id?: number;
  uuid?: string;

  name?: string;
  fullName?: string;
  full_name?: string;

  phone?: string | null;
  email?: string | null;

  addressLine1?: string;
  addressLine2?: string | null;

  address_line1?: string;
  address_line2?: string | null;

  city?: string;
  state?: string;

  postalCode?: string;
  postal_code?: string;
  pincode?: string;

  country?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   SHIPMENT ORDER CUSTOMER
========================================================= */

export interface ShipmentOrderCustomer {
  id: number | string;
  uuid?: string;

  name?: string;
  firstName?: string;
  lastName?: string;

  first_name?: string;
  last_name?: string;

  email?: string | null;
  phone?: string | null;
}

/* =========================================================
   SHIPMENT ORDER ITEM PRODUCT
========================================================= */

export interface ShipmentOrderProduct {
  id?: number | string;
  uuid?: string;

  name?: string;
  slug?: string;

  sku?: string | null;

  weight?: number | null;
  weightUnit?: "kg" | "g" | string;
  weight_unit?: "kg" | "g" | string;

  length?: number | null;
  width?: number | null;
  height?: number | null;

  dimensionUnit?: string;
  dimension_unit?: string;
}

/* =========================================================
   SHIPMENT ORDER ITEM VARIATION
========================================================= */

export interface ShipmentOrderVariation {
  id?: number | string;
  uuid?: string;

  name?: string | null;
  sku?: string | null;

  product?: ShipmentOrderProduct | null;
}

/* =========================================================
   SHIPMENT ORDER ITEM
========================================================= */

export interface ShipmentOrderItem {
  id: number | string;
  uuid?: string;

  orderId?: number | string;
  order_id?: number | string;

  productId?: number | string | null;
  product_id?: number | string | null;

  variationId?: number | string | null;
  variation_id?: number | string | null;

  productName?: string;
  product_name?: string;

  sku?: string | null;

  quantity: number;

  price?: number;
  unitPrice?: number;
  unit_price?: number;

  total?: number;
  lineTotal?: number;
  line_total?: number;

  isFreeGift?: boolean;
  is_free_gift?: boolean;

  product?: ShipmentOrderProduct | null;

  variation?: ShipmentOrderVariation | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   SHIPMENT ORDER
========================================================= */

export interface ShipmentOrder {
  id: number | string;
  uuid?: string;

  orderNumber: string;
  order_number?: string;

  userId?: number | string;
  user_id?: number | string;

  customerId?: number | string | null;
  customer_id?: number | string | null;

  customerName?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;

  customer_name?: string;
  customer_email?: string | null;
  customer_phone?: string | null;

  customer?: ShipmentOrderCustomer | null;

  items?: ShipmentOrderItem[];

  subtotal?: number;

  productDiscount?: number;
  product_discount?: number;

  couponDiscount?: number;
  coupon_discount?: number;

  taxAmount?: number;
  tax_amount?: number;

  shippingAmount?: number;
  shipping_amount?: number;

  total?: number;
  totalAmount?: number;
  total_amount?: number;

  paymentMethod?: PaymentMethod;
  payment_method?: PaymentMethod;

  paymentStatus?: PaymentStatus;
  payment_status?: PaymentStatus;

  orderStatus?: OrderStatus;
  order_status?: OrderStatus;

  deliveryFullName?: string;
  delivery_full_name?: string;

  deliveryPhone?: string;
  delivery_phone?: string;

  deliveryPincode?: string;
  delivery_pincode?: string;

  deliveryCity?: string;
  delivery_city?: string;

  deliveryState?: string;
  delivery_state?: string;

  deliveryAddressLine1?: string;
  deliveryAddressLine2?: string | null;

  delivery_address_line1?: string;
  delivery_address_line2?: string | null;

  shippingAddress?: ShipmentOrderAddress | null;
  shipping_address?: ShipmentOrderAddress | null;

  billingAddress?: ShipmentOrderAddress | null;
  billing_address?: ShipmentOrderAddress | null;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
}

/* =========================================================
   SHIPMENT TRACKING EVENT
========================================================= */

export interface ShipmentTrackingEvent {
  id: number;
  uuid?: string;

  shipmentId: number;
  shipment_id?: number;

  providerEventId?: string | null;
  provider_event_id?: string | null;

  status: ShipmentStatus;

  location?: string | null;
  description?: string | null;

  eventAt: string;
  event_at?: string;

  source: TrackingSource;

  rawPayload?: Record<string, unknown> | null;
  raw_payload?: Record<string, unknown> | null;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
}

/* =========================================================
   SHIPMENT
========================================================= */

export interface Shipment {
  id: number;
  uuid: string;

  orderId: number;
  order_id?: number;

  shiprocketOrderId?: number | string | null;
  shiprocket_order_id?: number | string | null;

  shiprocketShipmentId?: number | string | null;
  shiprocket_shipment_id?: number | string | null;

  courierName?: string | null;
  courier_name?: string | null;

  courierCode?: string | null;
  courier_code?: string | null;

  trackingNumber?: string | null;
  tracking_number?: string | null;

  awbNumber?: string | null;
  awb_number?: string | null;

  status: ShipmentStatus;

  shippedAt?: string | null;
  shipped_at?: string | null;

  estimatedDeliveryAt?: string | null;
  estimated_delivery_at?: string | null;

  deliveredAt?: string | null;
  delivered_at?: string | null;

  lastTrackedAt?: string | null;
last_tracked_at?: string | null;

  notes?: string | null;

  order?: ShipmentOrder | null;

  trackingEvents?: ShipmentTrackingEvent[];

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
}

/* =========================================================
   SHIPMENT FILTERS
========================================================= */

export interface ShipmentFilters {
  page?: number;
  limit?: number;

  search?: string;

  orderId?: number | string;
  orderNumber?: string;

  trackingNumber?: string;
  awbNumber?: string;

  courierName?: string;

  status?: ShipmentStatus | "";

  dateFrom?: string;
  dateTo?: string;

  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/* =========================================================
   PAGINATION
========================================================= */

export interface ShipmentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   SHIPMENT LIST RESULT
========================================================= */

export interface ShipmentListResult {
  shipments: Shipment[];
  pagination: ShipmentPagination;
}

/* =========================================================
   CREATE SHIPMENT
========================================================= */

export interface CreateShipmentData {
  orderIdentifier: number | string;
  courierId?: number | null;
  notes?: string | null;

  packageDimensions: PackageDimensions;

  weight: number;
  weightUnit?: "kg";
}

/* =========================================================
   UPDATE SHIPMENT STATUS
========================================================= */

export interface UpdateShipmentStatusData {
  status: ShipmentStatus;

  location?: string | null;
  description?: string | null;

  eventAt?: string;

  source?: TrackingSource;
}

/* =========================================================
   SHIPMENT TRACKING HISTORY RESULT
========================================================= */

export interface ShipmentTrackingHistoryResult {
  shipment: Shipment;
  trackingEvents: ShipmentTrackingEvent[];
}

/* =========================================================
   API RESPONSE
========================================================= */

export interface ShipmentApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


/* =========================================================
   SHIPMENT TRACKING SYNC RESULT
========================================================= */

export interface ShipmentTrackingSyncResult {
  message: string;

  shipment: Shipment;

  tracking: {
    awbNumber: string;
    providerStatus: string;
    status: ShipmentStatus;

    location: string | null;
    description: string | null;

    eventAt: string;

    newEventCreated: boolean;
  };
}
