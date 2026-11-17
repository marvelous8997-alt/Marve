
/* =========================================================
   ORDER STATUS & PAYMENT TYPES
========================================================= */

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING"
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
   ORDER ADDRESS
========================================================= */

export interface OrderAddress {
  id?: number;
  uuid?: string;

  name: string;
  phone?: string | null;
  email?: string | null;

  addressLine1: string;
  addressLine2?: string | null;

  address_line1?: string;
  address_line2?: string | null;

  city: string;
  state: string;
  postalCode: string;
  postal_code?: string;

  country: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   CUSTOMER INFORMATION
========================================================= */

export interface OrderCustomer {
  id: number | string;
  uuid?: string;

  name?: string;
  firstName?: string;
  lastName?: string;

  first_name?: string;
  last_name?: string;

  email?: string | null;
  phone?: string | null;

  createdAt?: string;
}

/* =========================================================
   PRODUCT INFORMATION IN ORDER
========================================================= */

export interface OrderProductImage {
  id?: number;
  uuid?: string;

  imageUrl?: string;
  image_url?: string;

  altText?: string;
  alt_text?: string;

  isPrimary?: boolean;
  is_primary?: boolean;
}

/* =========================================================
   PRODUCT VARIATION ATTRIBUTE
========================================================= */

export interface OrderVariationAttribute {
  id?: number;
  uuid?: string;

  name: string;
  value: string;

  attributeName?: string;
  attributeValue?: string;

  attribute_name?: string;
  attribute_value?: string;
}

/* =========================================================
   PRODUCT VARIATION
========================================================= */

export interface OrderProductVariation {
  id?: number;
  uuid?: string;

  sku?: string | null;
  name?: string | null;

  price?: number;
  compareAtPrice?: number | null;
  compare_at_price?: number | null;

  attributes?: OrderVariationAttribute[];
  variationAttributes?: OrderVariationAttribute[];
  variation_attributes?: OrderVariationAttribute[];

  image?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
}

/* =========================================================
   ORDER ITEM
========================================================= */

export interface OrderItem {
  id: number | string;
  uuid?: string;

  orderId?: number | string;
  order_id?: number | string;

  productId?: number | string | null;
  product_id?: number | string | null;

  variationId?: number | string | null;
  variation_id?: number | string | null;

  productName: string;
  product_name?: string;

  sku?: string | null;

  image?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;

  quantity: number;

  price: number;
  unitPrice?: number;
  unit_price?: number;

  total: number;
  lineTotal?: number;
  line_total?: number;

  product?: {
    id?: number;
    uuid?: string;
    name?: string;
    slug?: string;
    sku?: string | null;
    images?: OrderProductImage[];
  } | null;

  variation?: OrderProductVariation | null;

  productVariation?: OrderProductVariation | null;
  product_variation?: OrderProductVariation | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   ORDER TIMELINE
========================================================= */

export interface OrderTimelineEntry {
  id?: number;
  status?: OrderStatus;

  title: string;
  description?: string;

  createdAt: string;
  created_at?: string;

  updatedBy?: string | null;
}

/* =========================================================
   ORDER
========================================================= */

export interface Order {
  id: number | string;
  uuid: string;

  orderNumber: string;
  order_number?: string;

  customerId?: number | string | null;
  customer_id?: number | string | null;

  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;

  customer_name?: string;
  customer_email?: string | null;
  customer_phone?: string | null;

  customer?: OrderCustomer | null;

  items: OrderItem[];
  itemCount?: number;
  item_count?: number;

  /* Pricing */

  subtotal: number;

  discount?: number;
  discountAmount?: number;
  discount_amount?: number;

  couponCode?: string | null;
  coupon_code?: string | null;
  couponDiscount?: number;
  coupon_discount?: number;

  tax?: number;
  taxAmount?: number;
  tax_amount?: number;

  shipping?: number;
  shippingAmount?: number;
  shipping_amount?: number;

  codCharge?: number;
  cod_charge?: number;

  total: number;
  totalAmount?: number;
  total_amount?: number;

  currency?: string;

  /* Payment */

  paymentMethod: PaymentMethod;
  payment_method?: PaymentMethod;

  paymentStatus: PaymentStatus;
  payment_status?: PaymentStatus;

  transactionId?: string | null;
  transaction_id?: string | null;

  paymentReference?: string | null;
  payment_reference?: string | null;

  paidAt?: string | null;
  paid_at?: string | null;

  /* Order status */

  status: OrderStatus;
  orderStatus?: OrderStatus;
  order_status?: OrderStatus;

  notes?: string | null;
  cancellationReason?: string | null;
  cancellation_reason?: string | null;

  /* Addresses */

  shippingAddress?: OrderAddress | null;
  shipping_address?: OrderAddress | null;

  billingAddress?: OrderAddress | null;
  billing_address?: OrderAddress | null;

  /* Timeline */
  /* Shipment */

  hasShipment?: boolean;
  shipments?: import("@/src/types/admin/shipment.types").Shipment[];
  timeline?: OrderTimelineEntry[];

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;

  createdBy?: number | null;
  updatedBy?: number | null;
}

/* =========================================================
   ORDER FILTERS
========================================================= */

export interface OrderFilters {
  page?: number;
  limit?: number;

  search?: string;
  orderNumber?: string;

  customer?: string;
  phone?: string;
  product?: string;

  orderStatus?: OrderStatus | "";
  paymentStatus?: PaymentStatus | "";
  paymentMethod?: PaymentMethod | "";

  dateFrom?: string;
  dateTo?: string;

  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/* =========================================================
   PAGINATION
========================================================= */

export interface OrderPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   ORDER LIST RESULT
========================================================= */

export interface OrderListResult {
  orders: Order[];
  pagination: OrderPagination;
}

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

export interface UpdatePaymentStatusData {
  paymentStatus: PaymentStatus;
}

/* =========================================================
   API RESPONSE
========================================================= */

export interface OrderApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
