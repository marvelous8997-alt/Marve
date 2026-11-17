"use client";

import {
  BadgeCheck,
  Headphones,
  PackageCheck,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";

interface Highlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

const highlights: Highlight[] = [
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description:
      "A simple return process designed to make things comfortable and straightforward.",
  },
  {
    icon: PackageCheck,
    title: "Easy Exchanges",
    description:
      "Need something different? Exchange your product for an option that suits you better.",
  },
  {
    icon: BadgeCheck,
    title: "Simple Process",
    description:
      "Clear steps and helpful guidance from raising your request to final resolution.",
  },
  {
    icon: Headphones,
    title: "Helpful Support",
    description:
      "Our support team is here to assist with questions, concerns and order issues.",
  },
];

export default function ReturnExchangeHighlights() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-[#F8F5F0] px-4 py-2">
            <RefreshCcw className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              MARVE Care
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl">
            A Simpler Way to{" "}
            <span className="text-[#6B3E1E]">Shop With Confidence.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            We believe your shopping experience should feel just as thoughtful
            after your order arrives. Here's what you can expect from our
            return and exchange experience.
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#A66A32]/25 hover:bg-[#FFF9F2] hover:shadow-lg"
              >
                {/* Decorative Number */}
                <span className="pointer-events-none absolute right-5 top-4 text-5xl font-semibold leading-none text-[#6B3E1E]/[0.045]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Decorative Ring */}
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full border border-[#C98A50]/10 transition-transform duration-500 group-hover:scale-125" />

                {/* Icon */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#6B3E1E]/5 transition-all duration-300 group-hover:bg-[#6B3E1E]">
                  <Icon className="h-5 w-5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                </div>

                {/* Content */}
                <div className="relative mt-6">
                  <h3 className="text-base font-semibold text-[#39312B] sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="relative mt-6 h-px w-10 bg-[#C98A50] transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            For complete details, please review the return, exchange and refund
            guidelines below.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}