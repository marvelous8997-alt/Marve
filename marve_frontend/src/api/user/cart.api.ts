import axiosInstance from "@/src/lib/axios";

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
   API Endpoints
========================= */

export const CART_API = {
  BASE: "/user/cart",

  GET_CART: "/user/cart",

  ADD_ITEM: "/user/cart/items",

  UPDATE_ITEM: (itemId: number | string) =>
    `/user/cart/items/${itemId}`,

  REMOVE_ITEM: (itemId: number | string) =>
    `/user/cart/items/${itemId}`,

  CLEAR_CART: "/user/cart/items",

  // Coupon endpoints
  APPLY_COUPON: "/user/cart/coupon",

  SELECT_BOGO_GIFT: "/user/cart/coupon/bogo-gift",

  REMOVE_COUPON: "/user/cart/coupon",
};

/* =========================
   Get Customer Cart API
========================= */

export const getCartApi =
  async (): Promise<GetCartResponse> => {
    const response =
      await axiosInstance.get<GetCartResponse>(
        CART_API.GET_CART
      );

    return response.data;
  };

/* =========================
   Add Product To Cart API
========================= */

export const addToCartApi = async (
  payload: AddToCartRequest
): Promise<AddToCartResponse> => {
  const response =
    await axiosInstance.post<AddToCartResponse>(
      CART_API.ADD_ITEM,
      payload
    );

  return response.data;
};

/* =========================
   Update Cart Item Quantity API
========================= */

export const updateCartItemApi = async (
  itemId: number | string,
  payload: UpdateCartItemRequest
): Promise<UpdateCartItemResponse> => {
  const response =
    await axiosInstance.patch<UpdateCartItemResponse>(
      CART_API.UPDATE_ITEM(itemId),
      payload
    );

  return response.data;
};

/* =========================
   Remove Cart Item API
========================= */

export const removeCartItemApi = async (
  itemId: number | string
): Promise<RemoveCartItemResponse> => {
  const response =
    await axiosInstance.delete<RemoveCartItemResponse>(
      CART_API.REMOVE_ITEM(itemId)
    );

  return response.data;
};

/* =========================
   Clear Customer Cart API
========================= */

export const clearCartApi =
  async (): Promise<ClearCartResponse> => {
    const response =
      await axiosInstance.delete<ClearCartResponse>(
        CART_API.CLEAR_CART
      );

    return response.data;
  };

/* =========================
   Apply Coupon API
========================= */

// POST /user/cart/coupon
// Body: { code: "SAVE10" }

export const applyCouponApi = async (
  payload: ApplyCouponRequest
): Promise<ApplyCouponResponse> => {
  const response =
    await axiosInstance.post<ApplyCouponResponse>(
      CART_API.APPLY_COUPON,
      payload
    );

  return response.data;
};

/* =========================
   Select BOGO Gift API
========================= */

// POST /user/cart/coupon/bogo-gift
// Body: { productId: 10, productVariationId: 3 }
// productVariationId is optional.

export const selectBogoGiftApi = async (
  payload: SelectBogoGiftRequest
): Promise<SelectBogoGiftResponse> => {
  const response =
    await axiosInstance.post<SelectBogoGiftResponse>(
      CART_API.SELECT_BOGO_GIFT,
      payload
    );

  return response.data;
};

/* =========================
   Remove Coupon API
========================= */

// DELETE /user/cart/coupon

export const removeCouponApi =
  async (): Promise<RemoveCouponResponse> => {
    const response =
      await axiosInstance.delete<RemoveCouponResponse>(
        CART_API.REMOVE_COUPON
      );

    return response.data;
  };