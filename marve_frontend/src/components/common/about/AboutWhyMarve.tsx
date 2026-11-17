"use client";

import {
  BadgeCheck,
  Heart,
  PackageCheck,
  Sparkles,
} from "lucide-react";

/* ========================= Why MARVE Data ========================= */

const WHY_MARVE = [
  {
    id: 1,
    icon: Sparkles,
    title: "Thoughtfully Selected",
    description:
      "We focus on products that offer a meaningful balance of usefulness, quality and everyday appeal.",
  },
  {
    id: 2,
    icon: BadgeCheck,
    title: "Quality Matters",
    description:
      "We look for dependable products and details that make them enjoyable to use day after day.",
  },
  {
    id: 3,
    icon: PackageCheck,
    title: "Made for Everyday",
    description:
      "Our collections are built around real routines, from cooking and organising to dining and relaxing.",
  },
  {
    id: 4,
    icon: Heart,
    title: "A Better Experience",
    description:
      "From discovering products to bringing them home, we aim to keep your shopping experience simple and enjoyable.",
  },
];

/* ========================= Component ========================= */

export default function AboutWhyMarve() {
  return (
    <section className="w-full bg-[#2D1B12]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          {/* ========================= Left Content ========================= */}

          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C98A50] sm:text-xs">
              Why MARVE
            </p>

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-white sm:mt-3 sm:text-3xl md:text-[40px] md:leading-[1.12]">
              More than products.
              <span className="block text-[#E0B07D]">
                It&apos;s about everyday living.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-white/65 sm:mt-6 sm:text-[15px] sm:leading-7">
              We created MARVE to make finding everyday essentials feel
              less overwhelming and more intentional. Every collection
              is built around products that can naturally become part of
              your home and your routine.
            </p>

            {/* Decorative Quote */}

            <div className="mt-8 border-l border-[#C98A50]/70 pl-5 sm:mt-10 sm:pl-6">
              <p className="text-sm font-medium leading-6 text-[#F4E4D4] sm:text-[15px] sm:leading-7">
                Good design should make everyday life feel a little
                easier, a little calmer and a little more enjoyable.
              </p>
            </div>

            {/* Brand Mark */}

            <div className="mt-8 flex items-center gap-3 sm:mt-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C98A50]/40 text-[#C98A50]">
                <Sparkles
                  size={14}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C98A50]">
                  The MARVE Approach
                </p>

                <p className="mt-0.5 text-xs text-white/50">
                  Simple. Useful. Beautiful.
                </p>
              </div>
            </div>
          </div>

          {/* ========================= Features ========================= */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {WHY_MARVE.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-white/10 bg-white/[0.055] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/40 hover:bg-white/[0.09] sm:rounded-3xl sm:p-6"
                >
                  {/* Top Row */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C98A50]/10 text-[#E0B07D] transition-colors duration-300 group-hover:bg-[#C98A50] group-hover:text-white">
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                      />
                    </div>

                    <span className="text-[10px] font-medium tracking-[0.16em] text-white/25">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Content */}

                  <h3 className="mt-6 text-sm font-semibold text-white sm:text-[15px]">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">
                    {item.description}
                  </p>

                  {/* Bottom Accent */}

                  <div className="mt-6 h-px w-7 bg-[#C98A50]/60 transition-all duration-300 group-hover:w-12 group-hover:bg-[#C98A50]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================= Bottom Statement ========================= */}

        <div className="mt-12 border-t border-white/10 pt-7 sm:mt-14 sm:pt-8">
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C98A50] sm:text-xs">
              MARVE · Everyday Essentials
            </p>

            <p className="text-xs leading-5 text-white/40 sm:text-right sm:text-sm">
              Carefully chosen for the way you live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}