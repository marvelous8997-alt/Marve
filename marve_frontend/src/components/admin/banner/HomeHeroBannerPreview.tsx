"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, ImageOff } from "lucide-react";

/* ========================= Types ========================= */

export interface HomeHeroBannerPreviewData {
  image?: string;
  eyebrow?: string;
  heading?: string;
  highlightedHeading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bottomLabel?: string;
}

/* ========================= Props ========================= */

interface HomeHeroBannerPreviewProps {
  banner: HomeHeroBannerPreviewData;
}

/* ========================= Component ========================= */

export default function HomeHeroBannerPreview({
  banner,
}: HomeHeroBannerPreviewProps) {
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
              Home Hero Banner
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#8A7D72]">
          Desktop Preview
        </span>
      </div>

      {/* Hero Banner */}

      <div className="relative min-h-[390px] overflow-hidden bg-[#F3E8DA] sm:min-h-[450px]">
        {banner.image ? (
          <Image
            src={banner.image}
            alt="Home hero banner preview"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center"
          />
        ) : (
          <EmptyImage />
        )}

        {/* Image Overlay */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2414]/75 via-[#5A3218]/30 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Content */}

        <div className="relative z-10 flex min-h-[390px] items-center px-6 py-12 sm:min-h-[450px] sm:px-10">
          <div className="max-w-lg text-white">
            {/* Eyebrow */}

            {banner.eyebrow && (
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#F1D4B0] sm:text-[10px]">
                {banner.eyebrow}
              </p>
            )}

            {/* Heading */}

            <h2 className="max-w-md text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-4xl">
              {banner.heading}

              {banner.highlightedHeading && (
                <span className="mt-1 block font-normal italic text-[#F1D4B0]">
                  {banner.highlightedHeading}
                </span>
              )}
            </h2>

            {/* Description */}

            {banner.description && (
              <p className="mt-4 max-w-sm text-xs leading-6 text-white/85 sm:text-sm">
                {banner.description}
              </p>
            )}

            {/* CTA */}

            {banner.buttonText && (
              <div className="mt-6">
                <Link
                  href={banner.buttonLink || "#"}
                  onClick={(event) => event.preventDefault()}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#FFF8F0] px-5 py-2.5 text-xs font-semibold text-[#5A3218] transition-all duration-300 hover:bg-[#F1D4B0]"
                >
                  {banner.buttonText}

                  <ArrowRight
                    size={14}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}

            {/* Bottom Detail */}

            {banner.bottomLabel && (
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px w-9 bg-[#F1D4B0]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/70">
                  {banner.bottomLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Slider Indicator */}

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          <span className="h-1.5 w-6 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </div>
  );
}