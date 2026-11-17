
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import useHomeHeroBanner from "@/src/hooks/user/useHomeHeroBanner";

/* ========================= Component ========================= */

export default function ImagePromoSection() {
  const { banner, isLoading, error } = useHomeHeroBanner();

  // Avoid showing the section when no active banner exists.
  if (isLoading || !banner) {
    return null;
  }

  const imageSrc = banner.image?.trim() || null;
  const heading = banner.heading?.trim() || "";
  const highlightedHeading =
    banner.highlighted_heading?.trim() || "";
  const eyebrow = banner.eyebrow?.trim() || "";
  const description = banner.description?.trim() || "";
  const buttonText = banner.button_text?.trim() || "";
  const buttonLink = banner.button_link?.trim() || "";
  const bottomLabel = banner.bottom_label?.trim() || "";

  // A valid image is required to render this image banner.
  if (!imageSrc) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#F3E8DA]">
      {/* ========================= Hero Image ========================= */}

      <div className="relative min-h-[560px] w-full sm:min-h-[620px] lg:min-h-[700px]">
        <Image
          src={imageSrc}
          alt={heading || "MARVE home and kitchen collection"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* ========================= Image Overlay ========================= */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2414]/75 via-[#5A3218]/30 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* ========================= Content ========================= */}

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-16 sm:min-h-[620px] sm:px-8 lg:min-h-[700px] lg:px-10">
          <div className="max-w-xl text-white">
            {/* Eyebrow */}
            {eyebrow && (
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#F1D4B0] sm:text-sm">
                {eyebrow}
              </p>
            )}

            {/* Heading */}
            {(heading || highlightedHeading) && (
              <h2 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                {heading}

                {highlightedHeading && (
                  <span className="mt-1 block font-normal italic text-[#F1D4B0]">
                    {highlightedHeading}
                  </span>
                )}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className="mt-6 max-w-md text-sm leading-7 text-white/85 sm:text-base">
                {description}
              </p>
            )}

            {/* CTA */}
            {buttonText && buttonLink && (
              <div className="mt-8">
                <Link
                  href={buttonLink}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#FFF8F0] px-7 py-3.5 text-sm font-semibold text-[#5A3218] transition-all duration-300 hover:bg-[#F1D4B0] hover:shadow-xl"
                >
                  {buttonText}

                  <ArrowRight
                    size={17}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}

            {/* Bottom detail */}
            {bottomLabel && (
              <div className="mt-12 flex items-center gap-3">
                <div className="h-px w-12 bg-[#F1D4B0]" />

                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                  {bottomLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================= Scroll / Slider Indicator ========================= */}

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}
