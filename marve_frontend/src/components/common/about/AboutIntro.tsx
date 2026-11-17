"use client";

import {
  Heart,
  Leaf,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

/* ========================= Highlight Data ========================= */

const HIGHLIGHTS = [
  {
    id: 1,
    icon: Sparkles,
    title: "Thoughtfully Chosen",
    description:
      "Every product is selected with a focus on usefulness, simplicity and everyday appeal.",
  },
  {
    id: 2,
    icon: UtensilsCrossed,
    title: "Made for Everyday",
    description:
      "From kitchen essentials to home favourites, our collection fits naturally into daily life.",
  },
  {
    id: 3,
    icon: Heart,
    title: "Beautifully Practical",
    description:
      "We believe everyday products can be functional while still feeling beautiful and considered.",
  },
  {
    id: 4,
    icon: Leaf,
    title: "Simple Living",
    description:
      "Our approach is about creating spaces and routines that feel comfortable, organised and effortless.",
  },
];

/* ========================= Component ========================= */

export default function AboutIntro() {
  return (
    <section
      id="our-story"
      className="w-full bg-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Intro Content ========================= */}

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
            A Little About MARVE
          </p>

          <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[38px]">
            Everyday essentials,
            <span className="block text-[#6B3E1E]">
              chosen with intention.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#8A7D72] sm:mt-5 sm:text-[15px] sm:leading-7">
            At MARVE, we believe the things we use every day should make
            life easier, more comfortable and a little more beautiful.
            That&apos;s why we bring together thoughtfully selected
            products for your kitchen, dining spaces, storage and home.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#8A7D72] sm:text-[15px] sm:leading-7">
            Our collection is built around a simple idea — practical
            products don&apos;t have to compromise on style, and beautiful
            products should have a purpose.
          </p>
        </div>

        {/* ========================= Highlights ========================= */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-[#E8DED4] bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C4B2] hover:bg-white hover:shadow-[0_12px_30px_rgba(107,62,30,0.07)] sm:p-6"
              >
                {/* Icon */}

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E] transition-colors duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Title */}

                <h3 className="mt-5 text-sm font-semibold text-[#29231F] sm:text-[15px]">
                  {item.title}
                </h3>

                {/* Description */}

                <p className="mt-2 text-xs leading-5 text-[#8A7D72] sm:text-sm sm:leading-6">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ========================= Brand Statement ========================= */}

        <div className="mx-auto mt-12 max-w-4xl sm:mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-[#E4D7CB] bg-[#F8F5F0] px-6 py-8 text-center sm:rounded-3xl sm:px-10 sm:py-10">
            {/* Decorative Element */}

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#DCC8B7] bg-[#F2E4D5]/40" />

            <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full border border-[#E1D1C2] bg-[#FFF9F2]/50" />

            {/* Content */}

            <div className="relative">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                <Heart
                  size={16}
                  strokeWidth={1.5}
                />
              </div>

              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[#6B3E1E] sm:text-lg sm:leading-8">
                &ldquo;We want to make choosing everyday essentials feel
                simple, thoughtful and enjoyable.&rdquo;
              </p>

              <div className="mx-auto mt-4 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[#D6C2B0]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A29488]">
                  The MARVE Philosophy
                </span>

                <span className="h-px w-8 bg-[#D6C2B0]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}