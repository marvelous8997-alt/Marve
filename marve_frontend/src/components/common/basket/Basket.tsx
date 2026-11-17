"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  TicketPercent,
  Tag,
  Clock3,
  CheckCircle2,
  Info,
  Gift,
  LoaderCircle,
} from "lucide-react";

import useOffer from "@/src/hooks/user/useOffer";
import type { UserOffer } from "@/src/types/user/offer.types";
import CouponModal from "@/src/components/common/coupon/CouponModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAuth from "@/src/hooks/user/useAuth";
import CheckoutAddress from "@/src/components/common/checkout/CheckoutAddress";
import useBasket from "@/src/context/BasketContext";

interface BasketProps {
  onClose: () => void;
}

/* ========================= Helpers ========================= */

const formatPrice = (price: number | null | undefined) => {
  const amount = Number(price ?? 0);

  return `₹${(Number.isFinite(amount) ? amount : 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

/* ========================= Component ========================= */

export default function Basket({ onClose }: BasketProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

  const router = useRouter();
  const { isAuthenticated, isAuthReady } = useAuth();

const {
  items,
  subtotal,
  totalItems,
  summary,
  coupon,
  isBasketReady,
  isUpdating,
  isRemoving,
  isApplyingCoupon,
  isSelectingBogoGift,
  isRemovingCoupon,
  increaseQuantity,
  decreaseQuantity,
  removeFromBasket,
  applyCoupon,
  removeCoupon,
  selectBogoGift, // Add this
} = useBasket();

  const {
    offers,
    isLoading: isOffersLoading,
    error: offersError,
    fetchOffers,
  } = useOffer();

  const isOfferExpired = (offer: UserOffer) =>
    new Date(offer.endDate).getTime() < Date.now();

  const isOfferNotStarted = (offer: UserOffer) =>
    new Date(offer.startDate).getTime() > Date.now();

  const getOfferEligibility = (offer: UserOffer) => {
    if (offer.status !== "ACTIVE") {
      return { available: false, reason: "Coupon is inactive" };
    }

    if (isOfferExpired(offer)) {
      return { available: false, reason: "This coupon has expired" };
    }

    if (isOfferNotStarted(offer)) {
      return { available: false, reason: "Coupon is not active yet" };
    }

    if (
      offer.usageLimit !== null &&
      offer.type === "DISCOUNT" &&
      offer.usageCount >= offer.usageLimit
    ) {
      return { available: false, reason: "Coupon usage limit reached" };
    }

    if (
      offer.minimumOrderValue !== null &&
      subtotal < offer.minimumOrderValue
    ) {
      return {
        available: false,
        reason: `Add ${formatPrice(
          offer.minimumOrderValue - subtotal
        )} more to use this coupon`,
      };
    }

    if (offer.type === "BOGO") {
      const buyProductIds = offer.buyProducts
        .map((mapping) => mapping.productId)
        .filter((id): id is number => id !== null);

      if (buyProductIds.length === 0) {
        return {
          available: false,
          reason: "No eligible Buy products configured",
        };
      }

      const eligibleQuantity = items.reduce((total, item) => {
        if (item.isFreeGift) return total;

        return buyProductIds.includes(Number(item.id))
          ? total + item.quantity
          : total;
      }, 0);

      if (eligibleQuantity < offer.buyQuantity) {
        return {
          available: false,
          reason: `Add eligible Buy products (quantity: ${offer.buyQuantity})`,
        };
      }
    }

    return { available: true, reason: "Coupon available" };
  };


const getEligibleGiftProducts = (offer: UserOffer) => {
  if (
    offer.type !== "BOGO" ||
    coupon?.type !== "BOGO" ||
    coupon.code !== offer.code
  ) {
    return [];
  }

  return (coupon.eligibleGiftProducts ?? [])
    .filter(
      (entry) => entry.product != null
    )
    .map((entry) => {
      const product = entry.product!;

      return {
        id: product.id,
        name: product.name,
        image:
          product.images?.find(
            (image) => image.is_primary
          )?.image_url ??
          product.images?.[0]?.image_url ??
          null,
        price: Number(product.price ?? 0),
        availableStock: Number(product.stock ?? 0),
      };
    });
};


  const handleOpenCoupons = () => {
    setIsCouponModalOpen(true);
    void fetchOffers();
  };

const handleApplyCoupon = async (offer: UserOffer) => {
  const eligibility = getOfferEligibility(offer);

  if (!eligibility.available) {
    toast.error(eligibility.reason);
    return;
  }

  const result = await applyCoupon(offer.code);

  if (result) {
    setSelectedCoupon(`${offer.type}:${offer.uuid}`);

    if (offer.type === "BOGO") {
      // Keep the modal open so the user can choose a free gift.
      setIsCouponModalOpen(true);
      toast.success("BOGO coupon applied. Choose your free gift below.");
    } else {
      // Discount coupons keep the existing behavior.
      setIsCouponModalOpen(false);
    }
  }
};

  const handleRemoveCoupon = async () => {
    const removed = await removeCoupon();

    if (removed) {
      setSelectedCoupon(null);
    }
  };

  const handleCheckout = () => {
    if (!isAuthReady) {
      toast.info("Please wait while we check your login.");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (items.length === 0) return;

    setIsCheckoutOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/45 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#EEE8E2] px-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5EDE5] text-[#6B3E1E]">
              <ShoppingBag size={18} strokeWidth={1.6} />
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-[-0.01em] text-[#29231F]">
                Your Basket
              </h2>

              <p className="mt-0.5 text-[10px] text-[#9A9088]">
                {!isBasketReady
                  ? "Loading basket..."
                  : `${totalItems} ${totalItems === 1 ? "item" : "items"}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close basket"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B3E1E] transition-colors duration-200 hover:bg-[#F8F5F0]"
          >
            <X size={19} strokeWidth={1.6} />
          </button>
        </div>

        {/* Basket Content */}

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-[#EEE8E2] bg-[#FCFAF7] px-5 py-4 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                  MARVE BASKET
                </p>

                <p className="mt-1 text-xs font-medium text-[#39312B]">
                  Your selected pieces are waiting for you.
                </p>
              </div>

              <ShoppingBag
                size={19}
                strokeWidth={1.4}
                className="shrink-0 text-[#C98A50]"
              />
            </div>
          </div>

          {/* Products */}

          <div className="space-y-3 px-5 py-5 sm:px-7 sm:py-6">
            {!isBasketReady ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex animate-pulse gap-3 rounded-xl border border-[#E8DED4] p-3"
                  >
                    <div className="h-[88px] w-[78px] shrink-0 rounded-lg bg-[#EDE7DF]" />

                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-3 w-2/3 rounded bg-[#EDE7DF]" />
                      <div className="h-3 w-1/2 rounded bg-[#EDE7DF]" />
                      <div className="h-4 w-1/3 rounded bg-[#EDE7DF]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EDE5] text-[#8B5A38]">
                  <ShoppingBag size={27} strokeWidth={1.4} />
                </div>

                <h3 className="mt-5 text-base font-semibold text-[#29231F]">
                  Your basket is empty
                </h3>

                <p className="mt-2 max-w-[250px] text-xs leading-5 text-[#8A7D72]">
                  Discover your favourite home and kitchen essentials and add them to your basket.
                </p>

                <Link
                  href="/common/products"
                  onClick={onClose}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#572F17]"
                >
                  Explore Products
                  <ArrowRight size={14} strokeWidth={1.7} />
                </Link>
              </div>
            ) : (
              items.map((product) => {
                const productHref = `/common/products/${product.slug}`;

                const hasOriginalPrice =
                  !product.isFreeGift &&
                  product.originalPrice !== null &&
                  Number.isFinite(product.originalPrice) &&
                  product.originalPrice > product.price;

                return (
                  <div
                    key={product.cartItemId}
                    className="rounded-xl border border-[#E8DED4] bg-white p-3 transition-colors duration-200 hover:border-[#D9C7B5]"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}

                      <Link
                        href={productHref}
                        onClick={onClose}
                        className="relative h-[88px] w-[78px] shrink-0 overflow-hidden rounded-lg bg-[#F3EEE8] sm:h-[96px] sm:w-[86px]"
                      >
                        {product.image?.trim() ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="86px"
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#EDE7DF]">
                            <ShoppingBag
                              size={24}
                              strokeWidth={1.4}
                              className="text-[#A09286]"
                            />
                          </div>
                        )}
                      </Link>

                      {/* Product Details */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[#A66A32]">
                              {product.category}
                            </p>

                            <Link
                              href={productHref}
                              onClick={onClose}
                            >
                              <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[#39312B] transition-colors hover:text-[#6B3E1E] sm:text-sm">
                                {product.name}
                              </h3>
                            </Link>

                            {product.isFreeGift && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#F0E8DA] px-2 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                                <Gift size={11} />
                                FREE GIFT
                              </span>
                            )}
                          </div>

                          {/* Remove Product */}

                          <button
                            type="button"
                            onClick={() => removeFromBasket(product.cartItemId)}
                            disabled={isRemoving || product.isFreeGift}
                            aria-label={`Remove ${product.name}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#A09286] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Price */}

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#29231F]">
                            {product.isFreeGift
                              ? "FREE"
                              : formatPrice(product.price)}
                          </span>

                          {hasOriginalPrice && (
                            <span className="text-[10px] text-[#A09286] line-through">
                              {formatPrice(product.originalPrice!)}
                            </span>
                          )}
                        </div>

                        {/* Quantity */}

                        <div className="mt-2.5 flex items-center justify-between">
                          {product.isFreeGift ? (
                            <span className="text-[10px] text-[#8A7D72]">
                              Coupon gift · Qty {product.quantity}
                            </span>
                          ) : (
                            <div className="flex h-8 items-center rounded-md border border-[#E2D8CF]">
                              <button
                                type="button"
                                onClick={() => decreaseQuantity(product.cartItemId)}
                                disabled={isUpdating || isRemoving}
                                aria-label={`Decrease quantity of ${product.name}`}
                                className="flex h-full w-8 items-center justify-center text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0] disabled:opacity-40"
                              >
                                <Minus size={13} strokeWidth={1.6} />
                              </button>

                              <span className="flex h-full min-w-7 items-center justify-center border-x border-[#E2D8CF] text-xs font-medium text-[#39312B]">
                                {product.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => increaseQuantity(product.cartItemId)}
                                disabled={
                                  isUpdating ||
                                  isRemoving ||
                                  product.quantity >= product.stock
                                }
                                aria-label={`Increase quantity of ${product.name}`}
                                className="flex h-full w-8 items-center justify-center text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Plus size={13} strokeWidth={1.6} />
                              </button>
                            </div>
                          )}

                          <span className="text-xs font-semibold text-[#39312B]">
                            {product.isFreeGift
                              ? "₹0"
                              : formatPrice(product.price * product.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Continue Shopping */}

          {isBasketReady && items.length > 0 && (
            <div className="px-5 pb-6 sm:px-7">
              <Link
                href="/common/products"
                onClick={onClose}
                className="group flex items-center justify-center gap-2 text-xs font-semibold text-[#6B3E1E]"
              >
                Continue Shopping
                <ArrowRight
                  size={14}
                  strokeWidth={1.6}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="shrink-0 border-t border-[#E8DED4] bg-white px-5 pb-5 pt-4 sm:px-7 sm:pb-7 sm:pt-5">
          {/* Applied Coupon */}

          {coupon && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-[#D8C5B2] bg-[#FCFAF7] px-3 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0E1D1] text-[#6B3E1E]">
                  {coupon.type === "BOGO" ? (
                    <Gift size={16} />
                  ) : (
                    <Tag size={16} />
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#39312B]">
                    {coupon.code}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                    {coupon.type === "BOGO"
                      ? coupon.giftSelectionRequired
                        ? "Choose your free gift"
                        : "BOGO offer applied"
                      : "Discount coupon applied"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleRemoveCoupon()}
                disabled={isRemovingCoupon}
                className="shrink-0 text-[10px] font-semibold text-[#6B3E1E] hover:underline disabled:opacity-50"
              >
                {isRemovingCoupon ? (
                  <LoaderCircle size={14} className="animate-spin" />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          )}

{/* Price Breakdown */}

<div className="rounded-xl border border-[#E8DED4] bg-[#FCFAF7] p-4">
  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3E1E]">
    Price Details
  </h3>

  <div className="space-y-3">
    {/* Original Subtotal */}
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-[#6F6258]">
        Original Subtotal
      </span>

      <span className="font-medium text-[#39312B]">
        {formatPrice(
          summary.originalSubtotal ??
            summary.subtotal + summary.productDiscount
        )}
      </span>
    </div>

    {/* Product Discount */}
    {summary.productDiscount > 0 && (
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-[#6F6258]">
          Product Discount
        </span>

        <span className="font-medium text-green-700">
          −{formatPrice(summary.productDiscount)}
        </span>
      </div>
    )}

    {/* Subtotal After Product Discount */}
    <div className="flex items-center justify-between gap-3 border-t border-[#E8DED4] pt-3 text-xs">
      <span className="font-medium text-[#39312B]">
        Subtotal After Product Discount
      </span>

      <span className="font-semibold text-[#39312B]">
        {formatPrice(summary.subtotal)}
      </span>
    </div>

    {/* Coupon Discount */}
    {summary.couponDiscount > 0 && (
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-[#6F6258]">
          Coupon Discount
          {coupon?.type === "DISCOUNT" ? " (Applied)" : ""}
        </span>

        <span className="font-medium text-green-700">
          −{formatPrice(summary.couponDiscount)}
        </span>
      </div>
    )}

    {/* Shipping */}
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-[#6F6258]">
        Shipping
      </span>

      <span
        className={`font-medium ${
          summary.shipping === 0
            ? "text-green-700"
            : "text-[#39312B]"
        }`}
      >
        {summary.shipping === 0
          ? "Free"
          : `+${formatPrice(summary.shipping)}`}
      </span>
    </div>

    {/* Final Payable */}
    <div className="flex items-center justify-between gap-3 border-t border-[#DCCDBF] pt-4">
      <div>
        <p className="text-sm font-semibold text-[#29231F]">
          Final Payable
        </p>

        <p className="mt-1 text-[10px] text-[#958477]">
          Discounts and shipping included
        </p>
      </div>

      <span className="text-lg font-bold text-[#6B3E1E]">
        {formatPrice(summary.payableTotal)}
      </span>
    </div>
  </div>
</div>

          {/* Coupons */}

          <button
            type="button"
            onClick={handleOpenCoupons}
            disabled={!isBasketReady || items.length === 0 || isApplyingCoupon}
            className="mt-3 flex w-full items-center justify-between rounded-lg border border-[#E5D5C5] bg-[#FCFAF7] px-3.5 py-3 text-left transition-colors hover:border-[#C99A70] hover:bg-[#F8F1E9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0E1D1] text-[#6B3E1E]">
                <TicketPercent size={17} strokeWidth={1.6} />
              </span>

              <span>
                <span className="block text-xs font-semibold text-[#39312B]">
                  {coupon ? "Change Coupon" : "View Coupons"}
                </span>
                <span className="mt-0.5 block text-[10px] text-[#958477]">
                  {coupon
                    ? "Apply another offer to replace this coupon"
                    : "Explore available offers for your basket"}
                </span>
              </span>
            </span>

            {isApplyingCoupon ? (
              <LoaderCircle
                size={16}
                className="animate-spin text-[#6B3E1E]"
              />
            ) : (
              <ArrowRight size={16} className="text-[#6B3E1E]" />
            )}
          </button>

       
  <p className="mt-2 text-[10px] leading-5 text-[#9A9088]">
    Final charges are based on current product prices, discounts
    and shipping. Amounts are verified again at checkout.
  </p>


          {/* Checkout */}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!isBasketReady || items.length === 0}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#572F17] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed to Checkout
            <ArrowRight size={15} strokeWidth={1.7} />
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-[#9A9088]">
            <span className="h-1 w-1 rounded-full bg-[#C98A50]" />
            Secure checkout · Easy returns
          </div>
        </div>
      </aside>

      {/* Checkout */}

{isCheckoutOpen && (
  <CheckoutAddress
    onClose={() => setIsCheckoutOpen(false)}
    payableTotal={summary.payableTotal}
    originalTotal={
      summary.originalSubtotal ??
      summary.subtotal + summary.productDiscount
    }
    productDiscount={summary.productDiscount}
    couponDiscount={summary.couponDiscount}
  />
)}

      {/* Coupon Modal */}

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        offers={offers}
        coupon={coupon}
        isLoading={isOffersLoading}
        error={offersError ? String(offersError) : null}
        subtotal={subtotal}
        basketItems={items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            isFreeGift: item.isFreeGift,
          }))}
          getEligibleGiftProducts={getEligibleGiftProducts}
onSelectGifts={async (offer, giftProductIds) => {
  if (offer.type !== "BOGO") return;

  const productId = Number(giftProductIds[0]);

  if (!Number.isFinite(productId) || productId <= 0) {
    toast.error("Please select an eligible free gift.");
    return;
  }

  const result = await selectBogoGift({
    productId,
  });

  if (result) {
    setIsCouponModalOpen(false);
  }
}}
isSelectingGifts={isSelectingBogoGift}
          isApplyingCoupon={isApplyingCoupon}
        selectedCoupon={selectedCoupon}
        onSelectCoupon={(offer) => {
          void handleApplyCoupon(offer);
        }}
        onRetry={() => void fetchOffers()}
      />
    </div>
  );
}