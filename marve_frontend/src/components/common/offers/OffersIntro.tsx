"use client";

import {
  Gift,
  Sparkles,
  Tag,
} from "lucide-react";

/* ========================= Highlights ========================= */

const HIGHLIGHTS = [
  {
    id: 1,
    icon: Tag,
    title: "Special Prices",
    description:
      "Enjoy selected MARVE favourites at prices that make everyday shopping even better.",
  },
  {
    id: 2,
    icon: Gift,
    title: "Thoughtful Offers",
    description:
      "Discover curated deals designed around products you'll actually use and enjoy.",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Limited-Time Picks",
    description:
      "Keep an eye on our latest offers as selected products and promotions change over time.",
  },
];

/* ========================= Component ========================= */

export default function OffersIntro() {
  return (
    <section
      id="offers"
      className="w-full bg-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Header ========================= */}

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
            A Little Something Extra
          </p>

          <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[40px] md:leading-[1.12]">
            Something special,
            <span className="text-[#6B3E1E]">
              {" "}
              just for you.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#8A7D72] sm:mt-5 sm:text-[15px] sm:leading-7">
            From special prices to limited-time promotions, our offers are
            created to make discovering everyday essentials a little more
            rewarding.
          </p>
        </div>

        {/* ========================= Highlights ========================= */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 lg:mt-14">
          {HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-[#6B3E1E]/8 bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/30 hover:shadow-[0_12px_35px_rgba(107,62,30,0.07)] sm:rounded-3xl sm:p-6"
              >
                {/* Number */}

                <span className="absolute right-5 top-5 text-[10px] font-medium tracking-[0.16em] text-[#6B3E1E]/20 sm:right-6 sm:top-6">
                  0{index + 1}
                </span>

                {/* Icon */}

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6B3E1E]/8 text-[#A66A32] transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                  />
                </div>

                {/* Content */}

                <h3 className="mt-6 text-sm font-semibold text-[#29231F] sm:text-[15px]">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs leading-5 text-[#8A7D72] sm:text-sm sm:leading-6">
                  {item.description}
                </p>

                {/* Accent */}

                <div className="mt-6 h-px w-7 bg-[#C98A50]/60 transition-all duration-300 group-hover:w-12 group-hover:bg-[#C98A50]" />
              </div>
            );
          })}
        </div>

        {/* ========================= Bottom Statement ========================= */}

        <div className="mt-10 flex flex-col items-center justify-center gap-2 text-center sm:mt-12 sm:flex-row sm:gap-3">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8A7D72] sm:text-xs">
            Thoughtful deals for everyday moments
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}