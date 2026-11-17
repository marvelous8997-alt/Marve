"use client";

import { Check, Sparkles } from "lucide-react";

const highlights = [
  "Thoughtfully Selected",
  "Everyday Essentials",
  "Made to Belong",
];

export default function NewArrivalsIntro() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-16">
          {/* ================= LEFT ================= */}
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              <Sparkles
                size={15}
                strokeWidth={1.6}
              />

              New This Season
            </div>

            <div className="mt-5 h-px w-16 bg-[#C98A50]" />
          </div>

          {/* ================= RIGHT ================= */}
          <div>
            <h2 className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-5xl">
              Fresh pieces for
              <span className="text-[#A66A32]"> everyday living.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#7B6E63] sm:mt-6 sm:text-base sm:leading-8">
              Explore the newest additions to MARVE — a thoughtful collection
              of home and kitchen essentials designed to bring warmth, style,
              and simplicity into everyday moments.
            </p>

            {/* ================= HIGHLIGHTS ================= */}
            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[#DED3C9] pt-6 sm:grid-cols-3 sm:gap-5">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-xs font-medium text-[#5F5147] sm:text-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8D7C6] text-[#6B3E1E]">
                    <Check
                      size={13}
                      strokeWidth={2}
                    />
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}