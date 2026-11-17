"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import useAuth from "@/src/hooks/user/useAuth";
import useCart from "@/src/hooks/user/useCart";


import type {
  AppliedCartCoupon,
  CartSummary,
  SelectBogoGiftRequest,
} from "@/src/types/user/cart.types";


/* ========================= Types ========================= */

export interface BasketProduct {
  /** Actual cart-item ID returned by the backend */
  cartItemId: number;

  /** Product ID */
  id: number | string;

  productVariationId?: number | null;
  isFreeGift?: boolean;

  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  image: string;
  category: string;
  quantity: number;
  stock: number;
}

interface BasketContextType {
  items: BasketProduct[];
  totalItems: number;
  subtotal: number;
  summary: CartSummary;
  isBasketReady: boolean;
  coupon: AppliedCartCoupon | null;
  isAdding: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  isClearing: boolean;
  isApplyingCoupon: boolean;
  isSelectingBogoGift: boolean;
  isRemovingCoupon: boolean;
  originalSubtotal: number;
productDiscount: number;
couponDiscount: number;
shipping: number;
payableTotal: number;

  addToBasket: (
    product: Omit<BasketProduct, "quantity" | "cartItemId">
  ) => Promise<void>;

  increaseQuantity: (cartItemId: number) => Promise<void>;
  decreaseQuantity: (cartItemId: number) => Promise<void>;
  removeFromBasket: (cartItemId: number) => Promise<void>;
  clearBasket: () => Promise<void>;

  applyCoupon: (code: string) => Promise<unknown>;
  selectBogoGift: (
    payload: SelectBogoGiftRequest
  ) => Promise<unknown>;
  removeCoupon: () => Promise<boolean>;
}

interface BasketProviderProps {
  children: ReactNode;
}

/* ========================= Context ========================= */

const BasketContext = createContext<BasketContextType | undefined>(
  undefined
);

/* ========================= Provider ========================= */

