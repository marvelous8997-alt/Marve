"use client";

import { useEffect, useState } from "react";
import {
  Gift,
  TicketPercent,
  Tag,
  X,
} from "lucide-react";

import type { UserOffer } from "@/src/types/user/offer.types";
import type { AppliedCartCoupon } from "@/src/types/user/cart.types";
import DiscountCouponSection from "@/src/components/common/coupon/DiscountCouponSection";
import BogoCouponSection from "@/src/components/common/coupon/BogoCouponSection";

/* ========================= Types ========================= */

interface BasketCouponItem {
  id: number | string;
  quantity: number;
  isFreeGift?: boolean;
}

interface BogoGiftProduct {
  id: number | string;
  name: string;
  image?: string | null;
  price: number;
  availableStock?: number;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;

  offers: UserOffer[];
  isLoading: boolean;
  error: string | null;

  subtotal: number;
  basketItems: BasketCouponItem[];

  selectedCoupon: string | null;

  onSelectCoupon: (
    offer: UserOffer
  ) => void | Promise<void>;

  onRetry: () => void;
coupon: AppliedCartCoupon | null;
  isApplyingCoupon?: boolean;

  /* BOGO gift selection */

  getEligibleGiftProducts?: (
    offer: UserOffer
  ) => BogoGiftProduct[];

  onSelectGifts?: (
    offer: UserOffer,
    giftProductIds: (number | string)[]
  ) => void | Promise<void>;

  isSelectingGifts?: boolean;
}

/* ========================= Tab Types ========================= */

type CouponTab = "DISCOUNT" | "BOGO";

/* ========================= Component ========================= */

export default function CouponModal({
  isOpen,
  onClose,
  offers,
  isLoading,
  error,
  subtotal,
  basketItems,
  selectedCoupon,
  onSelectCoupon,
  onRetry,
  coupon,
  isApplyingCoupon = false,
  getEligibleGiftProducts,
  onSelectGifts,
  isSelectingGifts = false,
}: CouponModalProps) {
  const [activeTab, setActiveTab] =
    useState<CouponTab>("DISCOUNT");

  const discountCount = offers.filter(
    (offer) => offer.type === "DISCOUNT"
  ).length;

  const bogoCount = offers.filter(
    (offer) => offer.type === "BOGO"
  ).length;

  /* Reset to the default tab when opening the modal. */

useEffect(() => {
  if (!isOpen) return;

  if (coupon?.type === "BOGO") {
    setActiveTab("BOGO");
  } else {
    setActiveTab("DISCOUNT");
  }
}, [isOpen, coupon?.type, coupon?.code]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isApplyingCoupon &&
          !isSelectingGifts
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-modal-title"
        className="flex max-h-[85vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* ========================= Header ========================= */}

        <header className="flex items-center justify-between border-b border-[#EEE8E2] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EDE5] text-[#6B3E1E]">
              <TicketPercent size={20} />
            </div>

            <div>
              <h2
                id="coupon-modal-title"
                className="text-base font-semibold text-[#29231F]"
              >
                Available Coupons
              </h2>

              <p className="mt-0.5 text-[11px] text-[#9A9088]">
                Find an offer for your basket
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isApplyingCoupon || isSelectingGifts}
            aria-label="Close coupons"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B3E1E] hover:bg-[#F8F5F0] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </header>

        {/* ========================= Tabs ========================= */}

        <div
          role="tablist"
          aria-label="Coupon categories"
          className="grid grid-cols-2 gap-2 border-b border-[#EEE8E2] bg-white px-4 pt-3"
        >
          <button
            id="discount-coupons-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "DISCOUNT"}
            aria-controls="discount-coupons-panel"
            onClick={() => setActiveTab("DISCOUNT")}
            className={`flex items-center justify-center gap-2 rounded-t-lg border-b-2 px-3 py-3 text-xs font-semibold transition-colors ${
              activeTab === "DISCOUNT"
                ? "border-[#6B3E1E] bg-[#FCF7F1] text-[#6B3E1E]"
                : "border-transparent text-[#958477] hover:bg-[#FCFAF7] hover:text-[#6B3E1E]"
            }`}
          >
            <Tag size={15} />

            <span>Discount Coupons</span>

            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                activeTab === "DISCOUNT"
                  ? "bg-[#6B3E1E] text-white"
                  : "bg-[#F0E8DE] text-[#6B3E1E]"
              }`}
            >
              {discountCount}
            </span>
          </button>

          <button
            id="bogo-coupons-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "BOGO"}
            aria-controls="bogo-coupons-panel"
            onClick={() => setActiveTab("BOGO")}
            className={`flex items-center justify-center gap-2 rounded-t-lg border-b-2 px-3 py-3 text-xs font-semibold transition-colors ${
              activeTab === "BOGO"
                ? "border-[#6B3E1E] bg-[#FCF7F1] text-[#6B3E1E]"
                : "border-transparent text-[#958477] hover:bg-[#FCFAF7] hover:text-[#6B3E1E]"
            }`}
          >
            <Gift size={15} />

            <span>BOGO Coupons</span>

            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                activeTab === "BOGO"
                  ? "bg-[#6B3E1E] text-white"
                  : "bg-[#F0E8DE] text-[#6B3E1E]"
              }`}
            >
              {bogoCount}
            </span>
          </button>
        </div>

        {/* ========================= Coupon Content ========================= */}

        <div className="flex-1 overflow-y-auto bg-[#FCFAF7] p-4 sm:p-5">
          {activeTab === "DISCOUNT" ? (
            <div
              id="discount-coupons-panel"
              role="tabpanel"
              aria-labelledby="discount-coupons-tab"
            >
              <DiscountCouponSection
                offers={offers}
                isLoading={isLoading}
                error={error}
                subtotal={subtotal}
                selectedCoupon={selectedCoupon}
                onSelectCoupon={onSelectCoupon}
                onRetry={onRetry}
                isApplyingCoupon={isApplyingCoupon}
              />
            </div>
          ) : (
            <div
              id="bogo-coupons-panel"
              role="tabpanel"
              aria-labelledby="bogo-coupons-tab"
            >
              <BogoCouponSection
                offers={offers}
                coupon={coupon}
                isLoading={isLoading}
                error={error}
                basketItems={basketItems}
                selectedCoupon={selectedCoupon}
                onSelectCoupon={onSelectCoupon}
                onRetry={onRetry}
                isApplyingCoupon={isApplyingCoupon}
                getEligibleGiftProducts={getEligibleGiftProducts}
                onSelectGifts={onSelectGifts}
                isSelectingGifts={isSelectingGifts}
              />
            </div>
          )}
        </div>

        {/* ========================= Footer ========================= */}

        <footer className="border-t border-[#EEE8E2] bg-white p-4">
          <p className="text-[10px] leading-4 text-[#958477]">
            Coupons are validated by MARVE before being applied
            to your basket. Only one coupon can be active at a
            time.
          </p>

          <button
            type="button"
            onClick={onClose}
            disabled={isApplyingCoupon || isSelectingGifts}
            className="mt-3 h-11 w-full rounded-lg bg-[#6B3E1E] text-xs font-semibold text-white hover:bg-[#572F17] disabled:opacity-50"
          >
            Done
          </button>
        </footer>
      </section>
    </div>
  );
}