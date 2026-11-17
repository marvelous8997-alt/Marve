"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Home,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Thoughtfully Chosen",
    description: "Useful pieces selected for everyday living.",
  },
  {
    icon: Home,
    title: "Made For Real Homes",
    description: "Beautiful essentials designed around your routines.",
  },
  {
    icon: Heart,
    title: "Made To Be Loved",
    description: "Simple details that bring warmth to every space.",
  },
];

export default function BlogCTA() {
  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Main CTA */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#2D1B12]">
          {/* Decorative Rings */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#C98A50]/20" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#C98A50]/10" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full border border-white/5" />

          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* Content */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#C98A50]/30 bg-white/5 px-4 py-2">
                <Sparkles className="h-4 w-4 text-[#C98A50]" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C98A50]">
                  Bring The Inspiration Home
                </span>
              </div>

              {/* Heading */}
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Make Your Everyday Space Feel More Like{" "}
                <span className="text-[#C98A50]">Home.</span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Found something you love in the MARVE Journal? Explore our
                collection of thoughtful home and kitchen essentials designed
                to bring beauty and function into everyday moments.
              </p>

              {/* Benefits */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-4 w-4 text-[#C98A50]" />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-white">
                        {benefit.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-white/50">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/common/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#FFF9F2] hover:shadow-lg"
                >
                  Explore MARVE Collection

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/common/gift"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                >
                  Explore Gifting
                </Link>
              </div>

              {/* Trust Note */}
              <div className="mt-7 flex items-center gap-2 text-xs text-white/50">
                <CheckCircle2 className="h-4 w-4 text-[#C98A50]" />

                <span>
                  Thoughtful essentials for kitchen, dining, storage & home.
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative min-h-[360px] overflow-hidden lg:min-h-[620px]">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE home and kitchen collection"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/65 via-[#2D1B12]/10 to-transparent lg:bg-gradient-to-r lg:from-[#2D1B12]/30 lg:via-transparent lg:to-transparent" />

              {/* Image Badge */}
              <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#A66A32]" />

                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B3E1E]">
                    MARVE Home
                  </span>
                </div>
              </div>

              {/* Image Content Card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#2D1B12]/80 p-5 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#C98A50]">
                  Thoughtful Everyday Living
                </p>

                <h3 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">
                  Beautiful. Useful. Made for everyday moments.
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Discover pieces that fit naturally into the way you live.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#6B3E1E]/10 bg-white px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
              <Home className="h-4 w-4 text-[#6B3E1E]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#39312B]">
                Home Essentials
              </p>

              <p className="mt-0.5 text-xs text-[#8A7D72]">
                Thoughtful everyday pieces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#6B3E1E]/10 bg-white px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
              <Sparkles className="h-4 w-4 text-[#A66A32]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#39312B]">
                Kitchen & Dining
              </p>

              <p className="mt-0.5 text-xs text-[#8A7D72]">
                Made for everyday use
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#6B3E1E]/10 bg-white px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
              <Heart className="h-4 w-4 text-[#6B3E1E]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#39312B]">
                Thoughtful Gifting
              </p>

              <p className="mt-0.5 text-xs text-[#8A7D72]">
                Gifts for every occasion
              </p>
            </div>
          </div>
        </div>

        {/* Closing Note */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-10 bg-[#C98A50]/40" />

          <p className="text-sm text-[#8A7D72]">
            Read something inspiring. Find something you love. Bring it home.
          </p>

          <span className="h-px w-10 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}