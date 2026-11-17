"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  ChefHat,
  ImageOff,
  Sparkles,
} from "lucide-react";

/* ========================= Types ========================= */

export interface KitchenEssentialsHeroBannerPreviewData {
  image?: string;
  imageFile?: File | null;

  eyebrow?: string;
  heading?: string;
  highlightedHeading?: string;
  description?: string;

  buttonText?: string;
  buttonLink?: string;

  floatingLabel?: string;
  floatingTitle?: string;
  floatingDescription?: string;
  floatingBottomLabel?: string;

  bottomLabel?: string;
}

/* ========================= Props ========================= */

interface KitchenEssentialsHeroBannerPreviewProps {
  banner: KitchenEssentialsHeroBannerPreviewData;
}

/* ========================= Component ========================= */

export default function KitchenEssentialsHeroBannerPreview({
  banner,
}: KitchenEssentialsHeroBannerPreviewProps) {
const [previewImage, setPreviewImage] = useState(
  banner.image || "",
);

useEffect(() => {
  if (!banner.imageFile) {
    setPreviewImage(banner.image || "");
    return;
  }

  const objectUrl = URL.createObjectURL(banner.imageFile);

  setPreviewImage(objectUrl);

  return () => {
    URL.revokeObjectURL(objectUrl);
  };
}, [banner.imageFile, banner.image]);


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
      {/* ========================= Preview Header ========================= */}

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
              Kitchen Essentials Hero
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#8A7D72]">
          Desktop Preview
        </span>
      </div>

      {/* ========================= Kitchen Essentials Banner ========================= */}

      <div className="bg-white p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-2xl bg-[#F8F5F0]">
          {/* ========================= Background Image ========================= */}

          <div className="relative min-h-[430px] w-full overflow-hidden sm:min-h-[500px]">
{previewImage ? (
  <Image
    src={previewImage}
    alt="MARVE kitchen essentials banner preview"
    fill
    unoptimized={Boolean(banner.imageFile)}
    sizes="(max-width: 640px) 100vw, 100vw"
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

            <div className="relative z-10 flex min-h-[430px] w-full items-center px-6 py-12 sm:min-h-[500px] sm:px-8 sm:py-16">
              <div className="max-w-[58%] sm:max-w-xl">
                {/* ========================= Eyebrow ========================= */}

                {banner.eyebrow && (
                  <div className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#F1C08A] sm:text-[9px]">
                    <ChefHat
                      size={13}
                      strokeWidth={1.5}
                    />

                    {banner.eyebrow}
                  </div>
                )}

                {/* ========================= Heading ========================= */}

                <h2 className="mt-4 text-2xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-3xl lg:text-4xl">
                  {banner.heading ||
                    "Everything your"}

                  {banner.highlightedHeading && (
                    <span className="block text-[#F1C08A]">
                      {banner.highlightedHeading}
                    </span>
                  )}
                </h2>

                {/* ========================= Description ========================= */}

                {banner.description && (
                  <p className="mt-4 max-w-lg text-[10px] leading-5 text-white/80 sm:text-xs sm:leading-6">
                    {banner.description}
                  </p>
                )}

                {/* ========================= CTA ========================= */}

                {banner.buttonText && (
                  <Link
                    href={
                      banner.buttonLink || "#"
                    }
                    onClick={(event) =>
                      event.preventDefault()
                    }
                    className="group mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[10px] font-medium text-[#6B3E1E] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#F1C08A] hover:text-[#29231F] sm:px-5 sm:py-3 sm:text-xs"
                  >
                    {banner.buttonText}

                    <ArrowRight
                      size={13}
                      strokeWidth={1.7}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </div>
            </div>

            {/* ========================= Floating Info Card ========================= */}

            <div className="absolute right-4 top-1/2 z-10 hidden w-[175px] -translate-y-1/2 rounded-2xl border border-white/20 bg-white/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-md sm:block lg:right-5 lg:w-[190px]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                  <ChefHat
                    size={15}
                    strokeWidth={1.6}
                  />
                </div>

                <div className="min-w-0">
                  {banner.floatingLabel && (
                    <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                      {banner.floatingLabel}
                    </p>
                  )}

                  {banner.floatingTitle && (
                    <p className="mt-0.5 text-[11px] font-semibold text-[#29231F]">
                      {banner.floatingTitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 h-px bg-[#E8DED4]" />

              {banner.floatingDescription && (
                <p className="mt-2 text-[9px] leading-4 text-[#8A7D72]">
                  {banner.floatingDescription}
                </p>
              )}

              <div className="mt-3 flex items-center gap-1.5 text-[7px] font-semibold uppercase tracking-[0.16em] text-[#6B3E1E]">
                <Sparkles
                  size={10}
                  strokeWidth={1.6}
                />

                {banner.floatingBottomLabel ||
                  "MARVE Kitchen"}
              </div>
            </div>

            {/* ========================= Bottom Label ========================= */}

            <div className="absolute bottom-4 left-5 z-10 sm:bottom-5 sm:left-6">
              <p className="text-[7px] font-medium uppercase tracking-[0.28em] text-white/60 sm:text-[8px]">
                {banner.bottomLabel ||
                  "MARVE · KITCHEN COLLECTION"}
              </p>
            </div>

            {/* ========================= Scroll Indicator ========================= */}

            <div className="absolute bottom-4 right-5 z-10 hidden items-center gap-2 sm:flex">
              <span className="text-[7px] font-medium uppercase tracking-[0.2em] text-white/60">
                Explore
              </span>

              <span className="h-6 w-px bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}