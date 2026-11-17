"use client";

import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

/* ========================= Types ========================= */

interface Reel {
  id: number;
  title: string;
  subtitle: string;
  video: string;
  productHref: string;
}

/* ========================= Demo Reels ========================= */
/* Replace video paths with actual reel videos later */

const REELS: Reel[] = [
  {
    id: 1,
    title: "Smart kitchen essentials",
    subtitle: "Make everyday cooking easier",
    video: "/assets/videos/reels/video_01.mp4",
    productHref: "/products",
  },
  {
    id: 2,
    title: "Organize your space",
    subtitle: "Simple solutions, beautiful homes",
    video: "/assets/videos/reels/video_02.mp4",
    productHref: "/products",
  },
  {
    id: 3,
    title: "Made for everyday moments",
    subtitle: "Function meets timeless design",
    video: "/assets/videos/reels/video_03.mp4",
    productHref: "/products",
  },
  {
    id: 4,
    title: "A better way to serve",
    subtitle: "Elevate your dining experience",
    video: "/assets/videos/reels/video_04.mp4",
    productHref: "/products",
  },
  {
    id: 5,
    title: "Little details, big difference",
    subtitle: "Thoughtful essentials for your home",
    video: "/assets/videos/reels/video_05.mp4",
    productHref: "/products",
  },
];

/* ========================= Component ========================= */

export default function ReelsSection() {
  return (
    <section className="w-full bg-[#F8F5F0] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================= Section Header ========================= */}

        <div className="flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#A66A32]">
            Inspired by everyday living
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-[42px]">
            See MARVE in action
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-[#756B63] sm:text-base">
            Discover how our thoughtfully selected essentials fit beautifully
            into everyday homes.
          </p>
        </div>

        {/* ========================= Reels ========================= */}

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 scrollbar-hide sm:gap-5">
          {REELS.map((reel) => (
            <div
              key={reel.id}
              className="group relative min-w-[72%] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-[#E9DED1] sm:min-w-[38%] md:min-w-[29%] lg:min-w-[19%]"
            >
              {/* Video */}
              <div className="relative aspect-[9/14] w-full overflow-hidden bg-[#D8C4B0]">
                <video
                  src={reel.video}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />

                {/* Play icon */}
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Play size={19} fill="currentColor" strokeWidth={1.5} />
                </div>

                {/* Reel content */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F1D4B0]">
                    MARVE HOME
                  </p>

                  <h3 className="text-base font-semibold leading-5 sm:text-lg">
                    {reel.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/80">
                    {reel.subtitle}
                  </p>

                  <Link
                    href={reel.productHref}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white underline-offset-4 transition-all hover:underline"
                  >
                    Shop now
                    <ArrowRight size={13} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================= Bottom CTA ========================= */}

        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border border-[#6B3E1E] px-6 py-3 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white"
          >
            Explore all products
            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}