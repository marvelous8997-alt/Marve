/* =========================
   Order Enums / Types
========================= */

export type OrderStatus =
  | "PENDING"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED";

export type OrderPaymentMethod = "ONLINE" | "COD";

export type OrderPaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type OrderFulfillmentStatus =
  | "UNFULFILLED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED";

/* =========================
   Create Order Request
========================= */

export interface CreateOrderItemRequest {
  productId: number;
  productVariationId?: number | null;
  quantity: number;
}

export interface CreateOrderRequest {
  checkoutAddressId: number;
  paymentMethod: OrderPaymentMethod;
  items: CreateOrderItemRequest[];
  couponCode?: string | null;
  selectedGiftProductIds?: number[];
  notes?: string | null;
}

export interface GetOrdersQuery {
  page?: number;
  limit?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
}
/* =========================
   Order Item Details
   Matches Backend OrderItem
========================= */

export interface OrderItemDetails {
  id: number;
  uuid?: string;

  productId: number;
  productVariationId?: number | null;

  productName: string;
  productSlug?: string | null;
  productSku?: string | null;

  variationName?: string | null;
  variationSku?: string | null;
  variationAttributes?: Record<string, unknown> | null;

  productImage?: string | null;

  quantity: number;

  unitPrice: number | string;
  unitDiscount: number | string;
  isFreeGift?: boolean;
  taxRate?: number | string;
  taxAmount: number | string;
  lineTotal: number | string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   Order Address
========================= */

export interface OrderAddress {
  id?: number;
  uuid?: string;

  fullName?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;

  houseNumber?: string | null;
  address?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  locality?: string | null;
  landmark?: string | null;

  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

/* =========================
   Delivery Address Snapshot
========================= */

export interface OrderDeliveryAddress {
  deliveryFullName?: string | null;
  deliveryPhone?: string | null;
  deliveryEmail?: string | null;

  deliveryPincode?: string | null;
  deliveryHouseNumber?: string | null;
  deliveryAddress?: string | null;
  deliveryLocality?: string | null;
  deliveryLandmark?: string | null;

  deliveryCity?: string | null;
  deliveryState?: string | null;
  deliveryPincodeCountry?: string | null;
}

/* =========================
   Order Totals
========================= */

export interface OrderTotals {
  subtotal: number | string;
  productDiscount: number | string;
  couponDiscount: number | string;
  taxAmount: number | string;
  shippingAmount: number | string;
  codCharge: number | string;
  totalAmount: number | string;
  currency?: string;
}

/* =========================
   Shipment Details
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

  estimatedDeliveryAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  lastTrackedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}
/* =========================
   Order Details
   Matches Backend Order
========================= */

export interface OrderDetails extends OrderDeliveryAddress {
  id: number;
  uuid?: string;
  orderNumber: string;

  userId?: number;
  checkoutAddressId?: number | null;

  currency: string;

  subtotal: number | string;
  productDiscount: number | string;
  couponDiscount: number | string;
  taxAmount: number | string;
  shippingAmount: number | string;
  codCharge: number | string;
  totalAmount: number | string;

  couponId?: number | null;
  couponCode?: string | null;

  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  couponType?: "DISCOUNT" | "BOGO" | null;

  fulfillmentStatus?: OrderFulfillmentStatus;

  placedAt?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;

  items: OrderItemDetails[];

  checkoutAddress?: OrderAddress | null;
  shipments?: ShipmentDetails[];
  createdAt: string;
  updatedAt: string;
}

/* =========================
   Order API Response
========================= */

export interface OrderApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Cancel Order Response
========================= */

export type CancelOrderResponse =
  OrderApiResponse<OrderDetails>;
/* =========================
   Response Types
========================= */

// Backend returns the created order directly inside data.
export type CreateOrderResponse =
  OrderApiResponse<OrderDetails>;

export type GetOrderResponse =
  OrderApiResponse<OrderDetails>;

export type GetOrdersResponse =
  OrderApiResponse<OrderDetails[]>;