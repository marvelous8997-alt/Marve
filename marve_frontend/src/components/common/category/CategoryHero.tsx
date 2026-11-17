"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import type { CategoryData } from "@/src/constants/categoryData";

/* ========================= Props ========================= */

interface CategoryHeroProps {
  category: CategoryData;
}

/* ========================= Component ========================= */

export default function CategoryHero({
  category,
}: CategoryHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* ========================= Breadcrumb ========================= */}

        <div className="mb-8 flex items-center gap-1.5 text-[10px] font-medium text-[#8A7D72] sm:mb-10 sm:text-xs">
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-[#A66A32]"
          >
            Home
          </Link>

          <ChevronRight
            size={13}
            strokeWidth={1.5}
            className="text-[#B9AA9D]"
          />

          <span className="text-[#6B3E1E]">
            {category.name}
          </span>
        </div>

        {/* ========================= Hero Content ========================= */}

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* ========================= Left Content ========================= */}

          <div className="relative z-10">
            {/* Eyebrow */}

            <div className="mb-4 flex items-center gap-2 sm:mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E2D1] text-[#6B3E1E]">
                <Sparkles
                  size={13}
                  strokeWidth={1.5}
                />
              </span>

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
                Explore {category.name}
              </p>
            </div>

            {/* Heading */}

            <h1 className="max-w-xl text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-[#29231F] sm:text-4xl md:text-5xl lg:text-[52px]">
              Discover Beautiful {category.name} Essentials
            </h1>

            {/* Description */}

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#756B63] sm:mt-6 sm:text-[15px] sm:leading-7">
              {category.heroDescription}
            </p>

            {/* Actions */}

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Link
                href={`#${category.slug}-subcategories`}
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] sm:h-12 sm:px-7 sm:text-sm"
              >
                Explore Collection

                <ArrowRight
                  size={16}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={`#${category.slug}-products`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#D9C9BA] bg-white px-6 text-xs font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#A66A32] hover:bg-[#FFF9F2] sm:h-12 sm:px-7 sm:text-sm"
              >
                Shop Products
              </Link>
            </div>

            {/* Small Benefits */}

            <div className="mt-8 grid max-w-lg grid-cols-3 border-t border-[#E4D9CE] pt-5 sm:mt-10 sm:pt-6">
              <div className="pr-3">
                <p className="text-sm font-semibold text-[#29231F]">
                  Thoughtfully
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#8A7D72] sm:text-xs">
                  Chosen
                </p>
              </div>

              <div className="border-l border-[#E4D9CE] px-3">
                <p className="text-sm font-semibold text-[#29231F]">
                  Everyday
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#8A7D72] sm:text-xs">
                  Essentials
                </p>
              </div>

              <div className="border-l border-[#E4D9CE] pl-3">
                <p className="text-sm font-semibold text-[#29231F]">
                  Made For
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#8A7D72] sm:text-xs">
                  Real Homes
                </p>
              </div>
            </div>
          </div>

          {/* ========================= Right Image ========================= */}

          <div className="relative">
            {/* Decorative Background */}

            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#E5D5C5] sm:-right-10 sm:-top-10 sm:h-40 sm:w-40" />

            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full border border-[#E5D5C5] sm:-bottom-10 sm:-left-10 sm:h-32 sm:w-32" />

            {/* Main Image */}

            <div className="relative z-10 overflow-hidden rounded-[28px] bg-[#EDE3D9] shadow-[0_18px_45px_rgba(60,40,20,0.10)] sm:rounded-[34px]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={category.image}
                  alt={`${category.name} collection`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />

                {/* Image Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                {/* Image Badge */}

                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3.5 py-2 backdrop-blur-sm sm:left-5 sm:top-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6B3E1E] sm:text-[10px]">
                    MARVE Collection
                  </p>
                </div>

                {/* Bottom Image Content */}

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                  <div className="max-w-sm rounded-2xl border border-white/20 bg-white/90 p-4 backdrop-blur-md sm:p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                      {category.name}
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-[#29231F] sm:text-base">
                      Thoughtfully chosen for everyday living.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card */}

            <div className="absolute -bottom-5 right-3 z-20 hidden w-[150px] rounded-2xl border border-[#E8DDD2] bg-white p-3.5 shadow-[0_12px_30px_rgba(60,40,20,0.10)] sm:block sm:-bottom-6 sm:right-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                MARVE
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-[#39312B]">
                Beautiful. Useful. Everyday.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= Bottom Decorative Line ========================= */}

      <div className="h-px w-full bg-[#E7DDD3]" />
    </section>
  );
}