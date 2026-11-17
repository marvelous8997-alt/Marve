"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  Sparkles,
} from "lucide-react";

const VISIT_POINTS = [
  {
    id: 1,
    icon: Sparkles,
    title: "Explore Products In Person",
    description:
      "Take a closer look at thoughtfully chosen essentials and discover the details that make them special.",
  },
  {
    id: 2,
    icon: BadgeCheck,
    title: "Find What Fits Your Home",
    description:
      "Get a better feel for products and choose pieces that work naturally with your everyday lifestyle.",
  },
  {
    id: 3,
    icon: Heart,
    title: "Enjoy The MARVE Experience",
    description:
      "Take your time, explore at your own pace and discover something you'll love bringing home.",
  },
];

export default function StoreLocatorVisit() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          {/* Left Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#EDE5DC] shadow-[0_20px_60px_rgba(45,27,18,0.10)]">
              <div className="relative aspect-[4/4.5] sm:aspect-[4/4] lg:aspect-[4/4.3]">
                <Image
                  src="/assets/images/home/home_lifestyle.jpg"
                  alt="Explore the MARVE collection in store"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/55 via-transparent to-[#2D1B12]/5" />

                {/* Top Badge */}
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#2D1B12]/75 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:left-6 sm:top-6">
                  The MARVE Experience
                </div>

                {/* Bottom Text */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                    Take Your Time
                  </p>

                  <p className="mt-1.5 max-w-sm text-xl font-semibold leading-tight text-white sm:text-2xl">
                    Come in, explore and find something you'll love.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-5 right-4 max-w-[220px] rounded-2xl border border-[#E7DED4] bg-white px-4 py-3.5 shadow-[0_12px_35px_rgba(45,27,18,0.12)] sm:-right-5 sm:bottom-8 sm:px-5 sm:py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                  <Heart className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                    Made For You
                  </p>

                  <p className="mt-1 text-xs font-medium leading-5 text-[#29231F]">
                    Thoughtful essentials for everyday living.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="pointer-events-none absolute -left-8 -top-8 hidden h-28 w-28 rounded-full border border-[#C98A50]/25 sm:block" />
          </div>

          {/* Right Content */}
          <div className="max-w-xl lg:pl-2">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
              <Sparkles className="h-4 w-4" />
              Make A Visit
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
              Come Say
              <span className="block text-[#6B3E1E]">
                Hello.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 text-base leading-7 text-[#8A7D72] sm:text-lg">
              There's something special about discovering everyday essentials
              in person. Visit a MARVE store, explore the collection and take
              your time finding pieces that feel right for your home.
            </p>

            {/* Visit Points */}
            <div className="mt-8 space-y-5">
              {VISIT_POINTS.map((point) => {
                const Icon = point.icon;

                return (
                  <div
                    key={point.id}
                    className="group flex gap-4"
                  >
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E] transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Text */}
                    <div className="pt-0.5">
                      <h3 className="text-sm font-semibold text-[#29231F] sm:text-base">
                        {point.title}
                      </h3>

                      <p className="mt-1.5 text-sm leading-6 text-[#8A7D72]">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/common/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15"
              >
                Explore MARVE Collection
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#find-a-store"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6B3E1E]/15 bg-[#FFF9F2] px-6 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#F8F5F0]"
              >
                Find A Store
              </Link>
            </div>

            {/* Brand Note */}
            <div className="mt-9 border-t border-[#E7DED4] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                The MARVE Philosophy
              </p>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#8A7D72]">
                Simple choices. Thoughtfully selected. Made for the everyday
                moments that matter.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 text-center sm:mt-16 sm:flex-row sm:gap-4">
          <div className="h-px w-8 bg-[#C98A50]/50" />

          <p className="text-sm font-medium text-[#6B3E1E]">
            Your next everyday favourite might be closer than you think.
          </p>

          <div className="h-px w-8 bg-[#C98A50]/50" />
        </div>
      </div>
    </section>
  );
}