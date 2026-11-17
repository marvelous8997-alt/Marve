
"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Tag,
  Copy,
  Check,
  Sparkles,
  Gift,
  Percent,
  ArrowRight,
  Mail,
  Clock3,
  Info,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import type { UserOffer } from "@/src/types/user/offer.types";

/* ========================= Props ========================= */

interface MyOffersProps {
  offers: UserOffer[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;

  offersOptIn?: boolean;
  onOffersOptInChange?: (enabled: boolean) => void;
  onApplyOffer?: (offer: UserOffer) => void | Promise<void>;
}

/* ========================= Helpers ========================= */

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string | null | undefined) {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not specified";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDateKey(value: string | null | undefined) {
  if (!value) return null;

  const datePart = value.slice(0, 10);

  return /^\d{4}-\d{2}-\d{2}$/.test(datePart)
    ? datePart
    : null;
}

function getTodayDateKey() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function isOfferExpired(offer: UserOffer) {
  const endDate = getDateKey(offer.endDate);

  return endDate !== null && endDate < getTodayDateKey();
}

function isOfferNotStarted(offer: UserOffer) {
  const startDate = getDateKey(offer.startDate);

  return startDate !== null && startDate > getTodayDateKey();
}

function getOfferIcon(type: UserOffer["type"]) {
  return type === "BOGO" ? Gift : Percent;
}

function getDiscountLabel(offer: UserOffer) {
  if (offer.type === "BOGO") {
    return `BUY ${offer.buyQuantity} GET ${offer.getQuantity}`;
  }

  return offer.discountType === "PERCENTAGE"
    ? `${offer.discountValue}% OFF`
    : `${formatPrice(offer.discountValue)} OFF`;
}

/* ========================= Component ========================= */

