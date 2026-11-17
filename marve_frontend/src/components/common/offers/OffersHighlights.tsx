"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  Percent,
  Sparkles,
  Tags,
} from "lucide-react";

import useOffer from "@/src/hooks/user/useOffer";
import type {
  UserOffer,
} from "@/src/types/user/offer.types";

/* ========================= Helpers ========================= */

const OFFER_IMAGE = "/assets/images/home/home_lifestyle.jpg";

const getOfferContent = (offer: UserOffer) => {
  if (offer.type === "DISCOUNT") {
    const title =
      offer.discountType === "PERCENTAGE"
        ? `${offer.discountValue}% Off`
        : `Save ₹${offer.discountValue}`;

    return {
      icon: Percent,
      eyebrow: "Special Discount",
      title,
      description:
        offer.description ||
        `Use code ${offer.code} to save on your MARVE purchase.`,
      cta: "Explore Offer",
    };
  }

  return {
    icon: Gift,
    eyebrow: "Buy More, Get More",
    title: `Buy ${offer.buyQuantity}, Get ${offer.getQuantity}`,
    description:
      offer.description ||
      `Enjoy this special offer with code ${offer.code} on eligible products.`,
    cta: "Explore Offer",
  };
};

/* ========================= Component ========================= */

export default function OffersHighlights() {
  const {
    offers,
    isLoading,
    error,
    refreshOffers,
  } = useOffer();

  const displayedOffers = offers.slice(0, 4);

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Header ========================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              What&apos;s On
            </p>

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[40px] md:leading-[1.12]">
              A little more value,
              <span className="text-[#6B3E1E]">
                {" "}
                every day.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#8A7D72] sm:text-right sm:text-[14px] sm:leading-6">
            Explore our current offers and discover simple ways to get more
            from the MARVE collection.
          </p>
        </div>

        {/* ========================= Loading State ========================= */}

        {isLoading && offers.length === 0 && (
          <div className="mt-9 grid grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[360px] animate-pulse rounded-3xl bg-[#E9DFD3] sm:min-h-[420px] lg:min-h-[470px]"
              />
            ))}
          </div>
        )}

        {/* ========================= Error State ========================= */}

        {!isLoading && error && offers.length === 0 && (
          <div className="mt-9 rounded-3xl border border-[#E5D7C8] bg-white/70 px-5 py-10 text-center sm:mt-11">
            <p className="text-sm text-[#6B3E1E]">
              Unable to load current offers.
            </p>

            <button
              type="button"
              onClick={() => void refreshOffers()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#4B2B16]"
            >
              Try Again
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ========================= Empty State ========================= */}

        {!isLoading && !error && offers.length === 0 && (
          <div className="mt-9 rounded-3xl border border-[#E5D7C8] bg-white/60 px-5 py-12 text-center sm:mt-11">
            <Sparkles
              size={28}
              strokeWidth={1.5}
              className="mx-auto text-[#A66A32]"
            />

            <h3 className="mt-4 text-lg font-semibold text-[#29231F]">
              No Offers Available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A7D72]">
              There are no active offers right now. Please check back soon for
              special MARVE deals.
            </p>
          </div>
        )}

        {/* ========================= Offer Grid ========================= */}

        {displayedOffers.length > 0 && (
          <div className="mt-9 grid grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {displayedOffers.map((offer, index) => {
              const content = getOfferContent(offer);
              const Icon = content.icon;

              const offerHref = `/offers/${offer.type.toLowerCase()}/${offer.uuid}`;

              return (
                <Link
                  key={`${offer.type}-${offer.uuid}`}
                  href={offerHref}
                  className="group relative min-h-[360px] overflow-hidden rounded-3xl sm:min-h-[420px] lg:min-h-[470px]"
                >
                  {/* Image */}

                  <Image
                    src={OFFER_IMAGE}
                    alt={offer.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Dark Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/90 via-[#2D1B12]/35 to-[#2D1B12]/10 transition-all duration-500 group-hover:from-[#2D1B12]/95 group-hover:via-[#2D1B12]/45" />

                  {/* Number */}

                  <span className="absolute right-5 top-5 text-[10px] font-medium tracking-[0.18em] text-white/55">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}

                  <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#C98A50] group-hover:text-white">
                    <Icon size={17} strokeWidth={1.6} />
                  </div>

                  {/* Content */}

                  <div className="absolute inset-x-5 bottom-5 sm:bottom-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E0B07D] sm:text-[10px]">
                      {content.eyebrow}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                      {content.title}
                    </h3>

                    <p className="mt-2.5 max-w-xs text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
                      {content.description}
                    </p>

                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E0B07D]">
                      Code: {offer.code}
                    </p>

                    {/* CTA */}

                    <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                      <span>{content.cta}</span>

                      <ArrowRight
                        size={14}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ========================= View All Offers ========================= */}

        {offers.length > 0 && (
          <div className="mt-7 flex justify-center">
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3E1E] transition hover:border-[#6B3E1E] hover:bg-[#6B3E1E] hover:text-white"
            >
              View All Offers
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* ========================= Bottom Note ========================= */}

        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center sm:mt-10 sm:flex-row sm:gap-3">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8A7D72] sm:text-xs">
            Offers may vary by product and availability
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}