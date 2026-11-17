"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  MapPin,
  Navigation,
  Store,
} from "lucide-react";

export default function StoreLocatorHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full border border-[#C98A50]/20" />
      <div className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full border border-[#A66A32]/15" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-[#8A7D72] sm:mb-10">
          <Link
            href="/"
            className="transition-colors hover:text-[#6B3E1E]"
          >
            Home
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-[#6B3E1E]">
            Store Locator
          </span>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              <MapPin className="h-4 w-4" />
              Find MARVE Near You
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#29231F] sm:text-5xl lg:text-6xl">
              Visit MARVE
              <span className="block text-[#6B3E1E]">
                In Person.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-lg text-base leading-7 text-[#8A7D72] sm:text-lg">
              Discover a MARVE store near you and experience our thoughtfully
              chosen collection of everyday essentials in person.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#find-a-store"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15"
              >
                Find a Store
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/common/products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6B3E1E]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E] hover:bg-[#FFF9F2]"
              >
                Explore Collection
              </Link>
            </div>

            {/* Small Info */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#8A7D72]">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#A66A32]" />
                <span>Explore In Person</span>
              </div>

              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-[#A66A32]" />
                <span>Easy to Find</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#A66A32]" />
                <span>Store Hours Available</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#EDE5DC] shadow-[0_20px_60px_rgba(45,27,18,0.12)]">
              <div className="relative aspect-[4/4.2] sm:aspect-[4/3.5] lg:aspect-[4/4.4]">
                <Image
                  src="/assets/images/home/home_lifestyle.jpg"
                  alt="MARVE lifestyle collection"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/55 via-transparent to-[#2D1B12]/10" />

                {/* Top Badge */}
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#2D1B12]/75 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:left-6 sm:top-6">
                  MARVE Stores
                </div>

                {/* Bottom Image Content */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                    Discover MARVE
                  </p>

                  <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                    Everyday favourites, in person.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Location Card */}
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-[#E7DED4] bg-white px-4 py-3 shadow-[0_12px_35px_rgba(45,27,18,0.12)] sm:-left-5 sm:bottom-8 sm:px-5 sm:py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                  Find Nearby
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  Your nearest MARVE store
                </p>
              </div>
            </div>

            {/* Floating Store Badge */}
            <div className="absolute -right-2 top-20 hidden rounded-2xl border border-[#E7DED4] bg-white px-4 py-3 shadow-[0_12px_35px_rgba(45,27,18,0.12)] sm:block lg:-right-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6B3E1E] text-white">
                  <Store className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#29231F]">
                    MARVE Store
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8A7D72]">
                    Come say hello
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-14 flex flex-col gap-2 border-t border-[#6B3E1E]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#8A7D72]">
            Find a store, explore the collection and experience MARVE in
            person.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6B3E1E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C98A50]" />
            Simple · Useful · Beautiful
          </div>
        </div>
      </div>
    </section>
  );
}