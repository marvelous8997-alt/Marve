"use client";

import {
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import { clearAuth } from "@/src/utils/storage";

import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
  applyCouponService,
  selectBogoGiftService,
  removeCouponService,
} from "@/src/services/user/cart.service";

import type {
  Cart,
  CartItem,
  CartSummary,
  AddToCartRequest,
  UpdateCartItemRequest,
  GetCartData,
  ApplyCouponRequest,
  SelectBogoGiftRequest,
} from "@/src/types/user/cart.types";

/* =========================
   Error Message Handler
========================= */

const getCartErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 401) {
      return serverMessage || "Please log in to continue.";
    }

    if (status === 403) {
      return serverMessage || "Your account cannot access the cart.";
    }

    if (status === 404) {
      return serverMessage || "Cart item or product not found.";
    }

    if (status === 400) {
      return serverMessage || "Invalid cart request.";
    }

    if (status === 409) {
      return serverMessage || "The requested quantity is unavailable.";
    }

    if (status && status >= 500) {
      return "Something went wrong on the server. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* =========================
   Empty Cart Defaults
========================= */

const EMPTY_SUMMARY: CartSummary = {
  totalItems: 0,
  originalSubtotal: 0,
  subtotal: 0,
  productDiscount: 0,
  couponDiscount: 0,
  shipping: 0,
  total: 0,
  payableTotal: 0,
};

/* =========================
   Custom Cart Hook
========================= */

export default function useCart() {

  const handleUnauthorized = useCallback(() => {
  clearAuth();

  window.dispatchEvent(new Event("marve-auth-changed"));

  toast.error("Your session has expired. Please log in again.");
}, []);

  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] =
  useState<GetCartData["coupon"]>(null);
  const [summary, setSummary] =
    useState<CartSummary>(EMPTY_SUMMARY);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [isApplyingCoupon, setIsApplyingCoupon] =
    useState(false);
  const [isSelectingBogoGift, setIsSelectingBogoGift] =
    useState(false);
  const [isRemovingCoupon, setIsRemovingCoupon] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  /* =========================
     Apply Cart Response
  ========================= */


const applyCartData = useCallback(
  (data: GetCartData) => {
    setCart(data.cart);
    setItems(Array.isArray(data.items) ? data.items : []);
    setCoupon(data.coupon ?? null);

    setSummary({
      ...EMPTY_SUMMARY,
      ...(data.summary ?? {}),
    });
  },
  []
);


  /* =========================
     Refresh Cart Data
  ========================= */

  const syncCartData = useCallback(async () => {
    const response = await getCartService();

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Unable to refresh your basket."
      );
    }

    applyCartData(response.data);

    return response.data;
  }, [applyCartData]);

  /* =========================
     Fetch Customer Cart
  ========================= */

  const fetchCart = useCallback(
    async (showErrorToast = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCartService();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch your basket."
          );
        }

        applyCartData(response.data);
        return response.data;
      } catch (err: unknown) {
        const message = getCartErrorMessage(
          err,
          "Unable to fetch your basket. Please try again."
        );

        setError(message);

        if (showErrorToast) {
          toast.error(message);
        }

if (
  axios.isAxiosError(err) &&
  err.response?.status === 401
) {
  handleUnauthorized();
}

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [applyCartData, handleUnauthorized]
  );

  /* =========================
     Add Product To Cart
  ========================= */

  const addToCart = useCallback(
    async (
      payload: AddToCartRequest,
      isAuthenticated = true
    ) => {
if (!isAuthenticated) {
  window.dispatchEvent(new Event("marve-open-login"));
  return null;
}

      setIsAdding(true);
      setError(null);

      try {
        const response = await addToCartService(payload);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to add product to basket."
          );
        }

        await syncCartData();

        toast.success(
          response.message || "Product added to your basket."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getCartErrorMessage(
          err,
          "Unable to add product to basket. Please try again."
        );

        setError(message);
        toast.error(message);

if (
  axios.isAxiosError(err) &&
  err.response?.status === 401
) {
  handleUnauthorized();
}

        return null;
      } finally {
        setIsAdding(false);
      }
    },
    [handleUnauthorized, syncCartData]
  );

  /* =========================
     Update Cart Item Quantity
  ========================= */

  const updateCartItem = useCallback(
    async (
      itemId: number | string,
      payload: UpdateCartItemRequest
    ) => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await updateCartItemService(
          itemId,
          payload
        );

        if (!response.success) {
          throw new Error(
            response.message || "Unable to update item quantity."
          );
        }

        await syncCartData();

        toast.success(
          response.message || "Basket quantity updated."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getCartErrorMessage(
          err,
          "Unable to update quantity. Please try again."
        );

        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [syncCartData]
  );

  /* =========================
     Remove Cart Item
  ========================= */

  const removeCartItem = useCallback(
    async (itemId: number | string) => {
      setIsRemoving(true);
      setError(null);

      try {
        const response = await removeCartItemService(itemId);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to remove item."
          );
        }

        await syncCartData();

        toast.success(
          response.message || "Item removed from your basket."
        );

        return true;
      } catch (err: unknown) {
        const message = getCartErrorMessage(
          err,
          "Unable to remove item. Please try again."
        );

        setError(message);
        toast.error(message);
        return false;
      } finally {
        setIsRemoving(false);
      }
    },
    [syncCartData]
  );

  /* =========================
     Clear Cart
  ========================= */

  const clearCart = useCallback(async () => {
    setIsClearing(true);
    setError(null);

    try {
      const response = await clearCartService();

      if (!response.success) {
        throw new Error(
          response.message || "Unable to clear your basket."
        );
      }

      await syncCartData();

      toast.success(
        response.message || "Your basket has been cleared."
      );

      return true;
    } catch (err: unknown) {
      const message = getCartErrorMessage(
        err,
        "Unable to clear basket. Please try again."
      );

      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsClearing(false);
    }
  }, [syncCartData]);

  /* =========================
     Apply Coupon
  ========================= */

  const applyCoupon = useCallback(
    async (payload: ApplyCouponRequest) => {
      setIsApplyingCoupon(true);
      setError(null);

      try {
        const response = await applyCouponService(payload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to apply coupon."
          );
        }

        await syncCartData();

        toast.success(
          response.message || "Coupon applied successfully."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getCartErrorMessage(
          err,
          "Unable to apply coupon. Please try again."
        );

        setError(message);
        toast.error(message);

if (
  axios.isAxiosError(err) &&
  err.response?.status === 401
) {
  handleUnauthorized();
}

        return null;
      } finally {
        setIsApplyingCoupon(false);
      }
    },
    [handleUnauthorized, syncCartData]
  );

  /* =========================
     Select BOGO Gift
  ========================= */

  const selectBogoGift = useCallback(
    async (payload: SelectBogoGiftRequest) => {
      setIsSelectingBogoGift(true);
      setError(null);

      try {
        const response = await selectBogoGiftService(payload);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to select your free gift."
          );
        }

        await syncCartData();

        toast.success(
          response.message || "Free gift added to your basket."
        );

        return response.data;
      } catch (err: unknown) {
        const message = getCartErrorMessage(
          err,
          "Unable to select free gift. Please try again."
        );

        setError(message);
        toast.error(message);

if (
  axios.isAxiosError(err) &&
  err.response?.status === 401
) {
  handleUnauthorized();
}

        return null;
      } finally {
        setIsSelectingBogoGift(false);
      }
    },
    [handleUnauthorized, syncCartData]
  );

  /* =========================
     Remove Coupon
  ========================= */

  const removeCoupon = useCallback(async () => {
    setIsRemovingCoupon(true);
    setError(null);

    try {
      const response = await removeCouponService();

      if (!response.success) {
        throw new Error(
          response.message || "Unable to remove coupon."
        );
      }

      await syncCartData();

      toast.success(
        response.message || "Coupon removed successfully."
      );

      return true;
    } catch (err: unknown) {
      const message = getCartErrorMessage(
        err,
        "Unable to remove coupon. Please try again."
      );

      setError(message);
      toast.error(message);

if (
  axios.isAxiosError(err) &&
  err.response?.status === 401
) {
  handleUnauthorized();
}

      return false;
    } finally {
      setIsRemovingCoupon(false);
    }
  }, [handleUnauthorized, syncCartData]);

  /* =========================
     Refresh Cart
  ========================= */

  const refreshCart = useCallback(async () => {
    return await fetchCart(true);
  }, [fetchCart]);

  /* =========================
     Clear Error
  ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================
     Return
  ========================= */

return {
  cart,
  coupon,
  items,
  summary,
    totalItems: summary.totalItems,
    subtotal: summary.subtotal,

    isLoading,
    isAdding,
    isUpdating,
    isRemoving,
    isClearing,

    isApplyingCoupon,
    isSelectingBogoGift,
    isRemovingCoupon,

    originalSubtotal: summary.originalSubtotal,
productDiscount: summary.productDiscount,
couponDiscount: summary.couponDiscount,
shipping: summary.shipping,
payableTotal: summary.payableTotal,

    error,

    fetchCart,
    refreshCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,

    applyCoupon,
    selectBogoGift,
    removeCoupon,

    clearError,
  };
}