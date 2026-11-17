/* =========================================================
   PAYMENT STATUS, METHOD & PROVIDER
========================================================= */

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod =
  | "ONLINE"
  | "COD"
  | "UPI"
  | "CARD"
  | "NETBANKING"
  | "WALLET"
  | "EMI"
  | "OTHER";

export type PaymentProvider = "RAZORPAY" | "COD";

export type PaymentSortOrder = "ASC" | "DESC";

/* =========================================================
   PAYMENT CUSTOMER
========================================================= */

export interface PaymentCustomer {
  id?: number | string;
  uuid?: string;

  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;

  email?: string | null;
  phone?: string | null;
}

/* =========================================================
   PAYMENT ORDER SUMMARY
========================================================= */

export interface PaymentOrderSummary {
  id: number | string;
  uuid?: string;

  orderNumber: string;
  order_number?: string;

  orderStatus?: string;
  order_status?: string;

  paymentStatus?: string;
  payment_status?: string;

  totalAmount?: number;
  total_amount?: number;

  currency?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   PAYMENT
========================================================= */

export interface Payment {
  id: number | string;
  uuid?: string;

  paymentNumber: string;
  paymentId?: string;
  payment_number?: string;

  orderId?: number | string;
  order_id?: number | string;

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

  customer?: PaymentCustomer | null;

  order?: PaymentOrderSummary | null;

  /* Payment Information */

  provider: PaymentProvider;
  gateway?: string;

  method: PaymentMethod;

  status: PaymentStatus;
  paymentStatus?: PaymentStatus;
  payment_status?: PaymentStatus;

  amount: number;
  currency: string;

  /* Gateway Information */

  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;

  transactionId?: string | null;
  transaction_id?: string | null;

  idempotencyKey?: string | null;

  /* Failure Information */

  failureCode?: string | null;
  failureDescription?: string | null;

  methodDetails?: Record<string, unknown> | null;

  /* Payment Dates */

  authorizedAt?: string | null;
  capturedAt?: string | null;
  failedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;

  /* Refund Information */

  refundedAmount: number;
  refundableAmount?: number;

  refundStatus?: "NONE" | "PARTIAL" | "FULL";
}

/* =========================================================
   PAYMENT FILTERS
========================================================= */

export interface PaymentFilters {
  page?: number;
  limit?: number;

  search?: string;

  status?: PaymentStatus | "";
  method?: PaymentMethod | "";
  provider?: PaymentProvider | "";

  dateFrom?: string;
  dateTo?: string;

  sortBy?: string;
  sortOrder?: PaymentSortOrder;
}

/* =========================================================
   PAGINATION
========================================================= */

export interface PaymentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   PAYMENT LIST RESULT
========================================================= */

export interface PaymentListResult {
  payments: Payment[];
  pagination: PaymentPagination;
}

/* =========================================================
   PAYMENT SUMMARY
========================================================= */

export interface PaymentSummary {
  totalPayments: number;
  capturedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  partiallyRefundedPayments: number;

  totalCapturedAmount?: number;
  totalRefundedAmount?: number;
}

/* =========================================================
   PAYMENT STATUS COUNTS
========================================================= */

export interface PaymentStatusCounts {
  CREATED?: number;
  PENDING?: number;
  AUTHORIZED?: number;
  CAPTURED?: number;
  PAID?: number;
  FAILED?: number;
  CANCELLED?: number;
  REFUNDED?: number;
  PARTIALLY_REFUNDED?: number;

  [status: string]: number | undefined;
}

/* =========================================================
   REFUND REASONS
========================================================= */

export type RefundReason =
  | "CUSTOMER_REQUEST"
  | "ORDER_CANCELLED"
  | "PRODUCT_RETURNED"
  | "PRODUCT_DAMAGED"
  | "DUPLICATE_PAYMENT"
  | "PAYMENT_ERROR"
  | "OTHER";

/* =========================================================
   REFUND REQUEST
========================================================= */

export interface RefundPaymentData {
  amount: number;
  reason: RefundReason;
}

/* =========================================================
   REFUND RESULT
========================================================= */

export interface RefundResult {
  paymentId?: number | string;
  paymentNumber?: string;

  amount: number;
  refundedAmount?: number;
  refundableAmount?: number;

  status: PaymentStatus | string;
  refundId?: string | null;

  message?: string;
}

/* =========================================================
   API RESPONSE
========================================================= */

export interface PaymentApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
