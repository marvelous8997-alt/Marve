import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
  applyCouponApi,
  selectBogoGiftApi,
  removeCouponApi,
} from "@/src/api/user/cart.api";

import type {
  GetCartResponse,
  AddToCartResponse,
  UpdateCartItemResponse,
  RemoveCartItemResponse,
  ClearCartResponse,
  ApplyCouponResponse,
  SelectBogoGiftResponse,
  RemoveCouponResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  ApplyCouponRequest,
  SelectBogoGiftRequest,
} from "@/src/types/user/cart.types";

/* =========================
   Get Customer Cart Service
========================= */

export const getCartService =
  async (): Promise<GetCartResponse> => {
    return await getCartApi();
  };

/* =========================
   Add Product To Cart Service
========================= */

export const addToCartService = async (
  payload: AddToCartRequest
): Promise<AddToCartResponse> => {
  return await addToCartApi(payload);
};

/* =========================
   Update Cart Item Quantity Service
========================= */

export const updateCartItemService = async (
  itemId: number | string,
  payload: UpdateCartItemRequest
): Promise<UpdateCartItemResponse> => {
  return await updateCartItemApi(itemId, payload);
};

/* =========================
   Remove Cart Item Service
========================= */

export const removeCartItemService = async (
  itemId: number | string
): Promise<RemoveCartItemResponse> => {
  return await removeCartItemApi(itemId);
};

/* =========================
   Clear Customer Cart Service
========================= */

export const clearCartService =
  async (): Promise<ClearCartResponse> => {
    return await clearCartApi();
  };

/* =========================
   Apply Coupon Service
========================= */

export const applyCouponService = async (
  payload: ApplyCouponRequest
): Promise<ApplyCouponResponse> => {
  return await applyCouponApi(payload);
};

/* =========================
   Select BOGO Gift Service
========================= */

export const selectBogoGiftService = async (
  payload: SelectBogoGiftRequest
): Promise<SelectBogoGiftResponse> => {
  return await selectBogoGiftApi(payload);
};

/* =========================
   Remove Coupon Service
========================= */

export const removeCouponService =
  async (): Promise<RemoveCouponResponse> => {
    return await removeCouponApi();
  };