"use client";

import { Check, House } from "lucide-react";

const highlights = [
  "Beautiful Everyday Pieces",
  "Made for Modern Homes",
  "Comfort Meets Function",
];

export default function HomeEssentialsIntro() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              <House
                size={15}
                strokeWidth={1.6}
              />
              Made for Your Home
            </div>

            <div className="mt-5 h-px w-16 bg-[#C98A50]" />
          </div>
          <div>
            <h2 className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-5xl">
              Everything your home needs,
              <span className="text-[#A66A32]">
                {" "}
                beautifully chosen.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#7B6E63] sm:mt-6 sm:text-base sm:leading-8">
              Discover thoughtfully selected pieces designed to make everyday
              spaces more comfortable, organised and beautiful. From useful
              essentials to simple home accents, find pieces that naturally
              belong in your home.
            </p>
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