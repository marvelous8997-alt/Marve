"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import useCategory from "@/src/hooks/user/useCategory";

/* ========================= Constants ========================= */

const FALLBACK_IMAGE = "/assets/images/home/home_lifestyle.jpg";

/* ========================= Component ========================= */

export default function AboutCategories() {
  const {
    categories: backendCategories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  // Display all active categories from the backend.
  const categories = (backendCategories ?? []).filter(
    (category) => category.status === "ACTIVE",
  );

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Header */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              Explore MARVE
            </p>

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[38px] md:leading-[1.12]">
              Essentials for
              <span className="block text-[#6B3E1E]">
                every part of home.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#8A7D72] sm:text-right sm:text-[15px] sm:leading-7">
            From the kitchen to the living space, discover thoughtfully
            selected collections designed around everyday life.
          </p>
        </div>

        {/* Category Grid */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {/* Loading Skeletons */}

          {isLoading &&
            categories.length === 0 &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`category-skeleton-${index}`}
                className="aspect-[1.18/1] animate-pulse rounded-2xl bg-[#E8DDD2] sm:aspect-[1.2/1] sm:rounded-3xl"
              />
            ))}

          {/* Backend Categories */}

          {!isLoading &&
            categories.map((category, index) => {
              const imageUrl = category.image?.trim() || FALLBACK_IMAGE;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-[#E8DDD2] sm:rounded-3xl"
                >
                  {/* Image */}

                  <div className="relative aspect-[1.18/1] overflow-hidden sm:aspect-[1.2/1]">
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/75 via-[#2D1B12]/10 to-transparent transition-opacity duration-300 group-hover:from-[#2D1B12]/80" />

                    {/* Category Number */}

                    <span className="absolute right-4 top-4 text-[10px] font-semibold tracking-[0.16em] text-white/70 sm:right-5 sm:top-5">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Content */}

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0 max-w-[80%]">
                          <h3 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                            {category.name}
                          </h3>

                          {category.description && (
                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#6B3E1E]">
                          <ArrowUpRight
                            size={16}
                            strokeWidth={1.7}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>

        {/* Error State */}

        {!isLoading && error && (
          <div className="mt-8 text-center">
            <p className="text-sm text-[#8A5142]">
              Unable to load categories. Please try again.
            </p>

            <button
              type="button"
              onClick={() => void refreshCategories()}
              className="mt-3 text-sm font-semibold text-[#6B3E1E] underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}

        {!isLoading && !error && categories.length === 0 && (
          <p className="mt-8 text-center text-sm text-[#8A7D72]">
            No active categories available.
          </p>
        )}

        {/* Bottom Note */}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:mt-10 sm:flex-row">
          <span className="h-px w-8 bg-[#D8C6B6]" />

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A29488]">
            Made for the everyday moments that matter
          </p>

          <span className="h-px w-8 bg-[#D8C6B6]" />
        </div>
      </div>
    </section>
  );
}