"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Home,
  Lightbulb,
  Sparkles,
} from "lucide-react";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full border border-[#C98A50]/15" />
      <div className="pointer-events-none absolute -left-16 top-28 h-40 w-40 rounded-full border border-[#C98A50]/10" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full border border-[#6B3E1E]/10" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-[#8A7D72] sm:mb-10">
          <Link
            href="/"
            className="transition-colors hover:text-[#6B3E1E]"
          >
            Home
          </Link>

          <span className="text-[#C98A50]">/</span>

          <span className="font-medium text-[#6B3E1E]">Blog</span>
        </div>

        {/* Hero Content */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/30 bg-[#FFF9F2] px-4 py-2">
              <BookOpen className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                The MARVE Journal
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#29231F] sm:text-5xl lg:text-6xl">
              Ideas for Better{" "}
              <span className="text-[#6B3E1E]">Everyday Living.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-[#8A7D72] sm:text-lg sm:leading-8">
              Discover thoughtful ideas, practical tips, home inspiration,
              kitchen guides, and simple ways to make everyday living feel
              more beautiful and effortless.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#blog-articles"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15"
              >
                Explore Articles

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/common/products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6B3E1E]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E] hover:bg-[#FFF9F2]"
              >
                Shop MARVE
              </Link>
            </div>

            {/* Highlights */}
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-[#6B3E1E]/10 bg-white/70 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0]">
                  <Home className="h-4 w-4 text-[#6B3E1E]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#39312B]">
                    Home Ideas
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8A7D72]">
                    Inspire your space
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#6B3E1E]/10 bg-white/70 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0]">
                  <ChefHat className="h-4 w-4 text-[#6B3E1E]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#39312B]">
                    Kitchen Tips
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8A7D72]">
                    Cook with ease
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#6B3E1E]/10 bg-white/70 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0]">
                  <Lightbulb className="h-4 w-4 text-[#6B3E1E]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#39312B]">
                    Useful Guides
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8A7D72]">
                    Simple everyday tips
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
            {/* Main Image */}
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE home and kitchen inspiration"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/55 via-transparent to-transparent" />

              {/* Image Badge */}
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
                <Sparkles className="h-4 w-4 text-[#A66A32]" />

                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B3E1E]">
                  MARVE Journal
                </span>
              </div>

              {/* Bottom Content Card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-[#2D1B12]/85 p-5 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#C98A50]">
                  Inspiration For Every Home
                </p>

                <h2 className="mt-2 max-w-md text-xl font-semibold leading-snug text-white sm:text-2xl">
                  Beautiful ideas. Useful tips. Better everyday living.
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Explore the MARVE Journal for inspiration made for real
                  homes and everyday moments.
                </p>
              </div>
            </div>

            {/* Floating Card — Top Right */}
            <div className="absolute -right-2 top-16 hidden rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-xl sm:block lg:-right-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F5F0]">
                  <Home className="h-5 w-5 text-[#6B3E1E]" />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#8A7D72]">
                    Discover
                  </p>
                  <p className="text-sm font-semibold text-[#39312B]">
                    Home Inspiration
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card — Bottom Left */}
            <div className="absolute -bottom-5 -left-2 hidden rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-xl sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9F2]">
                  <ChefHat className="h-5 w-5 text-[#A66A32]" />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#8A7D72]">
                    Read & Learn
                  </p>
                  <p className="text-sm font-semibold text-[#39312B]">
                    Kitchen Ideas
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Ring */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 hidden h-32 w-32 rounded-full border border-[#C98A50]/25 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}