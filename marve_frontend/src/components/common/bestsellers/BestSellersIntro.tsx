"use client";

import { Check, Heart } from "lucide-react";

const highlights = [
  "Loved by Our Customers",
  "Everyday Favourites",
  "Quality You Can Trust",
];

export default function BestSellersIntro() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-16">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              <Heart size={15} strokeWidth={1.6} />
              Customer Favourites
            </div>

            <div className="mt-5 h-px w-16 bg-[#C98A50]" />
          </div>

          {/* Right */}
          <div>
            <h2 className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-5xl">
              The pieces everyone
              <span className="text-[#A66A32]"> loves most.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#7B6E63] sm:mt-6 sm:text-base sm:leading-8">
              From everyday kitchen essentials to beautiful home accents,
              discover the products our customers choose, love, and come back
              for again and again.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[#DED3C9] pt-6 sm:grid-cols-3 sm:gap-5">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-xs font-medium text-[#5F5147] sm:text-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8D7C6] text-[#6B3E1E]">
                    <Check size={13} strokeWidth={2} />
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