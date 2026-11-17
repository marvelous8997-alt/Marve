
/* =========================================================
   RETURN REQUEST STATUS & REASON
========================================================= */

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

export type ReturnReason =
  | "SIZE_TOO_SMALL"
  | "SIZE_TOO_LARGE"
  | "PRODUCT_DAMAGED"
  | "WRONG_PRODUCT"
  | "PRODUCT_NOT_AS_DESCRIBED"
  | "QUALITY_ISSUE"
  | "OTHER";

/* =========================================================
   RETURN ITEM CONDITION
========================================================= */

export type ReturnItemCondition =
  | "UNINSPECTED"
  | "GOOD"
  | "DAMAGED"
  | "USED"
  | "REJECTED";

/* =========================================================
   RETURN SHIPMENT STATUS & TRACKING SOURCE
========================================================= */

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

export type ReturnTrackingSource = "ADMIN" | "COURIER" | "SYSTEM";

/* =========================================================
   RETURN REFUND STATUS & PAYMENT TYPES
========================================================= */

export type ReturnRefundStatus =
  | "PENDING"
  | "PROCESSING"
  | "INITIATED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type ReturnPaymentMethod = "ONLINE" | "COD";

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
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod = "ONLINE" | "COD";

/* =========================================================
   RETURN ORDER CUSTOMER
========================================================= */

export interface ReturnOrderCustomer {
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
   RETURN ORDER
========================================================= */

export interface ReturnOrder {
  id: number | string;
  uuid?: string;

  orderNumber: string;
  order_number?: string;

  userId?: number | string;
  user_id?: number | string;

  paymentMethod?: PaymentMethod;
  payment_method?: PaymentMethod;

  paymentStatus?: PaymentStatus;
  payment_status?: PaymentStatus;

  orderStatus?: OrderStatus;
  order_status?: OrderStatus;

  totalAmount?: number | string;
  total_amount?: number | string;

  subtotal?: number | string;

  productDiscount?: number | string;
  product_discount?: number | string;

  couponDiscount?: number | string;
  coupon_discount?: number | string;

  taxAmount?: number | string;
  tax_amount?: number | string;

  shippingAmount?: number | string;
  shipping_amount?: number | string;

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

  deliveredAt?: string | null;
  delivered_at?: string | null;

  placedAt?: string;
  placed_at?: string;

  customer?: ReturnOrderCustomer | null;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
}

/* =========================================================
   RETURN ORDER ITEM PRODUCT
========================================================= */

export interface ReturnOrderProduct {
  id?: number | string;
  uuid?: string;

  name?: string;
  slug?: string;

  sku?: string | null;

  image?: string | null;
}

/* =========================================================
   RETURN ORDER ITEM VARIATION
========================================================= */

export interface ReturnOrderVariation {
  id?: number | string;
  uuid?: string;

  name?: string | null;
  sku?: string | null;

  attributes?: Record<string, unknown> | null;
}

/* =========================================================
   RETURN ORDER ITEM
========================================================= */

export interface ReturnOrderItem {
  id: number | string;
  uuid?: string;

  orderId?: number | string;
  order_id?: number | string;

  productId?: number | string | null;
  product_id?: number | string | null;

  productVariationId?: number | string | null;
  product_variation_id?: number | string | null;

  productName?: string;
  product_name?: string;

  productSlug?: string | null;
  product_slug?: string | null;

  productSku?: string | null;
  product_sku?: string | null;

  variationName?: string | null;
  variation_name?: string | null;

  variationSku?: string | null;
  variation_sku?: string | null;

  productImage?: string | null;
  product_image?: string | null;

  variationAttributes?: Record<string, unknown> | null;
  variation_attributes?: Record<string, unknown> | null;

  quantity: number;

  unitPrice?: number | string;
  unit_price?: number | string;

  unitDiscount?: number | string;
  unit_discount?: number | string;

  isFreeGift?: boolean;
  is_free_gift?: boolean;

  taxRate?: number | string;
  tax_rate?: number | string;

  taxAmount?: number | string;
  tax_amount?: number | string;

  lineTotal?: number | string;
  line_total?: number | string;