export default function MyOffers({
  offers,
  isLoading = false,
  error = null,
  onRetry,
  offersOptIn = false,
  onOffersOptInChange,
  onApplyOffer,
}: MyOffersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [updatesEnabled, setUpdatesEnabled] = useState(offersOptIn);

  useEffect(() => {
    setUpdatesEnabled(offersOptIn);
  }, [offersOptIn]);

  const activeOffers = offers.filter(
    (offer) => offer.type === "DISCOUNT" || offer.type === "BOGO"
  );

  const discountCount = activeOffers.filter(
    (offer) => offer.type === "DISCOUNT"
  ).length;

  const bogoCount = activeOffers.filter(
    (offer) => offer.type === "BOGO"
  ).length;

  const handleCopyCode = async (code: string) => {
    try {
      if (!navigator.clipboard?.writeText) return;

      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      window.setTimeout(() => {
        setCopiedCode((current) =>
          current === code ? null : current
        );
      }, 2000);
    } catch {
      setCopiedCode(null);
    }
  };

  const handleUpdatesChange = (enabled: boolean) => {
    setUpdatesEnabled(enabled);
    onOffersOptInChange?.(enabled);
  };

  const getOfferAvailability = (offer: UserOffer) => {
    const expired = isOfferExpired(offer);
    const notStarted = isOfferNotStarted(offer);

    const usageLimitReached =
      offer.usageLimit !== null &&
      offer.usageCount >= offer.usageLimit;

    if (expired || offer.status === "EXPIRED") {
      return {
        available: false,
        label: "EXPIRED",
        reason: "This offer has expired",
      };
    }

    if (offer.status === "INACTIVE") {
      return {
        available: false,
        label: "INACTIVE",
        reason: "This offer is currently inactive",
      };
    }

    if (notStarted || offer.status === "SCHEDULED") {
      return {
        available: false,
        label: "SCHEDULED",
        reason: "This offer is not active yet",
      };
    }

    if (usageLimitReached) {
      return {
        available: false,
        label: "LIMIT REACHED",
        reason: "Offer usage limit reached",
      };
    }

    if (offer.status !== "ACTIVE") {
      return {
        available: false,
        label: "UNAVAILABLE",
        reason: "This offer is currently unavailable",
      };
    }

    return {
      available: true,
      label: "AVAILABLE",
      reason: "This offer is ready to use",
    };
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EAE3DC] bg-white">
      {/* Header */}

      <div className="flex items-start justify-between gap-4 border-b border-[#EEE8E2] px-5 py-5 sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
            Rewards & savings
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#39312B]">
            Offers & Updates
          </h2>

          <p className="mt-1 text-sm text-[#8A7D72]">
            Discover exclusive offers and save on your next purchase.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5EADF] text-[#6B3E1E]">
          <Gift size={22} strokeWidth={1.7} />
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Featured banner */}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6B3E1E] to-[#A66A32] p-5 text-white sm:p-7">
          <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/15" />
          <div className="pointer-events-none absolute -bottom-12 right-12 h-32 w-32 rounded-full border border-white/10" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Sparkles size={24} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                A little extra for you
              </p>

              <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
                Good things come with savings.
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
                Explore discount coupons and exclusive Buy & Get offers
                on your favourite home and kitchen essentials.
              </p>
            </div>
          </div>
        </div>

        {/* Offer count */}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[#39312B]">
              Available Offers
            </h3>

            <p className="mt-1 text-xs text-[#8A7D72]">
              Check the terms before applying a coupon.
            </p>
          </div>

          <span className="rounded-full bg-[#F5EADF] px-3 py-1.5 text-xs font-semibold text-[#6B3E1E]">
            {activeOffers.length}{" "}
            {activeOffers.length === 1 ? "offer" : "offers"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5 text-[10px] font-semibold text-[#6B3E1E]">
            {discountCount} Discount Coupons
          </span>

          <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5 text-[10px] font-semibold text-[#6B3E1E]">
            {bogoCount} BOGO Coupons
          </span>
        </div>

        {/* Loading */}

        {isLoading ? (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#EEE8E2] py-12 text-sm text-[#6B3E1E]">
            <LoaderCircle size={19} className="animate-spin" />
            Loading offers...
          </div>
        ) : error ? (
          /* Error */

          <div className="mt-5 rounded-xl border border-dashed border-[#DCCBBC] px-5 py-10 text-center">
            <Info
              size={28}
              className="mx-auto text-[#A66A32]"
            />

            <h3 className="mt-3 text-base font-semibold text-[#39312B]">
              Unable to load offers
            </h3>

            <p className="mt-2 text-sm text-[#8A7D72]">
              {error}
            </p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 text-xs font-semibold text-[#6B3E1E] underline"
              >
                Try again
              </button>
            )}
          </div>
        ) : activeOffers.length > 0 ? (
          /* Offers list */

          <div className="mt-5 space-y-4">
            {activeOffers.map((offer) => {
              const Icon = getOfferIcon(offer.type);
              const isCopied = copiedCode === offer.code;
              const availability = getOfferAvailability(offer);

              return (
                <article
                  key={`${offer.type}:${offer.uuid}`}
                  className="overflow-hidden rounded-xl border border-[#EEE8E2] transition hover:border-[#D9C4B0]"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Discount panel */}

                    <div className="flex min-h-28 items-center justify-center gap-3 bg-[#F8F5F0] px-5 py-5 sm:w-40 sm:flex-col sm:gap-2 sm:border-r sm:border-dashed sm:border-[#DCCBBC]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#A66A32] shadow-sm">
                        <Icon size={21} strokeWidth={1.7} />
                      </div>

                      <p className="text-lg font-bold text-[#6B3E1E] sm:text-center">
                        {getDiscountLabel(offer)}
                      </p>
                    </div>

                    {/* Offer information */}

                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded border border-dashed border-[#CBB49D] bg-[#FDFBF8] px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-[#6B3E1E]">
                          {offer.code}
                        </span>

                        <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                          offer.type === "BOGO"
                            ? "bg-[#F7EBDD] text-[#8A4F21]"
                            : "bg-[#F0E8DE] text-[#6B3E1E]"
                        }`}>
                          {offer.type === "BOGO" ? "BUY & GET" : "DISCOUNT"}
                        </span>

                        {availability.available && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-700">
                            <CheckCircle2 size={11} />
                            Active
                          </span>
                        )}
                      </div>

                      <h4 className="mt-3 text-sm font-semibold text-[#39312B]">
                        {offer.name}
                      </h4>

                      {offer.description && (
                        <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                          {offer.description}
                        </p>
                      )}

                      {offer.type === "DISCOUNT" && (
                        <>
                          {offer.minimumOrderValue !== null &&
                            offer.minimumOrderValue > 0 && (
                              <p className="mt-2 text-xs text-[#665B53]">
                                Minimum order:{" "}
                                <span className="font-medium text-[#39312B]">
                                  {formatPrice(offer.minimumOrderValue)}
                                </span>
                              </p>
                            )}

                          {offer.discountType === "PERCENTAGE" &&
                            offer.maximumDiscount !== null &&
                            offer.maximumDiscount > 0 && (
                              <p className="mt-1 text-xs text-[#665B53]">
                                Maximum discount:{" "}
                                <span className="font-medium text-[#39312B]">
                                  {formatPrice(offer.maximumDiscount)}
                                </span>
                              </p>
                            )}
                        </>
                      )}

                      {offer.type === "BOGO" && (
                        <p className="mt-2 text-xs font-medium text-[#6B3E1E]">
                          Buy {offer.buyQuantity}, Get {offer.getQuantity}
                        </p>
                      )}

                      <div className="mt-3 flex items-start gap-1.5">
                        {availability.available ? (
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

                        <p className={`text-[10px] leading-4 ${
                          availability.available
                            ? "text-green-700"
                            : "text-[#92765E]"
                        }`}>
                          {availability.reason}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-[#958477]">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={12} />
                          Starts: {formatDate(offer.startDate)}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={12} />
                          Ends: {formatDate(offer.endDate)}
                        </span>
                      </div>

                      {offer.usageLimit !== null && (
                        <p className="mt-2 text-[10px] text-[#958477]">
                          Usage: {offer.usageCount} / {offer.usageLimit}
                        </p>
                      )}

                      {/* Coupon code actions */}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleCopyCode(offer.code)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE3DC] px-3 py-2 text-xs font-medium text-[#6B3E1E] transition hover:bg-[#F8F5F0]"
                        >
                          {isCopied ? (
                            <>
                              <Check size={14} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy Code
                            </>
                          )}
                        </button>

                        {onApplyOffer && (
                          <button
                            type="button"
                            disabled={!availability.available}
                            onClick={() => {
                              void onApplyOffer(offer);
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#6B3E1E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#572F17] disabled:cursor-not-allowed disabled:bg-[#D9D0C8] disabled:text-[#766C63]"
                          >
                            Apply Offer
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>

                      {!availability.available && (
                        <p className="mt-3 text-[9px] font-semibold tracking-wide text-[#A66A32]">
                          {availability.label}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty state */

          <div className="mt-5 rounded-xl border border-dashed border-[#DCCBBC] px-5 py-10 text-center">
            <Tag
              size={28}
              className="mx-auto text-[#A66A32]"
              strokeWidth={1.5}
            />

            <h3 className="mt-3 text-base font-semibold text-[#39312B]">
              No offers available right now
            </h3>

            <p className="mt-2 text-sm text-[#8A7D72]">
              Please check again later for new offers.
            </p>
          </div>
        )}

        {/* Email preferences */}

        <div className="mt-7 rounded-xl border border-[#EEE8E2] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EADF] text-[#6B3E1E]">
              <Mail size={19} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-[#39312B]">
                Stay in the loop
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                Receive emails about new collections, special offers and
                product updates from MARVE.
              </p>

              <label className="mt-4 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={updatesEnabled}
                  onChange={(event) =>
                    handleUpdatesChange(event.target.checked)
                  }
                  className="h-4 w-4 accent-[#6B3E1E]"
                />

                <span className="text-sm text-[#665B53]">
                  I would like to receive promotional emails.
                </span>
              </label>
            </div>

            <Bell
              size={18}
              className="hidden shrink-0 text-[#A66A32] sm:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
