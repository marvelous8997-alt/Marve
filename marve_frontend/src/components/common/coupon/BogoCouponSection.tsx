"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Gift,
  Info,
  LoaderCircle,
} from "lucide-react";

import type { UserOffer } from "@/src/types/user/offer.types";
import type { AppliedCartCoupon } from "@/src/types/user/cart.types";
/* ========================= Types ========================= */

interface BogoBasketItem {
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

interface BogoCouponSectionProps {
  offers: UserOffer[];
  coupon: AppliedCartCoupon | null;
  isLoading: boolean;
  error: string | null;
  basketItems: BogoBasketItem[];
  selectedCoupon: string | null;
  onSelectCoupon: (offer: UserOffer) => void | Promise<void>;
  onRetry: () => void;
  isApplyingCoupon?: boolean;

  /**
   * Eligible gift products should come from the backend.
   * Do not use all catalogue products as eligible gifts.
   */
  getEligibleGiftProducts?: (
    offer: UserOffer
  ) => BogoGiftProduct[];

  /**
   * The parent should submit the selected gift IDs to the backend.
   * Backend must validate eligibility and add gifts at effective price 0.
   */
  onSelectGifts?: (
    offer: UserOffer,
    giftProductIds: (number | string)[]
  ) => void | Promise<void>;

