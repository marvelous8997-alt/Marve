"use client";

import {
  CheckCircle2,
  Clock3,
  Info,
  LoaderCircle,
  Tag,
} from "lucide-react";

import type { UserOffer } from "@/src/types/user/offer.types";

/* ========================= Props ========================= */

interface DiscountCouponSectionProps {
  offers: UserOffer[];
  isLoading: boolean;
  error: string | null;
  subtotal: number;
  selectedCoupon: string | null;
  onSelectCoupon: (offer: UserOffer) => void | Promise<void>;
  onRetry: () => void;
  isApplyingCoupon?: boolean;
}

/* ========================= Helpers ========================= */

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getDateKey = (value: string | null | undefined) => {
  if (!value) return null;

  const datePart = value.slice(0, 10);

  return /^\d{4}-\d{2}-\d{2}$/.test(datePart)
    ? datePart
    : null;
};

const getTodayDateKey = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

const isOfferExpired = (offer: UserOffer) => {
  const endDate = getDateKey(offer.endDate);

  return endDate !== null && endDate < getTodayDateKey();
};

const isOfferNotStarted = (offer: UserOffer) => {
  const startDate = getDateKey(offer.startDate);

  return startDate !== null && startDate > getTodayDateKey();
};

/* ========================= Component ========================= */

