"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Star } from "lucide-react";

const HERO_IMAGE = "/assets/images/home/home_lifestyle.jpg";

export default function TestimonialsHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0]">
      <div className="mx-auto grid min-h-[430px] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        {/* ==================== Content ==================== */}
        <div className="max-w-xl">
          {/* Small Label */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-[#FFF9F2] px-4 py-2">
            <Star
              size={14}
              fill="#C98A50"
              className="text-[#C98A50]"
              strokeWidth={1.7}
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A7D72]">
              Customer Love
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#29231F] sm:text-5xl lg:text-6xl">
            Loved by the people
            <span className="mt-1 block text-[#6B3E1E]">
              who shop with us.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#8A7D72] sm:text-base">
            Discover what our customers have to say about their experience
            with MARVE and the products they bring into their everyday lives.
          </p>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="#customer-reviews"
              className="group inline-flex items-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#A66A32]"
            >
              Read Customer Reviews

              <ArrowRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <div className="flex items-center gap-2 px-1 text-sm text-[#8A7D72]">
              <Heart
                size={16}
                className="text-[#A66A32]"
                fill="#A66A32"
                strokeWidth={1.5}
              />
              <span>Real customer experiences</span>
            </div>
          </div>
        </div>

        {/* ==================== Image ==================== */}
        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
          <div className="relative overflow-hidden rounded-[28px] bg-[#FFF9F2]">
            <div className="relative aspect-[4/3]">
              <Image
                src={HERO_IMAGE}
                alt="MARVE customer experience"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Soft Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#29231F]/25 via-transparent to-transparent" />
            </div>

            {/* Rating Card */}
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-[0_10px_35px_rgba(41,35,31,0.12)] backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:min-w-[245px]">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    fill="#C98A50"
                    className="text-[#C98A50]"
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              <p className="mt-2 text-sm font-semibold text-[#29231F]">
                Thank you for choosing MARVE
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                Every review helps us create better everyday experiences.
              </p>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full border border-[#C98A50]/25 sm:-right-5 sm:-top-5 sm:h-20 sm:w-20" />
        </div>
      </div>
    </section>
  );
}