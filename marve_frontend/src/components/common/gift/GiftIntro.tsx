"use client";

import {
  BadgeCheck,
  Gift,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const GIFT_POINTS = [
  {
    id: 1,
    icon: Gift,
    title: "For Every Occasion",
    description:
      "Thoughtful home and kitchen essentials for birthdays, housewarmings, weddings, festivals and everyday celebrations.",
  },
  {
    id: 2,
    icon: Heart,
    title: "For Every Home",
    description:
      "Beautiful and useful pieces that feel personal while fitting naturally into everyday living.",
  },
  {
    id: 3,
    icon: BadgeCheck,
    title: "For Every Budget",
    description:
      "Explore meaningful gifting options across different price points without compromising on style or usefulness.",
  },
];

export default function GiftIntro() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#C98A50]/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#6B3E1E]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Sparkles className="h-4 w-4" />
            Gifting Made Thoughtful
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Make Every Gift
            <span className="block text-[#6B3E1E]">Feel Special</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:text-lg">
            From useful kitchen favourites to beautiful pieces for the home,
            discover thoughtful MARVE gifts made for the people and moments
            that matter.
          </p>
        </div>

        {/* Gift Points */}
        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {GIFT_POINTS.map((point, index) => {
              const Icon = point.icon;

              return (
                <div
                  key={point.id}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-[#E7DED4] bg-[#FFF9F2] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/40 hover:shadow-[0_18px_45px_rgba(45,27,18,0.08)] sm:p-7"
                >
                  {/* Card Number */}
                  <div className="absolute right-5 top-5 text-[10px] font-semibold tracking-[0.14em] text-[#C98A50]/50">
                    0{index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6B3E1E] shadow-sm transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-lg font-semibold text-[#29231F] sm:text-xl">
                    {point.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#8A7D72]">
                    {point.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#6B3E1E]">
                    <span className="h-px w-7 bg-[#C98A50] transition-all duration-300 group-hover:w-10" />
                    MARVE Gifting
                  </div>

                  {/* Decorative Shape */}
                  <div className="pointer-events-none absolute -bottom-12 -right-12 h-28 w-28 rounded-full border border-[#C98A50]/10 transition-transform duration-500 group-hover:scale-125" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Statement */}
        <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#E7DED4] bg-[#F8F5F0] px-5 py-6 sm:px-8 sm:py-7">
            {/* Decorative Icon */}
            <div className="absolute -right-5 -top-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#C98A50]/15">
              <Gift className="h-7 w-7 text-[#C98A50]/40" />
            </div>

            <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#6B3E1E] shadow-sm">
                  <Heart className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#29231F] sm:text-base">
                    A thoughtful gift is more than just a present.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72] sm:text-sm">
                    Choose something beautiful, practical and made to be part
                    of everyday life.
                  </p>
                </div>
              </div>

              <a
                href="#gift-occasions"
                className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32] sm:text-sm"
              >
                Find Your Gift
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}