export default function DiscountCouponSection({
  offers,
  isLoading,
  error,
  subtotal,
  selectedCoupon,
  onSelectCoupon,
  onRetry,
  isApplyingCoupon = false,
}: DiscountCouponSectionProps) {
  // This section must only display discount coupons.
  const discountOffers = offers.filter(
    (offer) => offer.type === "DISCOUNT"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#6B3E1E]">
        <LoaderCircle size={18} className="animate-spin" />
        Loading discount coupons...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <Info
          className="mx-auto text-[#A66A32]"
          size={25}
        />

        <p className="mt-3 text-sm font-medium text-[#39312B]">
          Unable to load discount coupons
        </p>

        <p className="mt-1 text-xs text-[#958477]">
          Please try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-xs font-semibold text-[#6B3E1E] underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (discountOffers.length === 0) {
    return (
      <div className="py-10 text-center">
        <Tag
          size={28}
          className="mx-auto text-[#A09286]"
        />

        <p className="mt-3 text-sm font-medium text-[#39312B]">
          No discount coupons available
        </p>

        <p className="mt-1 text-xs text-[#958477]">
          Please check back later for new offers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {discountOffers.map((offer) => {
        const expired = isOfferExpired(offer);
        const notStarted = isOfferNotStarted(offer);

        const usageLimitReached =
          offer.usageLimit !== null &&
          offer.usageCount >= offer.usageLimit;

        const minimumOrderNotMet =
          offer.minimumOrderValue !== null &&
          subtotal < offer.minimumOrderValue;
          const available =
            offer.status === "ACTIVE" &&
            !expired &&
            !notStarted &&
            !usageLimitReached &&
            !minimumOrderNotMet;

        const couponKey = `${offer.type}:${offer.uuid}`;
        const selected = selectedCoupon === couponKey;

let reason = "Coupon available";

if (expired || offer.status === "EXPIRED") {
  reason = "This coupon has expired";
} else if (offer.status === "INACTIVE") {
  reason = "Coupon is inactive";
} else if (notStarted || offer.status === "SCHEDULED") {
  reason = "Coupon is not active yet";
} else if (usageLimitReached) {
  reason = "Coupon usage limit reached";
} else if (minimumOrderNotMet) {
  reason = `Add ${formatPrice(
    offer.minimumOrderValue! - subtotal
  )} more to use this coupon`;
}
        return (
          <article
            key={couponKey}
            className={`overflow-hidden rounded-xl border bg-white ${
              available
                ? "border-[#E5D5C5]"
                : "border-[#E8E2DC] opacity-80"
            }`}
          >
            <div className="flex gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F0E8DE] text-[#6B3E1E]">
                <Tag size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-dashed border-[#C7A98E] bg-[#FCF7F1] px-2 py-1 text-[11px] font-bold tracking-wide text-[#6B3E1E]">
                    {offer.code}
                  </span>

                  {selected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-700">
                      <CheckCircle2 size={11} />
                      Applied
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-sm font-semibold text-[#39312B]">
                  {offer.name}
                </h3>

                {offer.description && (
                  <p className="mt-1 text-xs leading-5 text-[#887A6E]">
                    {offer.description}
                  </p>
                )}

                <p className="mt-2 text-[11px] font-medium text-[#6B3E1E]">
                  {offer.discountType === "PERCENTAGE"
                    ? `${offer.discountValue}% discount`
                    : `${formatPrice(offer.discountValue)} discount`}
                </p>

                {offer.minimumOrderValue !== null &&
                  offer.minimumOrderValue > 0 && (
                    <p className="mt-1 text-[10px] text-[#958477]">
                      Minimum order:{" "}
                      {formatPrice(offer.minimumOrderValue)}
                    </p>
                  )}

                {offer.discountType === "PERCENTAGE" &&
                  offer.maximumDiscount !== null &&
                  offer.maximumDiscount > 0 && (
                    <p className="mt-1 text-[10px] text-[#958477]">
                      Maximum discount:{" "}
                      {formatPrice(offer.maximumDiscount)}
                    </p>
                  )}

                <div className="mt-2 flex items-start gap-1.5">
                  {available ? (
                    <CheckCircle2
                      size={13}
                      className="mt-0.5 shrink-0 text-green-700"
                    />
                  ) : (
                    <Info
                      size={13}
                      className="mt-0.5 shrink-0 text-[#A66A32]"
                    />
                  )}

                  <p
                    className={`text-[10px] leading-4 ${
                      available
                        ? "text-green-700"
                        : "text-[#92765E]"
                    }`}
                  >
                    {reason}
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#958477]">
                  <Clock3 size={12} />

                  {expired ? (
                    <span>Expired on {formatDate(offer.endDate)}</span>
                  ) : notStarted ? (
                    <span>Starts {formatDate(offer.startDate)}</span>
                  ) : (
                    <span>Ends {formatDate(offer.endDate)}</span>
                  )}
                </div>

                {offer.usageLimit !== null && (
                  <p className="mt-1 text-[10px] text-[#958477]">
                    Usage limit: {offer.usageLimit}
                    {" · "}
                    Used: {offer.usageCount}
                    {" · "}
                    Remaining:{" "}
                    {Math.max(
                      0,
                      offer.usageLimit - offer.usageCount
                    )}
                  </p>
                )}

                {offer.perCustomerLimit !== null && (
                  <p className="mt-1 text-[10px] text-[#958477]">
                    Limit per customer: {offer.perCustomerLimit}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[#F0E8E0] px-4 py-3">
              <span className="text-[10px] text-[#958477]">
{expired || offer.status === "EXPIRED"
  ? "EXPIRED"
  : offer.status === "INACTIVE"
    ? "INACTIVE"
    : notStarted || offer.status === "SCHEDULED"
      ? "SCHEDULED"
      : available
        ? "Ready to use"
        : "Unavailable"}
              </span>

              <button
                type="button"
                disabled={
                  !available ||
                  isApplyingCoupon ||
                  selected
                }
                onClick={() => {
                  void onSelectCoupon(offer);
                }}
                className="inline-flex min-w-[112px] items-center justify-center gap-1.5 rounded-lg bg-[#6B3E1E] px-4 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-[#572F17] disabled:cursor-not-allowed disabled:bg-[#D9D0C8] disabled:text-[#766C63]"
              >
{expired || offer.status === "EXPIRED" ? (
  "EXPIRED"
) : notStarted || offer.status === "SCHEDULED" ? (
  "SCHEDULED"
) : offer.status === "INACTIVE" ? (
  "INACTIVE"
) : isApplyingCoupon && selected ? (
  <>
    <LoaderCircle
      size={13}
      className="animate-spin"
    />
    Applying...
  </>
) : selected ? (
  "Applied"
) : (
  "Apply Coupon"
)}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}