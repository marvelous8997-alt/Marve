"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

import type { CategoryData } from "@/src/constants/categoryData";

/* ========================= Props ========================= */

interface CategoryPromoProps {
  category: CategoryData;
}

/* ========================= Component ========================= */

export default function CategoryPromo({
  category,
}: CategoryPromoProps) {
  const title = `Make More of Your ${category.name}`;

  const description = `Discover thoughtfully selected ${category.name.toLowerCase()} essentials designed to bring more beauty, ease and function into everyday living.`;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-[26px] bg-[#2D1B12]">
          {/* ========================= Background Image ========================= */}

          <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
            <Image
              src={category.image}
              alt={`${category.name} collection`}
              fill
              sizes="48vw"
              className="object-cover opacity-75"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B12] via-[#2D1B12]/70 to-[#2D1B12]/10" />
          </div>

          {/* ========================= Mobile Image ========================= */}

          <div className="relative h-52 w-full lg:hidden">
            <Image
              src={category.image}
              alt={`${category.name} collection`}
              fill
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12] via-[#2D1B12]/35 to-transparent" />
          </div>

          {/* ========================= Decorative Elements ========================= */}

          <div className="pointer-events-none absolute -right-16 -top-16 hidden h-40 w-40 rounded-full border border-white/10 lg:block" />

          <div className="pointer-events-none absolute -right-6 -top-6 hidden h-20 w-20 rounded-full border border-[#C98A50]/20 lg:block" />

          <div className="pointer-events-none absolute bottom-[-50px] left-[42%] h-32 w-32 rounded-full border border-white/[0.06]" />

          {/* ========================= Content ========================= */}

          <div className="relative z-10 px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8 lg:min-h-[390px] lg:max-w-[62%] lg:px-10 lg:py-12 xl:px-12">
            {/* Eyebrow */}

            <div className="flex items-center gap-2">
              <Sparkles
                size={13}
                strokeWidth={1.5}
                className="text-[#C98A50]"
              />

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C98A50] sm:text-[10px]">
                MARVE Curated Collection
              </p>
            </div>

            {/* Heading */}

            <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl md:text-4xl lg:text-[40px] lg:leading-[1.12]">
              {title}
            </h2>

            {/* Description */}

            <p className="mt-4 max-w-lg text-xs leading-5 text-white/65 sm:text-sm sm:leading-6">
              {description}
            </p>

            {/* ========================= Benefits ========================= */}

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4">
              {[
                "Thoughtfully selected",
                "Made for everyday",
                "Beautiful & useful",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-[10px] text-white/70 sm:text-xs"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#C98A50]">
                    <Check
                      size={11}
                      strokeWidth={2}
                    />
                  </span>

                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* ========================= CTA ========================= */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={`#${category.slug}-products`}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#FFF9F2] sm:w-auto sm:px-6"
              >
                Shop {category.name}

                <ArrowRight
                  size={14}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={`#${category.slug}-subcategories`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs font-semibold text-white/85 transition-all duration-300 hover:border-white/35 hover:bg-white/5 sm:w-auto sm:px-6"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}