export function BasketProvider({ children }: BasketProviderProps) {
  const { isAuthenticated, isAuthReady } = useAuth();

  const {
    cart,
    coupon,
    items: cartItems,
    summary,
    isLoading,
    isAdding,
    isUpdating,
    isRemoving,
    isClearing,
    isApplyingCoupon,
    isSelectingBogoGift,
    isRemovingCoupon,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart: clearBackendCart,
    applyCoupon: applyCartCoupon,
    selectBogoGift: selectCartBogoGift,
    removeCoupon: removeCartCoupon,
  } = useCart();

  const [hasLoaded, setHasLoaded] = useState(false);

  /* ========================= Load Cart ========================= */

  useEffect(() => {
    if (!isAuthReady) return;

    let cancelled = false;

    const loadCart = async () => {
      if (!isAuthenticated) {
        setHasLoaded(true);
        return;
      }

      setHasLoaded(false);

      await fetchCart(false);

      if (!cancelled) {
        setHasLoaded(true);
      }
    };

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [isAuthReady, isAuthenticated, fetchCart]);

  /* ========================= Map API Cart Items ========================= */

  const items = useMemo<BasketProduct[]>(() => {
    return cartItems
      .filter((item) => item.product !== null)
      .map((item) => {
        const product = item.product!;
        const variation = item.variation;

        const primaryImage =
          product.images?.find((image) => image.is_primary) ??
          product.images?.[0];

        const isFreeGift = Boolean(item.is_free_gift);

        const sellingPrice = isFreeGift
          ? 0
          : Number(
              item.unitPrice ??
                variation?.price ??
                product.price
            ) || 0;

        const variationOriginalPrice =
          variation?.compare_at_price != null
            ? Number(variation.compare_at_price)
            : null;

        const productOriginalPrice =
          product.compare_at_price != null
            ? Number(product.compare_at_price)
            : null;

        const originalPrice =
          variationOriginalPrice != null &&
          variationOriginalPrice > sellingPrice
            ? variationOriginalPrice
            : productOriginalPrice != null &&
                productOriginalPrice > sellingPrice
              ? productOriginalPrice
              : null;

        return {
          cartItemId: item.id,
          id: product.id,
          productVariationId: item.product_variation_id,
          isFreeGift,
          name: product.name,
          slug: product.slug,
          price: sellingPrice,
          originalPrice: isFreeGift ? null : originalPrice,
          image: primaryImage?.image_url ?? "",
          category: product.category?.name ?? "Home & Kitchen",
          quantity: item.quantity,
          stock: Math.max(
            0,
            Number(variation?.stock ?? product.stock) || 0
          ),
        };
      });
  }, [cartItems]);

  /* ========================= Authentication Guard ========================= */

  const requireLogin = useCallback((): boolean => {
    if (!isAuthReady) {
      toast.info("Please wait while we check your login.");
      return false;
    }

    if (!isAuthenticated) {
      window.dispatchEvent(new Event("marve-open-login"));
      return false;
    }

    return true;
  }, [isAuthReady, isAuthenticated]);

  /* ========================= Add Product ========================= */

  const addToBasket = useCallback(
    async (
      product: Omit<BasketProduct, "quantity" | "cartItemId">
    ): Promise<void> => {
      if (!requireLogin()) return;

      if (product.isFreeGift) {
        toast.info("Free gifts are managed through the coupon.");
        return;
      }

      const productId = Number(product.id);

      if (!Number.isInteger(productId) || productId <= 0) {
        toast.error("Invalid product. Please refresh and try again.");
        return;
      }

      if (Number(product.stock) <= 0) {
        toast.error("This product is currently out of stock.");
        return;
      }

      await addToCart({
        productId,
        quantity: 1,
        productVariationId: product.productVariationId ?? null,
      });
    },
    [addToCart, requireLogin]
  );

  /* ========================= Find Cart Item ========================= */

  const findCartItem = useCallback(
    (cartItemId: number) =>
      cartItems.find((item) => item.id === cartItemId),
    [cartItems]
  );

  /* ========================= Increase Quantity ========================= */

  const increaseQuantity = useCallback(
    async (cartItemId: number): Promise<void> => {
      if (!requireLogin()) return;

      const item = findCartItem(cartItemId);

      if (!item || item.is_free_gift) return;

      const stock =
        Number(item.variation?.stock ?? item.product?.stock) || 0;

      if (item.quantity >= stock) {
        toast.error("You have reached the available stock limit.");
        return;
      }

      await updateCartItem(item.id, {
        quantity: item.quantity + 1,
      });
    },
    [findCartItem, requireLogin, updateCartItem]
  );

  /* ========================= Decrease Quantity ========================= */

  const decreaseQuantity = useCallback(
    async (cartItemId: number): Promise<void> => {
      if (!requireLogin()) return;

      const item = findCartItem(cartItemId);

      if (!item || item.is_free_gift) return;

      if (item.quantity <= 1) {
        await removeCartItem(item.id);
        return;
      }

      await updateCartItem(item.id, {
        quantity: item.quantity - 1,
      });
    },
    [findCartItem, requireLogin, removeCartItem, updateCartItem]
  );

  /* ========================= Remove Product ========================= */

  const removeFromBasket = useCallback(
    async (cartItemId: number): Promise<void> => {
      if (!requireLogin()) return;

      const item = findCartItem(cartItemId);

      if (!item) return;

      if (item.is_free_gift) {
        toast.info("Remove the coupon to remove its free gift.");
        return;
      }

      await removeCartItem(item.id);
    },
    [findCartItem, removeCartItem, requireLogin]
  );

  /* ========================= Clear Cart ========================= */

  const clearBasket = useCallback(async (): Promise<void> => {
    if (!requireLogin()) return;

    await clearBackendCart();
  }, [clearBackendCart, requireLogin]);

  /* ========================= Apply Coupon ========================= */

  const applyCoupon = useCallback(
    async (code: string): Promise<unknown> => {
      if (!requireLogin()) return null;

      const normalizedCode = code.trim();

      if (!normalizedCode) {
        toast.error("Please enter a coupon code.");
        return null;
      }

      return applyCartCoupon({ code: normalizedCode });
    },
    [applyCartCoupon, requireLogin]
  );

  /* ========================= Select BOGO Gift ========================= */

  const selectBogoGift = useCallback(
    async (
      payload: SelectBogoGiftRequest
    ): Promise<unknown> => {
      if (!requireLogin()) return null;

      const productId = Number(payload.productId);

      if (!Number.isInteger(productId) || productId <= 0) {
        toast.error("Please select a valid gift product.");
        return null;
      }

      return selectCartBogoGift({
        productId,
        productVariationId: payload.productVariationId ?? null,
      });
    },
    [requireLogin, selectCartBogoGift]
  );

  /* ========================= Remove Coupon ========================= */

  const removeCoupon = useCallback(async (): Promise<boolean> => {
    if (!requireLogin()) return false;

    return removeCartCoupon();
  }, [removeCartCoupon, requireLogin]);

  /* ========================= Derived State ========================= */

  const isBasketReady =
    isAuthReady &&
    hasLoaded &&
    (!isAuthenticated || !isLoading);

const totalItems = summary.totalItems ?? 0;
const subtotal = summary.subtotal ?? 0;
const originalSubtotal = summary.originalSubtotal ?? 0;
const productDiscount = summary.productDiscount ?? 0;
const couponDiscount = summary.couponDiscount ?? 0;
const shipping = summary.shipping ?? 0;
const payableTotal = summary.payableTotal ?? 0;

  /* ========================= Context Value ========================= */

  const value = useMemo<BasketContextType>(
    () => ({
      items,
      totalItems,
      subtotal,
      summary,
      coupon,
      isBasketReady,

      isAdding,
      isUpdating,
      isRemoving,
      isClearing,
      isApplyingCoupon,
      isSelectingBogoGift,
      isRemovingCoupon,

originalSubtotal,
productDiscount,
couponDiscount,
shipping,
payableTotal,

      addToBasket,
      increaseQuantity,
      decreaseQuantity,
      removeFromBasket,
      clearBasket,

      applyCoupon,
      selectBogoGift,
      removeCoupon,
    }),
    [
      items,
      totalItems,
      subtotal,
      summary,
      coupon,
      isBasketReady,
      isAdding,
      isUpdating,
      isRemoving,
      isClearing,
      isApplyingCoupon,
      isSelectingBogoGift,
      isRemovingCoupon,
      addToBasket,
      increaseQuantity,
      decreaseQuantity,
      removeFromBasket,
      clearBasket,
      applyCoupon,
      selectBogoGift,
      removeCoupon,
    ]
  );

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
}

/* ========================= Consumer Hook ========================= */

export default function useBasket(): BasketContextType {
  const context = useContext(BasketContext);

  if (!context) {
    throw new Error("useBasket must be used inside a BasketProvider.");
  }

  return context;
}