  product?: ReturnOrderProduct | null;
  variation?: ReturnOrderVariation | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   RETURN REQUEST USER
========================================================= */

export interface ReturnRequestUser {
  id: number | string;
  uuid?: string;

  firstName?: string;
  lastName?: string;

  first_name?: string;
  last_name?: string;

  name?: string;

  email?: string | null;
  phone?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   RETURN ITEM
========================================================= */

export interface ReturnItem {
  id: number;
  uuid?: string;

  returnRequestId: number;
  return_request_id?: number;

  orderItemId: number;
  order_item_id?: number;

  quantity: number;

  unitPrice: number | string;
  unit_price?: number | string;

  refundAmount: number | string;
  refund_amount?: number | string;

  itemCondition: ReturnItemCondition;
  item_condition?: ReturnItemCondition;

  inspectionNote?: string | null;
  inspection_note?: string | null;

  orderItem?: ReturnOrderItem | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   RETURN TRACKING EVENT
========================================================= */

export interface ReturnTrackingEvent {
  id: number;
  uuid?: string;

  returnShipmentId: number;
  return_shipment_id?: number;

  providerEventId?: string | null;
  provider_event_id?: string | null;

  status: string;

  location?: string | null;
  description?: string | null;

  eventAt: string;
  event_at?: string;

  source: ReturnTrackingSource;

  rawPayload?: Record<string, unknown> | null;
  raw_payload?: Record<string, unknown> | null;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
}

/* =========================================================
   RETURN TRACKING TIMELINE
========================================================= */

export interface ReturnTrackingTimeline {
  shipmentId: number;
  awbNumber?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  courierCode?: string | null;

  status: ReturnShipmentStatus;

  events: ReturnTrackingEvent[];
}

/* =========================================================
   RETURN REQUEST ACTION PERMISSIONS
========================================================= */

export interface ReturnRequestActions {
  canApprove: boolean;
  canReject: boolean;
  canRetryPickup: boolean;
  canInspect: boolean;
  canApproveRefund: boolean;
}

/* =========================================================
   RETURN SHIPMENT PICKUP ADDRESS
========================================================= */

export interface ReturnPickupAddress {
  pickupFullName?: string | null;
  pickup_full_name?: string | null;

  pickupPhone?: string | null;
  pickup_phone?: string | null;

  pickupEmail?: string | null;
  pickup_email?: string | null;

  pickupAddress?: string | null;
  pickup_address?: string | null;

  pickupLocality?: string | null;
  pickup_locality?: string | null;

  pickupLandmark?: string | null;
  pickup_landmark?: string | null;

  pickupCity?: string | null;
  pickup_city?: string | null;

  pickupState?: string | null;
  pickup_state?: string | null;

  pickupPincode?: string | null;
  pickup_pincode?: string | null;

  pickupCountry?: string | null;
  pickup_country?: string | null;
}

/* =========================================================
   RETURN SHIPMENT
========================================================= */

export interface ReturnShipment extends ReturnPickupAddress {
  id: number;
  uuid: string;

  returnRequestId: number;
  return_request_id?: number;

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

  status: ReturnShipmentStatus;

  pickupScheduledAt?: string | null;
  pickup_scheduled_at?: string | null;

  pickedUpAt?: string | null;
  picked_up_at?: string | null;

  deliveredAt?: string | null;
  delivered_at?: string | null;

  lastTrackedAt?: string | null;
  last_tracked_at?: string | null;

  notes?: string | null;

  rawPayload?: Record<string, unknown> | null;
  raw_payload?: Record<string, unknown> | null;

  returnRequest?: ReturnRequest | null;

  trackingEvents?: ReturnTrackingEvent[];

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
}

/* =========================================================
   RETURN PICKUP RETRY RESPONSE
========================================================= */

export interface RetryReturnPickupResponse {
  returnRequest: ReturnRequest;

  shipment?: ReturnShipment | null;

  success?: boolean;
  message?: string;
}

/* =========================================================
   RETURN TRACKING REFRESH RESPONSE
========================================================= */

export interface RefreshReturnTrackingResponse {
  shipmentId: number;
  returnRequestId?: number;

  awbNumber: string;

  currentShipmentStatus: ReturnShipmentStatus;
  currentRequestStatus: ReturnRequestStatus;

