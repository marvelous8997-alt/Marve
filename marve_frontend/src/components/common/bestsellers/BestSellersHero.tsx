
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";

import useBestSellersHeroBanner from "@/src/hooks/user/useBestSellersHeroBanner";

export default function BestSellersHero() {
  const { banner, isLoading, error } = useBestSellersHeroBanner();

  // Hide the hero while the active banner is being fetched.
  if (isLoading) {
    return (
      <section className="w-full bg-[#F8F5F0]">
        <div className="min-h-[620px] animate-pulse bg-[#E8DED4] sm:min-h-[680px] lg:min-h-[720px]" />
      </section>
    );
  }

  // Do not display a banner when no active banner is available.
  if (!banner) {
    if (error) {
      console.error("Best Sellers Hero Banner:", error);
    }

    return null;
  }

  const imageSrc = banner.image?.trim() || null;
  const heading = banner.heading?.trim() || "";
  const highlightedHeading =
    banner.highlighted_heading?.trim() || "";
  const buttonText = banner.button_text?.trim() || "Shop Bestsellers";
  const buttonLink = banner.button_link?.trim() || "#bestsellers-products";

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="relative min-h-[620px] w-full overflow-hidden bg-[#39312B] sm:min-h-[680px] lg:min-h-[720px]">
        {/* ========================= Background Image ========================= */}

        {imageSrc && (
          <Image
            src={imageSrc}
            alt={heading || "MARVE bestselling collection"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}

        {/* ========================= Overlays ========================= */}

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        {/* ========================= Main Content ========================= */}

        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-7xl items-center px-5 py-20 sm:min-h-[680px] sm:px-6 sm:py-24 lg:min-h-[720px] lg:px-8">
          <div className="max-w-xl">
            {/* Eyebrow */}

            {banner.eyebrow && (
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F1C08A] sm:text-xs">
                <Crown size={16} strokeWidth={1.5} />

                {banner.eyebrow}
              </div>
            )}

            {/* Heading */}

            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {heading}

              {highlightedHeading && (
                <span className="block text-[#F1C08A]">
                  {highlightedHeading}
                </span>
              )}
            </h1>

            {/* Description */}

            {banner.description && (
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:mt-6 sm:text-base sm:leading-8">
                {banner.description}
              </p>
            )}

            {/* Rating Highlight */}

            {banner.rating_text && (
              <div className="mt-5 flex items-center gap-2 text-white/75">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill="currentColor"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                <span className="text-xs">
                  {banner.rating_text}
                </span>
              </div>
            )}

            {/* CTA */}

            {buttonText && (
              <Link
                href={buttonLink}
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-medium text-[#6B3E1E] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#F1C08A] hover:text-[#29231F] sm:mt-8 sm:px-7 sm:py-4 sm:text-sm"
              >
                {buttonText}

                <ArrowRight
                  size={17}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
        </div>

        {/* ========================= Floating Info Card ========================= */}

        {(banner.floating_label ||
          banner.floating_title ||
          banner.floating_description) && (
          <div className="absolute right-5 top-1/2 z-10 hidden w-[215px] -translate-y-1/2 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-md sm:block lg:right-8 lg:w-[235px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                <Crown size={18} strokeWidth={1.6} />
              </div>

              <div>
                {banner.floating_label && (
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                    {banner.floating_label}
                  </p>
                )}

                {banner.floating_title && (
                  <p className="mt-1 text-sm font-semibold text-[#29231F]">
                    {banner.floating_title}
                  </p>
                )}
              </div>
            </div>

            {banner.floating_description && (
              <>
                <div className="mt-4 h-px bg-[#E8DED4]" />

                <p className="mt-3 text-[11px] leading-5 text-[#8A7D72]">
                  {banner.floating_description}
                </p>
              </>
            )}

            <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6B3E1E]">
              <Sparkles size={12} strokeWidth={1.6} />
              MARVE Favourites
            </div>
          </div>
        )}

        {/* ========================= Bottom Label ========================= */}

        {banner.bottom_label && (
          <div className="absolute bottom-6 left-5 z-10 sm:bottom-8 sm:left-6 lg:left-8">
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/60 sm:text-[10px]">
              {banner.bottom_label}
            </p>
          </div>
        )}

        {/* ========================= Scroll Indicator ========================= */}

        <div className="absolute bottom-5 right-5 z-10 hidden items-center gap-3 sm:flex lg:right-8">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">
            Explore
          </span>

          <span className="h-8 w-px bg-white/40" />
        </div>
      </div>
    </section>
  );
}
