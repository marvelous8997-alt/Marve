"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  Eye,
  ImageOff,
} from "lucide-react";
import { useState } from "react";

/* ========================= Types ========================= */

export interface HomeCouponBannerPreviewData {
  image?: string;

  eyebrow?: string;
  heading?: string;
  highlightedHeading?: string;
  description?: string;

  buttonText?: string;
  buttonLink?: string;

  offerText?: string;
  discountValue?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  couponCode?: string;

  termsText?: string;
}

/* ========================= Props ========================= */

interface HomeCouponBannerPreviewProps {
  banner: HomeCouponBannerPreviewData;
}

/* ========================= Component ========================= */

export default function HomeCouponBannerPreview({
  banner,
}: HomeCouponBannerPreviewProps) {
  const [copied, setCopied] = useState(false);

  /* ========================= Copy Coupon ========================= */

  const handleCopyCoupon = async () => {
    if (!banner.couponCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        banner.couponCode,
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  /* ========================= Discount Label ========================= */

  const discountLabel =
    banner.discountType === "FIXED"
      ? `₹${banner.discountValue ?? 0}`
      : `${banner.discountValue ?? 0}%`;

  /* ========================= Empty Image ========================= */

  const EmptyImage = ({
    className = "",
  }: {
    className?: string;
  }) => (
    <div
      className={`flex h-full w-full items-center justify-center bg-[#F8F5F0] ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6B3E1E]/8">
          <ImageOff
            size={20}
            strokeWidth={1.5}
            className="text-[#6B3E1E]"
          />
        </div>

        <p className="mt-3 text-xs font-semibold text-[#6B3E1E]">
          No banner image
        </p>

        <p className="mt-1 text-[10px] text-[#8A7D72]">
          Upload an image to preview it here.
        </p>
      </div>
    </div>
  );

  /* ========================= Render ========================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
      {/* Preview Header */}

      <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
            <Eye
              size={14}
              strokeWidth={1.7}
              className="text-[#6B3E1E]"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#29231F]">
              Banner Preview
            </p>

            <p className="text-[9px] text-[#A0958C]">
              Home Coupon Offer
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#8A7D72]">
          Desktop Preview
        </span>
      </div>

      {/* Coupon Banner */}

      <div className="bg-white p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-2xl bg-[#EDE0D1]">
          <div className="grid min-h-[330px] grid-cols-1 lg:grid-cols-2">
            {/* ========================= Offer Content ========================= */}

            <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12">
              {/* Decorative circle */}

              <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full border border-[#C59A70]/30" />

              {/* Eyebrow */}

              {banner.eyebrow && (
                <p className="relative mb-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8B5A38]">
                  {banner.eyebrow}
                </p>
              )}

              {/* Heading */}

              <h2 className="relative max-w-md text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#4B2E1B] sm:text-3xl">
                {banner.heading || "Your offer heading"}

                {banner.highlightedHeading && (
                  <>
                    <br />

                    <span className="font-normal italic">
                      {banner.highlightedHeading}
                    </span>
                  </>
                )}
              </h2>

              {/* Description */}

              {banner.description && (
                <p className="relative mt-4 max-w-sm text-xs leading-6 text-[#725A46] sm:text-sm">
                  {banner.description}
                </p>
              )}

              {/* Offer */}

              {(banner.offerText ||
                banner.discountValue !== undefined) && (
                <div className="relative mt-5">
                  {banner.offerText && (
                    <p className="text-xs font-medium text-[#725A46] sm:text-sm">
                      {banner.offerText}
                    </p>
                  )}

                  {/* Coupon Code */}

                  {banner.couponCode && (
                    <button
                      type="button"
                      onClick={handleCopyCoupon}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-[#9B7657] bg-white/60 px-3 py-2.5 transition-colors hover:bg-white"
                    >
                      <span className="text-xs font-bold tracking-[0.14em] text-[#5A3218]">
                        {banner.couponCode}
                      </span>

                      <span className="h-4 w-px bg-[#C9AD91]" />

                      {copied ? (
                        <Check
                          size={14}
                          className="text-green-700"
                        />
                      ) : (
                        <Copy
                          size={14}
                          className="text-[#8B5A38]"
                        />
                      )}

                      <span className="text-[10px] font-medium text-[#8B5A38]">
                        {copied
                          ? "Copied"
                          : "Copy Code"}
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* CTA */}

              {banner.buttonText && (
                <Link
                  href={banner.buttonLink || "#"}
                  onClick={(event) =>
                    event.preventDefault()
                  }
                  className="group relative mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#4B2E1B]"
                >
                  {banner.buttonText}

                  <ArrowRight
                    size={14}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              )}
            </div>

            {/* ========================= Promotional Image ========================= */}

            <div className="relative min-h-[230px] overflow-hidden lg:min-h-full">
              {banner.image ? (
                <Image
                  src={banner.image}
                  alt="Home coupon offer banner preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <EmptyImage />
              )}

              {/* Image Overlay */}

              <div className="absolute inset-0 bg-gradient-to-r from-[#EDE0D1]/20 via-transparent to-black/5" />

              {/* Discount Badge */}

              {banner.discountValue !== undefined &&
  banner.discountValue > 0 && (
                <div className="absolute right-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#F5E8D8]/95 text-center text-[#6B3E1E] shadow-lg sm:h-20 sm:w-20">
                  <span className="text-xl font-semibold leading-none sm:text-2xl">
                    {discountLabel}
                  </span>

                  <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] sm:text-[9px]">
                    Off
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms */}

        {banner.termsText && (
          <p className="mt-3 text-center text-[9px] text-[#9A8D81]">
            {banner.termsText}
          </p>
        )}
      </div>
    </div>
  );
}