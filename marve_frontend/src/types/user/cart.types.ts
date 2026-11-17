/* =========================
   Imports
========================= */

import type { UserProductWithRelations } from "./product.types";

/* =========================
   Cart Types
========================= */

export type CartStatus = "ACTIVE" | "CONVERTED" | "ABANDONED";

export type CartCouponType = "DISCOUNT" | "BOGO";

export type DiscountType = "PERCENTAGE" | "FIXED";

/* =========================
   Product Variation
========================= */

export interface CartProductVariation {
  id: number;
  uuid?: string;
  product_id: number;
  name: string;
  sku?: string | null;

  // Example: { Color: "Black", Size: "Large" }
  attributes?: Record<string, string | number | boolean | null> | null;

  price: number;
  compare_at_price?: number | null;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  sort_order?: number;
}

/* =========================
   Cart Coupon
========================= */

export interface AppliedCartCoupon {
  type: CartCouponType;
  code: string;
  name: string;

  // Discount coupon fields
  discount?: number;

  // BOGO coupon fields
  eligibleGiftProducts?: BogoEligibleGiftProduct[];
  selectedGiftProductId?: number | null;
  giftSelectionRequired?: boolean;
}

export interface BogoEligibleGiftProduct {
  id?: number;
  bogo_coupon_id?: number;
  product_id: number;

  product?: UserProductWithRelations | null;
}

/* =========================
   Cart Item
========================= */

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  product_variation_id: number | null;
  quantity: number;

  // True when this item is the selected BOGO gift
  is_free_gift: boolean;

  createdAt: string;
  updatedAt: string;

  // Associated product
  product: UserProductWithRelations | null;

  // Selected variation, if applicable
  variation: CartProductVariation | null;

  // Backend-calculated pricing
  originalUnitPrice?: number;
  unitPrice?: number;
  originalLineTotal?: number;
  lineTotal?: number;
  productDiscount?: number;


  // Availability flags
  unavailable?: boolean;
  is_available?: boolean;
  available_stock?: number;
}

/* =========================
   Cart
========================= */

export interface Cart {
  id: number;
  user_id: number;
  status: CartStatus;

  applied_coupon_type: CartCouponType | null;
  applied_coupon_id: number | null;
  applied_coupon_code: string | null;
  selected_bogo_product_id: number | null;

  createdAt: string;
  updatedAt: string;

  items?: CartItem[];
}

/* =========================
   Cart Summary
========================= */

/* =========================
   Cart Summary
========================= */


export interface CartSummary {
  totalItems: number;

  // Product pricing
  originalSubtotal: number;
  subtotal: number;
  productDiscount: number;

  // Coupon discount — GST is not included
  couponDiscount: number;

  // Final charges
  shipping: number;
  total: number;
  payableTotal: number;

  note?: string;
}


/* =========================
   Get Cart Data
========================= */

export interface GetCartData {
  cart: Cart | null;
  items: CartItem[];
  coupon: AppliedCartCoupon | null;
  summary: CartSummary;
}

/* =========================
   Add To Cart Request
========================= */

export interface AddToCartRequest {
  productId: number;
  quantity?: number;
  productVariationId?: number | null;
}

/* =========================
   Update Cart Item Request
========================= */

export interface UpdateCartItemRequest {
  quantity: number;
}

/* =========================
   Apply Coupon Request
========================= */

export interface ApplyCouponRequest {
  code: string;
}

/* =========================
   Select BOGO Gift Request
========================= */

export interface SelectBogoGiftRequest {
  productId: number;
  productVariationId?: number | null;
}

/* =========================
   Cart Action Responses
========================= */

export interface CartActionData {
  cartId?: number;
  itemId?: number;
  productId?: number;
  productVariationId?: number | null;
  quantity?: number;
  unitPrice?: number;
}

/* =========================
   Apply Coupon Response Data
========================= */

export interface ApplyCouponData {
  coupon: AppliedCartCoupon;
}

/* =========================
   Select BOGO Gift Response Data
========================= */

export interface SelectBogoGiftData {
  cartId: number;
  productId: number;
  productVariationId: number | null;
  itemId: number;
  quantity: number;
  isFreeGift: boolean;
  effectivePrice: number;
}

/* =========================
   API Response
========================= */

export interface CartApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* =========================
   Cart API Response Types
========================= */

export type GetCartResponse =
  CartApiResponse<GetCartData>;

export type AddToCartResponse =
  CartApiResponse<CartActionData>;

export type UpdateCartItemResponse =
  CartApiResponse<CartActionData>;

export type RemoveCartItemResponse =
  CartApiResponse<null>;

export type ClearCartResponse =
  CartApiResponse<null>;

export type ApplyCouponResponse =
  CartApiResponse<ApplyCouponData>;

export type SelectBogoGiftResponse =
  CartApiResponse<SelectBogoGiftData>;

export type RemoveCouponResponse =
  CartApiResponse<null>;