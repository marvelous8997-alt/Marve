"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";

/* ========================= Constants ========================= */

const FALLBACK_IMAGE = "/assets/images/home/home_lifestyle.jpg";

/* ========================= Component ========================= */

export default function OffersCategories() {
  const {
    categories: backendCategories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  // Show all active categories from backend
  const categories = (backendCategories ?? []).filter(
    (category: UserCategory) => category.status === "ACTIVE",
  );

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Header ========================= */}

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
            Shop By Category
          </p>

          <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[40px] md:leading-[1.12]">
            Offers for every part of
            <span className="text-[#6B3E1E]"> home.</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#8A7D72] sm:mt-5 sm:text-[15px] sm:leading-7">
            Browse special offers across the categories you use every day,
            from the kitchen counter to your favourite corner at home.
          </p>
        </div>

        {/* ========================= Category Grid ========================= */}

        <div className="mt-10 sm:mt-12 lg:mt-14">
          {isLoading && categories.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-3xl bg-[#EDE5DC]"
                />
              ))}
            </div>
          ) : error && categories.length === 0 ? (
            <div className="rounded-2xl bg-[#F8F5F0] px-5 py-10 text-center">
              <p className="text-sm text-[#6B3E1E]">
                Unable to load categories. Please try again.
              </p>

              <button
                type="button"
                onClick={() => void refreshCategories()}
                className="mt-4 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4B2B16]"
              >
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl bg-[#F8F5F0] px-5 py-10 text-center">
              <p className="text-sm text-[#8A7D72]">
                No active categories are available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-3xl bg-[#EDE5DC]"
                >
                  {/* Image */}

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={category.image?.trim() || FALLBACK_IMAGE}
                      alt={`${category.name} offers`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/85 via-[#2D1B12]/20 to-transparent" />

                    {/* Number */}

                    <span className="absolute left-4 top-4 text-[10px] font-medium tracking-[0.18em] text-white/65 sm:left-5 sm:top-5">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Arrow */}

                    <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-[#6B3E1E] sm:right-5 sm:top-5">
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.7}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>

                    {/* Content */}

                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                      <p className="text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">
                        {category.name}
                      </p>

                      {category.description && (
                        <p className="mt-1.5 line-clamp-2 max-w-sm text-xs leading-5 text-white/65 sm:text-sm sm:leading-6">
                          {category.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#E0B07D] sm:text-[10px]">
                        <span>Shop Offers</span>

                        <span className="h-px w-5 bg-[#C98A50] transition-all duration-300 group-hover:w-8" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ========================= Bottom Statement ========================= */}

        <div className="mt-10 border-t border-[#6B3E1E]/[0.08] pt-7 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A66A32] sm:text-xs">
              MARVE Collection
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-[#C98A50] sm:block" />

            <p className="text-xs text-[#8A7D72] sm:text-sm">
              Thoughtful essentials, special prices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}