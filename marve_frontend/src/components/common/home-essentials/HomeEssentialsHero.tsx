
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  House,
  Sparkles,
} from "lucide-react";

import useHomeEssentialsHeroBanner from "@/src/hooks/user/useHomeEssentialsHeroBanner";

export default function HomeEssentialsHero() {
  const {
    banner,
    isLoading,
    error,
    refreshHomeEssentialsHeroBanner,
  } = useHomeEssentialsHeroBanner();

  /* =========================
     LOADING STATE
  ========================= */

  if (isLoading && !banner) {
    return (
      <section className="w-full bg-[#F8F5F0]">
        <div className="min-h-[620px] animate-pulse bg-[#E8DED4] sm:min-h-[680px] lg:min-h-[720px]" />
      </section>
    );
  }

  /* =========================
     EMPTY / ERROR STATE
  ========================= */

  if (!banner) {
    if (error) {
      return (
        <section className="w-full bg-[#F8F5F0] px-5 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-xl">
            <House
              size={32}
              strokeWidth={1.4}
              className="mx-auto text-[#A66A32]"
            />

            <h2 className="mt-4 text-xl font-semibold text-[#39312B]">
              Home Essentials
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
              We couldn&apos;t load the Home Essentials collection right now.
              Please try again.
            </p>

            <button
              type="button"
              onClick={() => {
                void refreshHomeEssentialsHeroBanner();
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4B371C]"
            >
              Try Again
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      );
    }

    // No active banner is a valid state.
    return null;
  }

  /* =========================
     BANNER DATA
  ========================= */

  const image =
    banner.image?.trim() || "/assets/images/home/home_lifestyle.jpg";

  const eyebrow =
    banner.eyebrow?.trim() || "The Home Collection";

  const heading =
    banner.heading?.trim() || "Beautiful essentials";

  const highlightedHeading =
    banner.highlighted_heading?.trim() || "for every corner.";

  const description =
    banner.description?.trim() ||
    "Thoughtfully chosen essentials designed to bring comfort, warmth and effortless style to every corner of your home.";

  const buttonText =
    banner.button_text?.trim() || "Explore Collection";

  const buttonLink =
    banner.button_link?.trim() || "#home-essentials-products";

  const floatingLabel =
    banner.floating_label?.trim() || "Home Edit";

  const floatingTitle =
    banner.floating_title?.trim() || "Live. Relax. Enjoy.";

  const floatingDescription =
    banner.floating_description?.trim() ||
    "Beautifully practical pieces and thoughtful details for a home that feels warm, comfortable and effortlessly yours.";

  const bottomLabel =
    banner.bottom_label?.trim() || "MARVE · HOME COLLECTION";

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="relative min-h-[620px] w-full overflow-hidden sm:min-h-[680px] lg:min-h-[720px]">
        {/* =========================
            BACKGROUND IMAGE
        ========================= */}

        <Image
          src={image}
          alt={heading}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* =========================
            OVERLAYS
        ========================= */}

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-7xl items-center px-5 py-20 sm:min-h-[680px] sm:px-6 sm:py-24 lg:min-h-[720px] lg:px-8">
          <div className="max-w-xl">
            {/* Eyebrow */}

            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F1C08A] sm:text-xs">
              <House size={16} strokeWidth={1.5} />
              <span>{eyebrow}</span>
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
          </div>
        </div>

        {/* =========================
            FLOATING INFO CARD
        ========================= */}

        {(floatingLabel || floatingTitle || floatingDescription) && (
          <div className="absolute right-5 top-1/2 z-10 hidden w-[215px] -translate-y-1/2 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-md sm:block lg:right-8 lg:w-[235px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                <House size={18} strokeWidth={1.6} />
              </div>

              <div>
                {floatingLabel && (
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                    {floatingLabel}
                  </p>
                )}

                {floatingTitle && (
                  <p className="mt-1 text-sm font-semibold text-[#29231F]">
                    {floatingTitle}
                  </p>
                )}
              </div>
            </div>

            {floatingDescription && (
              <>
                <div className="mt-4 h-px bg-[#E8DED4]" />

                <p className="mt-3 text-[11px] leading-5 text-[#8A7D72]">
                  {floatingDescription}
                </p>
              </>
            )}

            <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6B3E1E]">
              <Sparkles size={12} strokeWidth={1.6} />
              MARVE Home
            </div>
          </div>
        )}

        {/* =========================
            BOTTOM LABEL
        ========================= */}

        {bottomLabel && (
          <div className="absolute bottom-6 left-5 z-10 sm:bottom-8 sm:left-6 lg:left-8">
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/60 sm:text-[10px]">
              {bottomLabel}
            </p>
          </div>
        )}

        {/* =========================
            SCROLL INDICATOR
        ========================= */}

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
