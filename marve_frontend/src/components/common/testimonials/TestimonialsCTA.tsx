"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Sparkles,
} from "lucide-react";

export default function TestimonialsCTA() {
  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="relative overflow-hidden rounded-[28px] bg-[#6B3E1E] px-6 py-12 text-center sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full border border-white/10" />

          {/* Content */}
          <div className="relative mx-auto max-w-2xl">
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#C98A50]">
              <Heart
                size={21}
                fill="#C98A50"
                strokeWidth={1.5}
              />
            </div>

            {/* Eyebrow */}
            <div className="mt-5 inline-flex items-center gap-2">
              <Sparkles
                size={14}
                className="text-[#C98A50]"
                strokeWidth={1.6}
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                Made for Everyday Living
              </span>

              <Sparkles
                size={14}
                className="text-[#C98A50]"
                strokeWidth={1.6}
              />
            </div>

            {/* Heading */}
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-[42px]">
              Find something you’ll
              <span className="block text-[#C98A50]">
                love at MARVE.
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              Explore thoughtfully selected pieces designed to bring beauty,
              comfort and function into your everyday home.
            </p>

            {/* Button */}
            <div className="mt-7">
              <Link
                href="/common/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[#FFF9F2] px-6 py-3 text-sm font-semibold text-[#6B3E1E] transition-all duration-200 hover:bg-white"
              >
                Explore Our Collection

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}