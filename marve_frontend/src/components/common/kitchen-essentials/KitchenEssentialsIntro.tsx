"use client";

import {
  ChefHat,
  CookingPot,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

const highlights = [
  {
    id: 1,
    icon: CookingPot,
    title: "Made for Everyday Cooking",
    description:
      "Practical essentials that make everyday cooking simpler and more enjoyable.",
  },
  {
    id: 2,
    icon: UtensilsCrossed,
    title: "Smart & Practical",
    description:
      "Thoughtfully designed pieces that bring function and ease to your kitchen.",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Beautifully Chosen",
    description:
      "Modern kitchen essentials that combine everyday usefulness with timeless style.",
  },
];

export default function KitchenEssentialsIntro() {
  return (
    <section className="w-full bg-[#FFF9F2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ========================= Intro Content ========================= */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A66A32] sm:text-xs">
            <ChefHat
              size={15}
              strokeWidth={1.5}
            />

            Made for Your Kitchen
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#29231F] sm:text-4xl lg:text-5xl">
            Beautiful essentials for
            <span className="block text-[#A66A32]">
              the heart of your home.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            From everyday cooking to serving and organising, discover
            thoughtfully chosen kitchen essentials that bring together
            practicality, comfort and effortless style.
          </p>
        </div>

        {/* ========================= Highlights ========================= */}

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5 lg:mt-16 lg:gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-[#E8DED4] bg-[#FCFAF7] px-5 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#DCC9B8] hover:shadow-[0_14px_35px_rgba(107,62,30,0.07)] sm:px-6 sm:py-7"
              >
                {/* Icon */}

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E] transition-all duration-300 group-hover:bg-[#A66A32] group-hover:text-white">
                  <Icon
                    size={21}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Title */}

                <h3 className="mt-4 text-sm font-semibold text-[#29231F] sm:text-base">
                  {item.title}
                </h3>

                {/* Description */}

                <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-[#8A7D72] sm:text-sm sm:leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ========================= Bottom Statement ========================= */}

        <div className="mt-12 flex items-center justify-center gap-3 sm:mt-14">
          <span className="h-px w-10 bg-[#D9C8B8] sm:w-16" />

          <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#A0958C] sm:text-[10px]">
            Cook · Serve · Organise
          </p>

          <span className="h-px w-10 bg-[#D9C8B8] sm:w-16" />
        </div>
      </div>
    </section>
  );
}