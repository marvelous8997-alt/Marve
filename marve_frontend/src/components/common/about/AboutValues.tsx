"use client";

import {
  BadgeCheck,
  Heart,
  Lightbulb,
  Sparkles,
} from "lucide-react";

/* ========================= Value Data ========================= */

const VALUES = [
  {
    id: 1,
    icon: Sparkles,
    number: "01",
    title: "Thoughtfully Chosen",
    description:
      "We carefully select products that bring genuine value to everyday routines, focusing on usefulness, quality and timeless appeal.",
  },
  {
    id: 2,
    icon: Lightbulb,
    number: "02",
    title: "Smart & Practical",
    description:
      "Everyday products should make life easier. We look for thoughtful details, practical designs and solutions that simply work.",
  },
  {
    id: 3,
    icon: Heart,
    number: "03",
    title: "Beautifully Simple",
    description:
      "We believe functionality and aesthetics belong together. Our collection is designed to feel as good as it works.",
  },
  {
    id: 4,
    icon: BadgeCheck,
    number: "04",
    title: "Quality First",
    description:
      "From the products we choose to the experience we create, we aim for dependable quality and attention to detail.",
  },
];

/* ========================= Component ========================= */

export default function AboutValues() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Header ========================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              What We Believe
            </p>

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[38px] md:leading-[1.12]">
              The values behind
              <span className="block text-[#6B3E1E]">
                everything we do.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-[#8A7D72] sm:text-[15px] sm:leading-7 lg:ml-auto">
            MARVE is built around a few simple principles. They guide
            how we choose our products, how we present them and how we
            think about the everyday experience we want to create.
          </p>
        </div>

        {/* ========================= Values Grid ========================= */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.id}
                className="group relative overflow-hidden rounded-2xl border border-[#E5D9CE] bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6C1AE] hover:bg-white hover:shadow-[0_14px_35px_rgba(107,62,30,0.08)] sm:rounded-3xl sm:p-6"
              >
                {/* Decorative Number */}

                <span className="absolute right-5 top-4 text-[34px] font-semibold leading-none tracking-[-0.04em] text-[#E9DED4] transition-colors duration-300 group-hover:text-[#E3D2C3] sm:right-6 sm:top-5">
                  {value.number}
                </span>

                {/* Icon */}

                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E] transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                  <Icon
                    size={19}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}

                <div className="relative">
                  <h3 className="mt-6 text-sm font-semibold text-[#29231F] sm:text-[15px]">
                    {value.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-5 text-[#8A7D72] sm:text-sm sm:leading-6">
                    {value.description}
                  </p>
                </div>

                {/* Bottom Accent */}

                <div className="mt-6 h-px w-8 bg-[#C98A50] transition-all duration-300 group-hover:w-14" />
              </article>
            );
          })}
        </div>

        {/* ========================= Bottom Statement ========================= */}

        <div className="mt-10 border-t border-[#E8DED4] pt-8 sm:mt-12 sm:pt-10">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-[#6B3E1E]" />

              <p className="text-sm font-medium text-[#39312B] sm:text-[15px]">
                Designed around the way you live.
              </p>
            </div>

            <p className="max-w-lg text-xs leading-5 text-[#8A7D72] sm:text-right sm:text-sm sm:leading-6">
              Because the best everyday essentials are the ones that
              quietly make life a little easier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}