"use client";

import {
  Compass,
  Eye,
  Sparkles,
  Store,
} from "lucide-react";

const FEATURES = [
  {
    id: 1,
    icon: Store,
    title: "Explore In Person",
    description:
      "Take your time discovering MARVE essentials and see the collection up close.",
  },
  {
    id: 2,
    icon: Eye,
    title: "See Our Collection",
    description:
      "Experience the details, materials and thoughtful design behind everyday favourites.",
  },
  {
    id: 3,
    icon: Compass,
    title: "Find Your Way",
    description:
      "Quickly discover a nearby store and get the information you need before you visit.",
  },
];

export default function StoreLocatorIntro() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Sparkles className="h-4 w-4" />
            Your MARVE Experience
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Find Your Nearest
            <span className="block text-[#6B3E1E]">
              MARVE Store
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#8A7D72] sm:text-lg">
            Sometimes the best way to discover something new is to see it in
            person. Find a MARVE store near you and explore our thoughtfully
            chosen collection of everyday essentials at your own pace.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3 md:gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group relative overflow-hidden rounded-2xl border border-[#E7DED4] bg-[#FFF9F2] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/40 hover:shadow-[0_14px_40px_rgba(45,27,18,0.08)] sm:p-7"
              >
                {/* Number */}
                <div className="absolute right-5 top-5 text-xs font-semibold tracking-[0.12em] text-[#C98A50]/50">
                  0{feature.id}
                </div>

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#6B3E1E] shadow-sm ring-1 ring-[#6B3E1E]/5 transition-colors duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-[#29231F]">
                  {feature.title}
                </h3>

                <p className="mt-2.5 text-sm leading-6 text-[#8A7D72]">
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-6 h-px w-10 bg-[#C98A50] transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:mt-14 sm:flex-row sm:gap-4">
          <div className="h-px w-8 bg-[#C98A50]/50" />

          <p className="text-sm font-medium text-[#6B3E1E]">
            Discover thoughtfully chosen essentials, closer to you.
          </p>

          <div className="h-px w-8 bg-[#C98A50]/50" />
        </div>
      </div>
    </section>
  );
}