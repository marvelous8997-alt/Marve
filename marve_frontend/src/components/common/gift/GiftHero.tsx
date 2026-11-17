"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Gift,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

export default function GiftHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#C98A50]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#6B3E1E]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-5 text-xs sm:py-6 sm:text-sm">
          <Link
            href="/"
            className="text-[#8A7D72] transition-colors hover:text-[#6B3E1E]"
          >
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-[#A79A8F]" />

          <span className="font-medium text-[#6B3E1E]">Gift</span>
        </div>

        {/* Hero */}
        <div className="grid items-center gap-10 pb-16 pt-8 sm:gap-12 sm:pb-20 sm:pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-24 lg:pt-12">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-white/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A66A32] shadow-sm sm:text-xs">
              <Gift className="h-3.5 w-3.5" />
              Thoughtful Gifting
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#29231F] sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              Thoughtful Gifts
              <span className="block text-[#6B3E1E]">
                For Every Home
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#8A7D72] sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
              Discover beautiful and useful home and kitchen essentials
              chosen to make birthdays, housewarmings, celebrations and
              everyday moments a little more special.
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link
                href="#gift-collection"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15 sm:px-7"
              >
                Shop Gifts
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#gift-occasions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#FFF9F2] sm:px-7"
              >
                Explore Occasions
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Highlights */}
            <div className="mt-9 grid grid-cols-3 border-t border-[#E7DED4] pt-6 sm:mt-10 sm:pt-7">
              <div className="pr-3 sm:pr-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6B3E1E] shadow-sm">
                  <Heart className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-semibold text-[#29231F] sm:text-sm">
                  Thoughtfully Chosen
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#8A7D72] sm:text-xs">
                  Made for meaningful moments
                </p>
              </div>

              <div className="border-l border-[#E7DED4] px-3 sm:px-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6B3E1E] shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-semibold text-[#29231F] sm:text-sm">
                  Every Occasion
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#8A7D72] sm:text-xs">
                  Celebrate every special day
                </p>
              </div>

              <div className="border-l border-[#E7DED4] pl-3 sm:pl-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6B3E1E] shadow-sm">
                  <Star className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-semibold text-[#29231F] sm:text-sm">
                  Made to Delight
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#8A7D72] sm:text-xs">
                  Beautiful & useful essentials
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Main Image Card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[#E7DED4] bg-white p-3 shadow-[0_25px_70px_rgba(45,27,18,0.10)] sm:rounded-[2.5rem] sm:p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#EDE5DC] sm:rounded-[2rem]">
                <Image
                  src="/assets/images/home/home_lifestyle.jpg"
                  alt="MARVE home and kitchen gifting collection"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 50vw"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/45 via-[#2D1B12]/5 to-transparent" />

                {/* Top Badge */}
                <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B3E1E] shadow-md backdrop-blur-md sm:text-xs">
                    <Gift className="h-3.5 w-3.5" />
                    MARVE Gifts
                  </div>
                </div>

                {/* Bottom Image Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                  <div className="rounded-2xl border border-white/60 bg-white/92 p-4 shadow-[0_15px_40px_rgba(45,27,18,0.15)] backdrop-blur-md sm:p-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E] text-white shadow-sm sm:h-12 sm:w-12">
                        <Gift className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                          Gift Something Special
                        </p>

                        <p className="mt-1 text-base font-semibold text-[#29231F] sm:text-lg">
                          Beautiful for them. Useful for every day.
                        </p>
                      </div>
                    </div>

                    {/* Decorative Gift Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5 text-[10px] font-medium text-[#6B3E1E]">
                        Housewarming
                      </span>

                      <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5 text-[10px] font-medium text-[#6B3E1E]">
                        Birthday
                      </span>

                      <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5 text-[10px] font-medium text-[#6B3E1E]">
                        Celebration
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Top Card */}
            <div className="absolute -left-2 top-10 hidden sm:block lg:-left-7 lg:top-16">
              <div className="rounded-2xl border border-[#E7DED4] bg-white p-3.5 shadow-[0_15px_40px_rgba(45,27,18,0.10)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9F2] text-[#A66A32]">
                    <Heart className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#A79A8F]">
                      Picked With Care
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                      Gifts They'll Love
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Bottom Card */}
            <div className="absolute -right-2 bottom-10 hidden sm:block lg:-right-7 lg:bottom-16">
              <div className="rounded-2xl border border-[#E7DED4] bg-white p-3.5 shadow-[0_15px_40px_rgba(45,27,18,0.10)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#A79A8F]">
                      MARVE
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                      Made for Moments
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Rings */}
            <div className="pointer-events-none absolute -right-10 -top-10 -z-0 h-28 w-28 rounded-full border border-[#C98A50]/20 sm:h-36 sm:w-36" />

            <div className="pointer-events-none absolute -bottom-8 -left-8 -z-0 h-24 w-24 rounded-full border border-[#6B3E1E]/10 sm:h-32 sm:w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}