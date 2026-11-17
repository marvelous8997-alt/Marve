"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Gift,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

const PROMO_POINTS = [
  {
    id: 1,
    icon: Gift,
    title: "Thoughtfully Chosen",
    description: "Useful pieces made for everyday living.",
  },
  {
    id: 2,
    icon: Heart,
    title: "Made To Delight",
    description: "Beautiful gifts for people and moments that matter.",
  },
  {
    id: 3,
    icon: BadgeCheck,
    title: "Every Budget",
    description: "Meaningful gifting options across price points.",
  },
];

export default function GiftPromo() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#C98A50]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-[#6B3E1E]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#2D1B12] shadow-[0_25px_70px_rgba(45,27,18,0.18)]">
            {/* Decorative Rings */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full border border-[#C98A50]/15" />

            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              {/* ========================= Content ========================= */}

              <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                {/* Eyebrow */}
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F4D6B4]">
                  <Sparkles className="h-3.5 w-3.5" />
                  The MARVE Gift Edit
                </div>

                {/* Heading */}
                <h2 className="mt-6 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Give Something
                  <span className="block text-[#D8A16A]">
                    They&apos;ll Remember.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Discover thoughtful home and kitchen pieces chosen to make
                  birthdays, housewarmings, celebrations and everyday moments
                  a little more special.
                </p>

                {/* Points */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
                  {PROMO_POINTS.map((point) => {
                    const Icon = point.icon;

                    return (
                      <div
                        key={point.id}
                        className="flex items-start gap-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F4D6B4]">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white sm:text-sm">
                            {point.title}
                          </p>

                          <p className="mt-0.5 text-[11px] leading-5 text-white/45 sm:text-xs">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/common/products"
                    className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-xs font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#F4D6B4] hover:shadow-lg sm:px-6 sm:text-sm"
                  >
                    Explore Gift Collection
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="#gift-occasions"
                    className="group inline-flex w-fit items-center gap-1.5 px-2 py-2 text-xs font-semibold text-white/70 transition-colors hover:text-white sm:text-sm"
                  >
                    Shop By Occasion
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Small Trust Note */}
                <div className="mt-7 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Star
                        key={item}
                        className="h-3 w-3 fill-[#C98A50] text-[#C98A50]"
                      />
                    ))}
                  </div>

                  <span className="text-[10px] text-white/40 sm:text-xs">
                    Thoughtful picks for every kind of home
                  </span>
                </div>
              </div>

              {/* ========================= Image ========================= */}

              <div className="relative min-h-[340px] overflow-hidden lg:min-h-full">
                <Image
                  src="/assets/images/home/home_lifestyle.jpg"
                  alt="MARVE home and kitchen gifting collection"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/75 via-[#2D1B12]/15 to-transparent" />

                <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6B3E1E] shadow-sm">
                        <Gift className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F4D6B4]">
                          MARVE Gifting
                        </p>

                        <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                          Beautiful. Useful. Thoughtful.
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-white/60">
                          Gifts designed to become part of everyday life.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-[#2D1B12]/65 px-3 py-2 backdrop-blur-md">
                    <Heart className="h-3.5 w-3.5 text-[#F4D6B4]" />

                    <span className="text-[10px] font-semibold text-white">
                      Made For Moments
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Mini Features */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E7DED4] bg-[#FFF9F2] px-4 py-3 text-center sm:justify-start">
              <Gift className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-medium text-[#6B3E1E]">
                Gifts For Every Occasion
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E7DED4] bg-[#FFF9F2] px-4 py-3 text-center sm:justify-start">
              <Heart className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-medium text-[#6B3E1E]">
                Thoughtful Home Essentials
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E7DED4] bg-[#FFF9F2] px-4 py-3 text-center sm:justify-start">
              <Sparkles className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-medium text-[#6B3E1E]">
                Something For Every Budget
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}