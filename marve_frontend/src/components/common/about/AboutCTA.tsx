"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const CTA_POINTS = [
  "Thoughtfully selected essentials",
  "Made for everyday living",
  "Simple, practical & beautiful",
];

export default function AboutCTA() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#FFF9F2] px-5 py-12 sm:px-8 sm:py-14 lg:px-14 lg:py-16">
          {/* Decorative Elements */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#C98A50]/15 sm:h-64 sm:w-64" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full border border-[#A66A32]/10 sm:h-64 sm:w-64" />

          <div className="pointer-events-none absolute right-8 top-8 hidden h-2 w-2 rounded-full bg-[#C98A50]/50 sm:block" />

          <div className="pointer-events-none absolute bottom-10 left-10 hidden h-1.5 w-1.5 rounded-full bg-[#A66A32]/40 sm:block" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            {/* ========================= Left Content ========================= */}

            <div className="max-w-2xl">
              {/* Eyebrow */}

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6B3E1E]/8 text-[#A66A32]">
                  <Sparkles
                    size={13}
                    strokeWidth={1.7}
                  />
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
                  Start Exploring
                </p>
              </div>

              {/* Heading */}

              <h2 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#29231F] sm:mt-5 sm:text-4xl md:text-[44px] lg:text-[48px]">
                Find something you&apos;ll
                <span className="block text-[#6B3E1E]">
                  love living with.
                </span>
              </h2>

              {/* Description */}

              <p className="mt-5 max-w-xl text-sm leading-6 text-[#8A7D72] sm:mt-6 sm:text-[15px] sm:leading-7">
                Discover thoughtfully chosen essentials for your kitchen,
                dining space and home. Simple pieces designed to fit
                beautifully into everyday life.
              </p>

              {/* CTA Buttons */}

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <Link
                  href="/common/products"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#A66A32] sm:w-auto"
                >
                  Explore Collection

                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/categories/kitchen"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#6B3E1E]/15 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#6B3E1E]/5 sm:w-auto"
                >
                  Shop Kitchen
                </Link>
              </div>
            </div>

            {/* ========================= Right Content ========================= */}

            <div className="relative lg:justify-self-end">
              <div className="rounded-3xl border border-[#6B3E1E]/8 bg-white/70 p-5 shadow-[0_12px_40px_rgba(107,62,30,0.06)] sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
                  Why you&apos;ll love MARVE
                </p>

                <div className="mt-5 space-y-4">
                  {CTA_POINTS.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B3E1E]/8 text-[#6B3E1E]">
                        <Check
                          size={11}
                          strokeWidth={2.2}
                        />
                      </span>

                      <p className="text-sm leading-5 text-[#39312B]">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}

                <div className="my-6 h-px w-full bg-[#6B3E1E]/8" />

                {/* Small Brand Statement */}

                <div>
                  <p className="text-lg font-medium leading-6 tracking-[-0.015em] text-[#29231F]">
                    Simple choices.
                    <br />
                    Better everyday moments.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#8A7D72]">
                    That&apos;s the idea behind MARVE.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Brand Note */}

        <div className="mt-7 flex flex-col items-center justify-center gap-1 text-center sm:mt-8 sm:flex-row sm:gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            MARVE
          </span>

          <span className="hidden text-[#C98A50]/50 sm:inline">
            ·
          </span>

          <span className="text-[10px] uppercase tracking-[0.14em] text-[#8A7D72]">
            Thoughtfully chosen for everyday living
          </span>
        </div>
      </div>
    </section>
  );
}