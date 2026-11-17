"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

/* ========================= Promo Points ========================= */

const PROMO_POINTS = [
  "Thoughtfully selected everyday essentials",
  "Special prices on selected products",
  "Simple choices for a beautiful everyday",
];

/* ========================= Component ========================= */

export default function OffersPromo() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#2D1B12] sm:rounded-[2rem]">
          {/* ========================= Decorative Elements ========================= */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#C98A50]/15 sm:h-64 sm:w-64" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full border border-[#C98A50]/10 sm:h-72 sm:w-72" />

          <div className="pointer-events-none absolute right-16 top-10 h-2 w-2 rounded-full bg-[#C98A50]/50" />

          <div className="pointer-events-none absolute bottom-12 left-12 h-1.5 w-1.5 rounded-full bg-[#E0B07D]/40" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr]">
            {/* ========================= Left Content ========================= */}

            <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
              {/* Eyebrow */}

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C98A50]/10 text-[#E0B07D]">
                  <Sparkles
                    size={14}
                    strokeWidth={1.6}
                  />
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E0B07D] sm:text-xs">
                  MARVE Special
                </p>
              </div>

              {/* Heading */}

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-[44px] lg:text-[48px]">
                Make everyday shopping
                <span className="block text-[#E0B07D]">
                  feel a little better.
                </span>
              </h2>

              {/* Description */}

              <p className="mt-5 max-w-xl text-sm leading-6 text-white/60 sm:mt-6 sm:text-[15px] sm:leading-7">
                Discover more from MARVE with thoughtfully selected
                products, special prices and offers made around the
                things you use every day.
              </p>

              {/* Points */}

              <div className="mt-7 space-y-3 sm:mt-8">
                {PROMO_POINTS.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C98A50]/15 text-[#E0B07D]">
                      <Check
                        size={11}
                        strokeWidth={2}
                      />
                    </span>

                    <p className="text-xs text-white/65 sm:text-sm">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}

              <div className="mt-8 sm:mt-9">
                <Link
                  href="/common/products"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3E1E] transition-all duration-300 hover:bg-[#E0B07D] hover:text-[#2D1B12] sm:w-auto"
                >
                  Explore All Products

                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* ========================= Right Image ========================= */}

            <div className="relative min-h-[300px] overflow-hidden lg:min-h-full">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE everyday collection"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/65 via-[#2D1B12]/20 to-transparent lg:bg-gradient-to-r lg:from-[#2D1B12]/45 lg:via-transparent lg:to-transparent" />

              {/* Image Badge */}

              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                <div className="max-w-xs rounded-2xl border border-white/15 bg-[#2D1B12]/45 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E0B07D] sm:text-[10px]">
                    The MARVE Collection
                  </p>

                  <p className="mt-1 text-sm font-medium text-white sm:text-base">
                    Simple. Useful. Beautiful.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= Bottom Note ========================= */}

        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center sm:mt-10 sm:flex-row sm:gap-3">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8A7D72] sm:text-xs">
            Thoughtfully chosen for everyday living
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}