/* =========================
   Payment Enums / Types
========================= */

export type PaymentProvider = "RAZORPAY" | "COD";

export type PaymentMethod =
  | "ONLINE"
  | "COD"
  | "UPI"
  | "CARD"
  | "NETBANKING"
  | "WALLET"
  | "EMI"
  | "OTHER";

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

/* =========================
   Create Payment Order
========================= */

export interface CreatePaymentOrderRequest {
  orderId: number;
}

export interface CreatePaymentOrderData {
  payment: {
    id: number;
    paymentNumber: string;
    orderId: number;
    provider: PaymentProvider;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number | string;
    currency: string;
    razorpayOrderId: string;
  };

  razorpay: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
  };

  message: string;
}

/* =========================
   Razorpay Checkout Options
========================= */

export interface RazorpayCheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  notes?: Record<string, string>;

  theme?: {
    color?: string;
  };

  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
  };

  handler: (response: RazorpayCheckoutResponse) => void;
}

/* =========================
   Razorpay Checkout Instance
========================= */

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (
    event: string,
    callback: (response: unknown) => void
  ) => void;
}

/* =========================
   Verify Payment
========================= */

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentData {
  paymentId: number;
  paymentNumber: string;
  orderId: number;

  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;

  amount: number;
  currency: string;

  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;

  verified: boolean;
  orderStatus?: string;
  paymentStatus?: string;
}

/* =========================
   Get Payment By ID
========================= */

export interface PaymentDetails {
  id: number;
  uuid?: string;
  paymentNumber: string;
  orderId: number;

  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;

  amount: number;
  currency: string;

  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;

  failureCode?: string | null;
  failureDescription?: string | null;

  authorizedAt?: string | null;
  capturedAt?: string | null;
  failedAt?: string | null;

  refundedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   Payment Action Data
========================= */

export interface PaymentActionData {
  payment?: PaymentDetails;
  paymentId?: number;
  orderId?: number;
  verified?: boolean;
}

/* =========================
   Payment API Response
========================= */

export interface PaymentApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Payment Response Types
========================= */

export type CreatePaymentOrderResponse =
  PaymentApiResponse<CreatePaymentOrderData>;

export type VerifyPaymentResponse =
  PaymentApiResponse<VerifyPaymentData>;

export type GetPaymentResponse =
  PaymentApiResponse<PaymentDetails>;

export type PaymentActionResponse =
  PaymentApiResponse<PaymentActionData | null>;