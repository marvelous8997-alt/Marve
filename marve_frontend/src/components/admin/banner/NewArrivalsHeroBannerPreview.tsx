"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  ImageOff,
  Sparkles,
} from "lucide-react";

/* =========================================================
   Types
========================================================= */

export interface NewArrivalsHeroBannerPreviewData {
  image?: string;

  eyebrow?: string;

  heading?: string;

  highlightedHeading?: string;

  description?: string;

  buttonText?: string;

  buttonLink?: string;

  floatingLabel?: string;

  floatingTitle?: string;

  floatingDescription?: string;

  bottomLabel?: string;
}

interface NewArrivalsHeroBannerPreviewProps {
  banner: NewArrivalsHeroBannerPreviewData;
}

/* =========================================================
   Empty Image
========================================================= */

function EmptyImage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#F1ECE6]">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#A0958C] shadow-sm">
          <ImageOff
            size={22}
            strokeWidth={1.5}
          />
        </div>

        <p className="mt-3 text-xs font-semibold text-[#665B53]">
          No banner image
        </p>

        <p className="mt-1 text-[10px] text-[#A0958C]">
          Upload an image to preview the banner.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   Component
========================================================= */

export default function NewArrivalsHeroBannerPreview({
  banner,
}: NewArrivalsHeroBannerPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
      {/* =====================================================
          Preview Header
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
            <Eye
              size={14}
              strokeWidth={1.7}
              className="text-[#6B3E1E]"
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#29231F]">
              Live Preview
            </p>

            <p className="mt-0.5 text-[9px] text-[#A0958C]">
              New Arrivals Hero
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E]">
          Desktop Preview
        </span>
      </div>

      {/* =====================================================
          Banner Preview
      ===================================================== */}

      <div className="p-3 sm:p-4">
        <div className="relative min-h-[520px] w-full overflow-hidden rounded-xl bg-[#F8F5F0] sm:min-h-[580px]">
          {/* ========================= Background Image ========================= */}

          {banner.image ? (
            <Image
              src={banner.image}
              alt={
                banner.heading ||
                "MARVE new arrivals collection"
              }
              fill
              sizes="(max-width: 1280px) 100vw, 900px"
              className="object-cover object-center"
            />
          ) : (
            <EmptyImage />
          )}

          {/* ========================= Overlays ========================= */}

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

          {/* ========================= Main Content ========================= */}

          <div className="relative z-10 flex min-h-[520px] w-full items-center px-6 py-16 sm:min-h-[580px] sm:px-8 sm:py-20">
            <div className="max-w-[62%] sm:max-w-xl">
              {/* Eyebrow */}

{banner.eyebrow?.trim() && (
  <div className="flex items-center gap-2.5 text-[8px] font-semibold uppercase tracking-[0.20em] text-[#F1C08A] sm:gap-3 sm:text-[10px]">
    <Sparkles
      size={14}
      strokeWidth={1.5}
      className="shrink-0 sm:h-4 sm:w-4"
    />
    <span>{banner.eyebrow}</span>
  </div>
)}

              {/* Heading */}

{(banner.heading?.trim() ||
  banner.highlightedHeading?.trim()) && (
  <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
    {banner.heading?.trim()}

    {banner.highlightedHeading?.trim() && (
      <span className="block text-[#F1C08A]">
        {banner.highlightedHeading}
      </span>
    )}
  </h2>
)}

              {/* Description */}

{banner.description?.trim() && (
  <p className="mt-4 max-w-lg text-[11px] leading-6 text-white/80 sm:mt-5 sm:text-sm sm:leading-7">
    {banner.description}
  </p>
)}

              {/* CTA */}

{banner.buttonText?.trim() && (
  <Link
    href={banner.buttonLink?.trim() || "#"}
    onClick={(event) => event.preventDefault()}
    className="group mt-5 inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3 text-[10px] font-medium text-[#6B3E1E] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#F1C08A] hover:text-[#29231F] sm:mt-7 sm:gap-3 sm:px-6 sm:py-3.5 sm:text-xs"
  >
    {banner.buttonText}

    <ArrowRight
      size={15}
      strokeWidth={1.7}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </Link>
)}
            </div>
          </div>

          {/* =====================================================
              Floating Info Card
          ===================================================== */}
{(
  banner.floatingLabel?.trim() ||
  banner.floatingTitle?.trim() ||
  banner.floatingDescription?.trim()
) && (
          <div className="absolute right-4 top-1/2 z-10 hidden w-[190px] -translate-y-1/2 rounded-2xl border border-white/20 bg-white/90 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-md sm:block lg:right-6 lg:w-[205px]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                <Sparkles
                  size={16}
                  strokeWidth={1.6}
                />
              </div>

              <div className="min-w-0">
              {banner.floatingLabel?.trim() && (
  <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
    {banner.floatingLabel}
  </p>
)}

{banner.floatingTitle?.trim() && (
  <p className="mt-1 truncate text-xs font-semibold text-[#29231F]">
    {banner.floatingTitle}
  </p>
)}
              </div>
            </div>

            <div className="mt-3 h-px bg-[#E8DED4]" />

           {banner.floatingDescription?.trim() && (
  <p className="mt-2.5 text-[9px] leading-4.5 text-[#8A7D72]">
    {banner.floatingDescription}
  </p>
)}

            <div className="mt-3 flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6B3E1E]">
  <Sparkles size={10} strokeWidth={1.6} />
  MARVE New Arrivals
</div>
          </div>
          )}

          {/* =====================================================
              Bottom Label
          ===================================================== */}

          <div className="absolute bottom-5 left-5 z-10 sm:bottom-6 sm:left-6">
            {banner.bottomLabel?.trim() && (
  <p className="text-[8px] font-medium uppercase tracking-[0.24em] text-white/60 sm:text-[9px]">
    {banner.bottomLabel}
  </p>
)}
          </div>

          {/* =====================================================
              Scroll Indicator
          ===================================================== */}

          <div className="absolute bottom-4 right-4 z-10 hidden items-center gap-2.5 sm:flex lg:right-6">
  <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/60">
    Explore
  </span>
  <span className="h-7 w-px bg-white/40" />
</div>
        </div>
      </div>
    </div>
  );
}