  processedCount: number;
  duplicateCount: number;
  skippedCount: number;
}

/* =========================================================
   RETURN REFUND PAYMENT
========================================================= */

export interface ReturnRefundPayment {
  id: number | string;
  uuid?: string;

  paymentNumber?: string;
  transactionId?: string | null;

  paymentMethod?: PaymentMethod;
  payment_method?: PaymentMethod;

  status?: PaymentStatus;

  amount?: number | string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   RETURN REFUND
========================================================= */

export interface ReturnRefund {
  id: number;
  uuid?: string;

  returnRequestId: number;
  return_request_id?: number;

  paymentId?: number | null;
  payment_id?: number | null;

  refundNumber: string;

  paymentMethod: ReturnPaymentMethod;
  payment_method?: ReturnPaymentMethod;

  gateway?: string | null;

  refundAmount: number | string;
  refund_amount?: number | string;

  currency: string;

  status: ReturnRefundStatus;

  refundMethod?: string | null;
  refund_method?: string | null;

  refundReference?: string | null;
  refund_reference?: string | null;

  notes?: string | null;

    failureReason?: string | null;
  failure_reason?: string | null;
  
  scheduledAt: string;
  scheduled_at?: string;

  processingStartedAt?: string | null;
  processing_started_at?: string | null;

  nextRetryAt?: string | null;
  next_retry_at?: string | null;

  retryCount?: number;
  retry_count?: number;

  initiatedAt?: string | null;
  initiated_at?: string | null;

  completedAt?: string | null;
  completed_at?: string | null;

  failedAt?: string | null;
  failed_at?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   RETURN REQUEST
========================================================= */

export interface ReturnRequest {
  id: number;
  uuid: string;

  returnNumber: string;
  return_number?: string;

  orderId: number;
  order_id?: number;

  userId: number;
  user_id?: number;

  reason: ReturnReason;

  description?: string | null;

  images?: string[] | null;

  status: ReturnRequestStatus;

  adminNote?: string | null;
  admin_note?: string | null;

  rejectionReason?: string | null;
  rejection_reason?: string | null;

  requestedAt: string;
  requested_at?: string;

  approvedAt?: string | null;
  approved_at?: string | null;

  rejectedAt?: string | null;
  rejected_at?: string | null;

  receivedAt?: string | null;
  received_at?: string | null;

  inspectedAt?: string | null;
  inspected_at?: string | null;

  refundedAt?: string | null;
  refunded_at?: string | null;

  refundAmount: number | string;
  refund_amount?: number | string;

  currency: string;

  order?: ReturnOrder | null;

  user?: ReturnRequestUser | null;

  items?: ReturnItem[];

  shipments?: ReturnShipment[];

  refunds?: ReturnRefund[];

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
}

/* =========================================================
   RETURN REQUEST FILTERS
========================================================= */

export interface ReturnRequestFilters {
  page?: number;
  limit?: number;

  search?: string;

  returnNumber?: string;
  orderNumber?: string;

  customer?: string;
  email?: string;
  phone?: string;

  status?: ReturnRequestStatus | "";
  reason?: ReturnReason | "";

  dateFrom?: string;
  dateTo?: string;

  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/* =========================================================
   PAGINATION
========================================================= */

export interface ReturnRequestPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   RETURN REQUEST LIST RESULT
========================================================= */

export interface ReturnRequestListResult {
  rows: ReturnRequest[];
  count: number;

  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   RETURN REQUEST STATUS COUNTS
========================================================= */

export type ReturnRequestStatusCounts = Partial<
  Record<ReturnRequestStatus, number>
>;

/* =========================================================
   RETURN SHIPMENT ACTION PAYLOAD
========================================================= */

export interface ReturnShipmentActionPayload {
  adminNote?: string | null;
}

/* =========================================================
   APPROVE RETURN REQUEST
========================================================= */

export interface ApproveReturnRequestPayload {
  adminNote?: string | null;
}

/* =========================================================
   REJECT RETURN REQUEST
========================================================= */

export interface RejectReturnRequestPayload {
  rejectionReason: string;
  adminNote?: string | null;
}

/* =========================================================
   API RESPONSE
========================================================= */

export interface ReturnRequestApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
