"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function OffersHero() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* ========================= Left Content ========================= */}

          <div className="max-w-xl">
            {/* Breadcrumb */}

            <div className="mb-7 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A7D72] sm:mb-8 sm:text-xs">
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-[#6B3E1E]"
              >
                Home
              </Link>

              <ChevronRight
                size={12}
                strokeWidth={1.5}
                className="text-[#C98A50]"
              />

              <span className="text-[#6B3E1E]">
                Offers
              </span>
            </div>

            {/* Eyebrow */}

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B3E1E]/8 text-[#A66A32]">
                <Sparkles
                  size={14}
                  strokeWidth={1.6}
                />
              </span>

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
                Special Offers
              </p>
            </div>

            {/* Heading */}

            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#29231F] sm:mt-5 sm:text-5xl md:text-[56px] lg:text-[60px]">
              More reasons to
              <span className="block text-[#6B3E1E]">
                bring MARVE home.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-5 max-w-lg text-sm leading-6 text-[#8A7D72] sm:mt-6 sm:text-[15px] sm:leading-7">
              Discover special prices, limited-time deals and thoughtful
              offers across our collection of everyday essentials.
            </p>

            {/* CTA */}

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link
                href="#offers"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#A66A32] sm:w-auto"
              >
                Shop Offers

                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/common/products"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#6B3E1E]/15 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#6B3E1E]/5 sm:w-auto"
              >
                Explore Collection
              </Link>
            </div>

            {/* Small Note */}

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mt-8">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B3E1E]">
                Limited Time
              </span>

              <span className="h-1 w-1 rounded-full bg-[#C98A50]" />

              <span className="text-[10px] uppercase tracking-[0.12em] text-[#8A7D72]">
                Selected MARVE favourites
              </span>
            </div>
          </div>

          {/* ========================= Right Image ========================= */}

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#EDE5DC] sm:rounded-[2rem] lg:aspect-[5/4]">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE special offers"
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              {/* Image Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/55 via-transparent to-[#2D1B12]/5" />

              {/* Top Badge */}

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <div className="rounded-full border border-white/20 bg-[#2D1B12]/55 px-4 py-2 backdrop-blur-md">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white sm:text-[10px]">
                    MARVE Offers
                  </p>
                </div>
              </div>

              {/* Bottom Content */}

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/65 sm:text-[10px]">
                      Specially selected
                    </p>

                    <p className="mt-1 text-lg font-medium tracking-[-0.02em] text-white sm:text-xl">
                      Everyday favourites.
                    </p>
                  </div>

                  <div className="hidden shrink-0 rounded-full bg-white/95 px-4 py-2.5 sm:block">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B3E1E]">
                      Shop Now
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Offer Card */}

            <div className="absolute -bottom-5 right-4 rounded-2xl border border-[#6B3E1E]/10 bg-white px-4 py-3 shadow-[0_12px_35px_rgba(45,27,18,0.12)] sm:-bottom-6 sm:right-7 sm:px-5 sm:py-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                Special
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#29231F] sm:text-base">
                Offers await
              </p>

              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                While stocks last
              </p>
            </div>

            {/* Decorative Circle */}

            <div className="pointer-events-none absolute -right-3 -top-3 -z-0 h-20 w-20 rounded-full border border-[#C98A50]/25 sm:-right-5 sm:-top-5 sm:h-28 sm:w-28" />
          </div>
        </div>
      </div>
    </section>
  );
}