  isSelectingGifts?: boolean;
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

export default function BogoCouponSection({
  offers,
  coupon,
  isLoading,
  error,
  basketItems,
  selectedCoupon,
  onSelectCoupon,
  onRetry,
  isApplyingCoupon = false,
  getEligibleGiftProducts,
  onSelectGifts,
  isSelectingGifts = false,
}: BogoCouponSectionProps) {
  const [activeGiftOffer, setActiveGiftOffer] =
    useState<string | null>(null);

const [selectedGifts, setSelectedGifts] = useState<
  Record<string, number | string | null>
>({});

  const bogoOffers = useMemo(
    () => offers.filter((offer) => offer.type === "BOGO"),
    [offers]
  );

  useEffect(() => {
  if (coupon?.type !== "BOGO") return;

  const appliedOffer = bogoOffers.find(
    (offer) => offer.code === coupon.code
  );

  if (appliedOffer) {
    setActiveGiftOffer(
      `${appliedOffer.type}:${appliedOffer.uuid}`
    );
  }
}, [coupon, bogoOffers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#6B3E1E]">
        <LoaderCircle size={18} className="animate-spin" />
        Loading BOGO offers...
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
          Unable to load BOGO offers
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

  if (bogoOffers.length === 0) {
    return (
      <div className="py-10 text-center">
        <Gift
          size={28}
          className="mx-auto text-[#A09286]"
        />

        <p className="mt-3 text-sm font-medium text-[#39312B]">
          No BOGO offers available
        </p>

        <p className="mt-1 text-xs text-[#958477]">
          Please check back later for Buy &amp; Get offers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bogoOffers.map((offer) => {
        const couponKey = `${offer.type}:${offer.uuid}`;
        const selected = selectedCoupon === couponKey;

        const expired = isOfferExpired(offer);
        const notStarted = isOfferNotStarted(offer);

        const usageLimitReached =
          offer.usageLimit !== null &&
          offer.usageCount >= offer.usageLimit;

        const buyProductIds = offer.buyProducts
          .map((mapping) => mapping.productId)
          .filter((id): id is number => id !== null)
          .map(Number);

        const eligibleBuyQuantity = basketItems.reduce(
          (total, item) => {
            if (item.isFreeGift) return total;

            return buyProductIds.includes(Number(item.id))
              ? total + item.quantity
              : total;
          },
          0
        );

        const hasEligibleBuyProducts =
          buyProductIds.length > 0 &&
          eligibleBuyQuantity >= offer.buyQuantity;

        const available =
          offer.status === "ACTIVE" &&
          !expired &&
          !notStarted &&
          !usageLimitReached &&
          hasEligibleBuyProducts;

const giftProducts = getEligibleGiftProducts?.(offer) ?? [];

const currentSelectedGift = selectedGifts[couponKey] ?? null;

const hasSelectedGift = currentSelectedGift !== null;

const isAppliedBogo =
  selected &&
  coupon?.type === "BOGO" &&
  coupon.code === offer.code;

const showGiftSelection =
  (activeGiftOffer === couponKey || isAppliedBogo) &&
  (available || isAppliedBogo);

let reason = "Add eligible Buy products to unlock this offer";

if (expired || offer.status === "EXPIRED") {
  reason = "This offer has expired";
} else if (offer.status === "INACTIVE") {
  reason = "This offer is inactive";
} else if (notStarted || offer.status === "SCHEDULED") {
  reason = "This offer is not active yet";
} else if (usageLimitReached) {
  reason = "Offer usage limit reached";
} else if (!hasEligibleBuyProducts) {
  reason = `Add eligible Buy products. Required quantity: ${offer.buyQuantity}`;
} else if (giftProducts.length === 0) {
  reason = "No eligible gift products are currently available";
} else {
  reason = "You are eligible for this offer";
}

        const canChooseGifts =
          available &&
          giftProducts.length > 0 &&
          Boolean(onSelectGifts);

        return (
          <article
            key={couponKey}
            className={`overflow-hidden rounded-xl border bg-white ${
              available
                ? "border-[#E5D5C5]"
                : "border-[#E8E2DC] opacity-80"
            }`}
          >
            {/* Offer details */}

            <div className="flex gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F7EBDD] text-[#8A4F21]">
                <Gift size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-dashed border-[#C7A98E] bg-[#FCF7F1] px-2 py-1 text-[11px] font-bold tracking-wide text-[#6B3E1E]">
                    {offer.code}
                  </span>

                  <span className="rounded-full bg-[#F7EBDD] px-2 py-1 text-[9px] font-semibold text-[#8A4F21]">
                    BUY &amp; GET
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

                <p className="mt-2 text-[11px] font-semibold text-[#6B3E1E]">
                  Buy {offer.buyQuantity}, Get {offer.getQuantity}
                </p>

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

                {hasEligibleBuyProducts && (
                  <p className="mt-1 text-[10px] text-[#958477]">
                    Eligible Buy quantity in basket:{" "}
                    {eligibleBuyQuantity}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#958477]">
                  <Clock3 size={12} />

                  {expired ? (
                    <span>
                      Expired on {formatDate(offer.endDate)}
                    </span>
                  ) : notStarted ? (
                    <span>
                      Starts {formatDate(offer.startDate)}
                    </span>
                  ) : (
                    <span>
                      Ends {formatDate(offer.endDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Gift selection */}

            {showGiftSelection && (
              <div className="border-t border-[#F0E8E0] bg-[#FCFAF7] p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-[#39312B]">
                    Choose your free gift
                  </h4>

                  <p className="mt-1 text-[11px] text-[#887A6E]">
  Select one eligible gift. The gift price will be ₹0
  after backend validation.
</p>
                </div>

                {giftProducts.length === 0 ? (
                  <p className="rounded-lg border border-[#E8E2DC] bg-white p-3 text-xs text-[#887A6E]">
                    No eligible gifts are available for this
                    offer right now.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {giftProducts.map((product) => {
                  const isGiftSelected =
  String(currentSelectedGift) === String(product.id);

const stockUnavailable =
  product.availableStock !== undefined &&
  product.availableStock < 1;

                      return (
                        <label
                          key={String(product.id)}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 ${
                            isGiftSelected
                              ? "border-[#6B3E1E] bg-[#FCF7F1]"
                              : "border-[#E8E2DC]"
                          } ${
  stockUnavailable
    ? "cursor-not-allowed opacity-60"
    : ""
}`}
                        >
<input
  type="radio"
  name={`bogo-gift-${couponKey}`}
  checked={isGiftSelected}
  disabled={stockUnavailable || isSelectingGifts}
  onChange={() => {
    setSelectedGifts((previous) => ({
      ...previous,
      [couponKey]: product.id,
    }));
  }}
  className="h-4 w-4 accent-[#6B3E1E]"
/>

                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 rounded-md border border-[#EEE8E2] object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F5EDE5] text-[#8A4F21]">
                              <Gift size={20} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-[#39312B]">
                              {product.name}
                            </p>

                            <p className="mt-1 text-[10px] text-[#958477]">
                              Original price:{" "}
                              {formatPrice(product.price)}
                            </p>

                            {stockUnavailable && (
                              <p className="mt-1 text-[10px] text-red-600">
                                Out of stock
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-semibold text-green-700">
                              ₹0
                            </p>

                            <p className="text-[9px] text-[#958477]">
                              Free gift
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                <p className="mt-3 text-[10px] text-[#887A6E]">
                  Original product prices remain unchanged.
                  MARVE will validate the selected gifts before
                  adding them to your basket.
                </p>

<button
  type="button"
  disabled={
    !hasSelectedGift ||
    isSelectingGifts ||
    giftProducts.length === 0
  }
  onClick={() => {
    if (!onSelectGifts || currentSelectedGift === null) return;

    void onSelectGifts(offer, [currentSelectedGift]);
  }}
  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-4 text-xs font-semibold text-white hover:bg-[#572F17] disabled:cursor-not-allowed disabled:bg-[#D9D0C8] disabled:text-[#766C63]"
>
  {isSelectingGifts ? (
    <>
      <LoaderCircle size={14} className="animate-spin" />
      Adding gift...
    </>
  ) : (
    "Confirm Free Gift Selection"
  )}
</button>
              </div>
            )}

            {/* Offer actions */}

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
  "Apply Offer"
)}
              </button>
            </div>

            {available && !selected && (
              <div className="px-4 pb-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveGiftOffer((current) =>
                      current === couponKey ? null : couponKey
                    )
                  }
                  className="text-[11px] font-semibold text-[#6B3E1E] underline"
                >
                  {showGiftSelection
                    ? "Hide gift selection"
                    : "Choose free gift"}
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}