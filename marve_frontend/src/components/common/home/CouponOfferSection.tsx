"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";

import useHomeCouponBanner from "@/src/hooks/user/useHomeCouponBanner";

/* =========================
   Component
========================= */

export default function CouponOfferSection() {
  const [copied, setCopied] = useState(false);
  const {
    banner,
    isLoading,
    error,
    refreshHomeCouponBanner,
  } = useHomeCouponBanner();

  /* =========================
     Copy Coupon Code
  ========================= */

  const handleCopyCoupon = async () => {
    if (!banner?.coupon_code) return;

    try {
      await navigator.clipboard.writeText(banner.coupon_code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  /* =========================
     Loading State
  ========================= */

  if (isLoading && !banner) {
    return (
      <section
        className="w-full bg-white py-14 sm:py-20 lg:py-24"
        aria-label="Loading coupon offer"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[420px] animate-pulse grid-cols-1 overflow-hidden rounded-3xl bg-[#EDE0D1] lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-5 px-6 py-12 sm:px-10 lg:px-16">
              <div className="h-3 w-40 rounded bg-[#C9AD91]/60" />
              <div className="h-10 max-w-sm rounded bg-[#C9AD91]/60" />
              <div className="h-4 max-w-md rounded bg-[#C9AD91]/50" />
              <div className="h-4 max-w-xs rounded bg-[#C9AD91]/50" />
              <div className="h-12 w-48 rounded-lg bg-[#C9AD91]/60" />
              <div className="h-12 w-52 rounded-full bg-[#C9AD91]/60" />
            </div>

            <div className="min-h-[300px] bg-[#D8C4AE]/50 sm:min-h-[380px]" />
          </div>
        </div>
      </section>
    );
  }

  /* =========================
     Error State
  ========================= */

  if (error && !banner) {
    return (
      <section className="w-full bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#6B3E1E]/10 bg-[#F8F5F0] px-6 py-12 text-center">
            <p className="text-sm text-[#725A46]">
              We couldn&apos;t load this offer right now.
            </p>

            <button
              type="button"
              onClick={() => void refreshHomeCouponBanner()}
              className="mt-4 rounded-full bg-[#6B3E1E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4B2E1B]"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* =========================
     No Active Banner
  ========================= */

  if (!banner || banner.status !== "ACTIVE") {
    return null;
  }

  const discountValue = Number(banner.discount_value);
  const discountLabel =
    banner.discount_type === "PERCENTAGE"
      ? `${discountValue}%`
      : `₹${discountValue}`;

  const imageSrc = banner.image || "/assets/images/home/home_lifestyle.jpg";
  const buttonText = banner.button_text?.trim() || "Shop the collection";
  const buttonLink = banner.button_link?.trim() || "/products";

  return (
    <section className="w-full bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#EDE0D1]">
          <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-2">
            {/* =========================
                Offer Content
            ========================= */}

            <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              {/* Decorative Circle */}

              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border border-[#C59A70]/30" />

              {banner.eyebrow && (
                <p className="relative mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#8B5A38]">
                  {banner.eyebrow}
                </p>
              )}

              <h2 className="relative max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#4B2E1B] sm:text-4xl lg:text-[46px]">
                {banner.heading}

                {banner.highlighted_heading && (
                  <>
                    {" "}
                    <span className="font-normal italic">
                      {banner.highlighted_heading}
                    </span>
                  </>
                )}
              </h2>

              {banner.description && (
                <p className="relative mt-5 max-w-sm text-sm leading-6 text-[#725A46] sm:text-base">
                  {banner.description}
                </p>
              )}

              {/* =========================
                  Offer Details
              ========================= */}

              <div className="relative mt-7">
                {banner.offer_text && (
                  <p className="text-sm font-medium text-[#725A46]">
                    {banner.offer_text}
                  </p>
                )}

                {/* Coupon Code */}

                {banner.coupon_code && (
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="mt-4 inline-flex items-center gap-3 rounded-lg border border-dashed border-[#9B7657] bg-white/60 px-4 py-3 transition-colors hover:bg-white"
                    aria-label={`Copy coupon code ${banner.coupon_code}`}
                  >
                    <span className="text-sm font-bold tracking-[0.16em] text-[#5A3218]">
                      {banner.coupon_code}
                    </span>

                    <span className="h-5 w-px bg-[#C9AD91]" />

                    {copied ? (
                      <Check
                        size={16}
                        className="text-green-700"
                      />
                    ) : (
                      <Copy
                        size={16}
                        className="text-[#8B5A38]"
                      />
                    )}

                    <span className="text-xs font-medium text-[#8B5A38]">
                      {copied ? "Copied" : "Copy Code"}
                    </span>
                  </button>
                )}
              </div>

              {/* =========================
                  CTA
              ========================= */}

              <Link
                href={buttonLink}
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#6B3E1E] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#4B2E1B]"
              >
                {buttonText}

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Terms */}

              {banner.terms_text && (
                <p className="mt-5 max-w-md text-xs leading-5 text-[#8A7766]">
                  {banner.terms_text}
                </p>
              )}
            </div>

            {/* =========================
                Promotional Image
            ========================= */}

            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px] lg:min-h-full">
              <Image
                src={imageSrc}
                alt={
                  banner.heading
                    ? `${banner.heading} - MARVE offer`
                    : "MARVE home and kitchen offer"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority={false}
              />

              {/* Image Overlay */}

              <div className="absolute inset-0 bg-gradient-to-r from-[#EDE0D1]/20 via-transparent to-black/5" />

              {/* Discount Badge */}

              {discountValue > 0 && (
                <div className="absolute right-5 top-5 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#F5E8D8]/95 text-center text-[#6B3E1E] shadow-lg sm:right-8 sm:top-8 sm:h-24 sm:w-24">
                  <span className="max-w-full px-1 text-xl font-semibold leading-none sm:text-2xl">
                    {discountLabel}
                  </span>

                  <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px]">
                    Off
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            Bottom Note
        ========================= */}

        {banner.terms_text && (
          <p className="mt-4 text-center text-[11px] text-[#9A8D81]">
            *{banner.terms_text}
          </p>
        )}
      </div>
    </section>
  );
}
