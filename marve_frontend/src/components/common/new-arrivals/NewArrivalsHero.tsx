"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import useNewArrivalsHeroBanner from "@/src/hooks/user/useNewArrivalsHeroBanner";

/* ========================= Component ========================= */

export default function NewArrivalsHero() {
  const { banner, isLoading } = useNewArrivalsHeroBanner();

  // Existing design ke liye fallback content
  const image =
    banner?.image || "/assets/images/home/home_lifestyle.jpg";

  const eyebrow =
    banner?.eyebrow || "The Latest Collection";

  const heading =
    banner?.heading || "Fresh pieces,";

  const highlightedHeading =
    banner?.highlighted_heading || "just arrived.";

  const description =
    banner?.description ||
    "Fresh pieces, thoughtful details, and timeless essentials newly added to the MARVE collection.";

  const buttonText =
    banner?.button_text || "Explore New Arrivals";

  const buttonLink =
    banner?.button_link || "#new-arrivals-products";

  const floatingLabel =
    banner?.floating_label || "Latest Edit";

  const floatingTitle =
    banner?.floating_title || "Freshly Curated.";

  const floatingDescription =
    banner?.floating_description ||
    "Discover the newest pieces and thoughtful details, freshly selected to bring something beautiful to your home.";

  const bottomLabel =
    banner?.bottom_label || "MARVE · NEW ARRIVALS";

  // Button URL ko safely handle karein
  const safeButtonLink =
    buttonLink.trim() || "#new-arrivals-products";

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="relative min-h-[620px] w-full overflow-hidden sm:min-h-[680px] lg:min-h-[720px]">
        {/* ========================= Background Image ========================= */}

        <Image
          src={image}
          alt={banner?.heading || "MARVE new arrivals collection"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* ========================= Overlays ========================= */}

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        {/* ========================= Main Content ========================= */}

        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-7xl items-center px-5 py-20 sm:min-h-[680px] sm:px-6 sm:py-24 lg:min-h-[720px] lg:px-8">
          <div className="max-w-xl">
            {/* Eyebrow */}

            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F1C08A] sm:text-xs">
              <Sparkles size={16} strokeWidth={1.5} />
              {eyebrow}
            </div>

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

            {description && (
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:mt-6 sm:text-base sm:leading-8">
                {description}
              </p>
            )}

            {/* CTA */}

            {buttonText && (
              <Link
                href={safeButtonLink}
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

        <div className="absolute right-5 top-1/2 z-10 hidden w-[215px] -translate-y-1/2 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-md sm:block lg:right-8 lg:w-[235px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
              <Sparkles size={18} strokeWidth={1.6} />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                {floatingLabel}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#29231F]">
                {floatingTitle}
              </p>
            </div>
          </div>

          <div className="mt-4 h-px bg-[#E8DED4]" />

          {floatingDescription && (
            <p className="mt-3 text-[11px] leading-5 text-[#8A7D72]">
              {floatingDescription}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6B3E1E]">
            <Sparkles size={12} strokeWidth={1.6} />
            MARVE New Arrivals
          </div>
        </div>

        {/* ========================= Bottom Label ========================= */}

        <div className="absolute bottom-6 left-5 z-10 sm:bottom-8 sm:left-6 lg:left-8">
          <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/60 sm:text-[10px]">
            {bottomLabel}
          </p>
        </div>

        {/* ========================= Scroll Indicator ========================= */}

        <div className="absolute bottom-5 right-5 z-10 hidden items-center gap-3 sm:flex lg:right-8">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">
            Explore
          </span>

          <span className="h-8 w-px bg-white/40" />
        </div>

        {/* ========================= Loading Indicator ========================= */}

        {isLoading && !banner && (
          <div className="absolute right-5 top-5 z-20 rounded-full bg-black/40 px-3 py-1.5 text-[10px] text-white/80 backdrop-blur-sm">
            Loading banner...
          </div>
        )}
      </div>
    </section>
  );
}