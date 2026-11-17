/* =========================
   Address Types
========================= */

export type CheckoutAddressType =
  | "HOME"
  | "FRIENDS"
  | "WORK"
  | "OTHER";

/* =========================
   Checkout Address
========================= */

export interface CheckoutAddress {
  id: number;
  uuid: string;

  userId: number;

  fullName: string;
  phone: string;
  email: string | null;

  pincode: string;
  houseNumber: string;
  address: string;
  locality: string;
  landmark: string | null;

  city: string;
  state: string;

  addressType: CheckoutAddressType;
  isDefault: boolean;

  latitude: number | null;
  longitude: number | null;

  createdAt: string;
  updatedAt: string;
}

/* =========================
   Create Checkout Address
========================= */

export interface CreateCheckoutAddressRequest {
  fullName: string;
  phone: string;
  email?: string | null;

  pincode: string;
  houseNumber: string;
  address: string;
  locality: string;
  landmark?: string | null;

  city: string;
  state: string;

  addressType?: CheckoutAddressType;
  isDefault?: boolean;

  latitude?: number | null;
  longitude?: number | null;
}

/* =========================
   Update Checkout Address
========================= */

export interface UpdateCheckoutAddressRequest {
  fullName?: string;
  phone?: string;
  email?: string | null;

  pincode?: string;
  houseNumber?: string;
  address?: string;
  locality?: string;
  landmark?: string | null;

  city?: string;
  state?: string;

  addressType?: CheckoutAddressType;
  isDefault?: boolean;

  latitude?: number | null;
  longitude?: number | null;
}

/* =========================
   Checkout Address Action Data
========================= */

export interface CheckoutAddressActionData {
  address?: CheckoutAddress;
  id?: number;
  deleted?: boolean;
}

/* =========================
   Checkout Address API Response
========================= */

export interface CheckoutAddressApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Checkout Address Response Types
========================= */

export type GetCheckoutAddressesResponse =
  CheckoutAddressApiResponse<CheckoutAddress[]>;

export type GetCheckoutAddressResponse =
  CheckoutAddressApiResponse<CheckoutAddress>;

export type CreateCheckoutAddressResponse =
  CheckoutAddressApiResponse<CheckoutAddress>;

export type UpdateCheckoutAddressResponse =
  CheckoutAddressApiResponse<CheckoutAddress>;

export type DeleteCheckoutAddressResponse =
  CheckoutAddressApiResponse<CheckoutAddressActionData | null>;

export type SetDefaultCheckoutAddressResponse =
  CheckoutAddressApiResponse<CheckoutAddress>;